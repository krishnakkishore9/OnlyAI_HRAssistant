import { NextResponse } from "next/server";
import { getChatCompletion, HR_SYSTEM_PROMPT } from "@/lib/ai/groq";
import { getRelevantPolicies } from "@/lib/ai/rag";
import { logAuditEvent } from "@/lib/logic/audit-logger";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // 1. Retrieve relevant policy context
    const policyContext = await getRelevantPolicies(lastMessage);

    // 2. Fetch User Personal Data (if userId provided)
    let userContext = "No personal data available.";
    if (userId) {
      const userDoc = await adminDb.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        userContext = `
          USER PROFILE:
          - Name: ${userData?.displayName}
          - Leave Balance: ${userData?.leaveBalance} days
          - Tenure: ${userData?.tenureMonths} months
          - Role: ${userData?.role}
        `;
      }
    }

    // 3. Prepare the messages with system prompt and combined context
    const fullMessages = [
      {
        role: "system",
        content: HR_SYSTEM_PROMPT
          .replace("{context}", policyContext)
          .concat(`\n\n${userContext}`),
      },
      ...messages,
    ];

    // 4. Get AI completion
    const aiResponse = await getChatCompletion(fullMessages);

    // 5. Audit Log
    await logAuditEvent({
      userId: userId || "unknown",
      type: "CHAT_RESPONSE",
      description: `AI responded to: "${lastMessage.substring(0, 50)}..."`,
      metadata: { response: aiResponse.substring(0, 100) }
    });

    return NextResponse.json({ message: aiResponse });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

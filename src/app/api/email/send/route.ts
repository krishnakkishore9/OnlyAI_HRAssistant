import { NextResponse } from "next/server";
import { sendLeaveEmail } from "@/lib/email/sender";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, text, userId } = body;

    console.log(`📬 Incoming email request to: ${to} | Subject: ${subject}`);

    // Try to get the user's email for the replyTo header
    let replyTo = undefined;
    if (userId) {
      const userSnap = await adminDb.collection("users").doc(userId).get();
      if (userSnap.exists) {
        replyTo = userSnap.data()?.email;
      }
    }

    if (!to || !subject || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendLeaveEmail(to, subject, text, replyTo);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Email Send API Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

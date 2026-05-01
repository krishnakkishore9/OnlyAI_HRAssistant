import { adminDb } from "@/lib/firebase-admin";

/**
 * Centralized Audit Logger
 */
export async function logAuditEvent(event: {
  userId: string;
  type: "CHAT_RESPONSE" | "LEAVE_DECISION" | "EMAIL_SENT" | "SYSTEM_ERROR";
  description: string;
  metadata?: any;
}) {
  try {
    const logRef = adminDb.collection("logs").doc();
    await logRef.set({
      ...event,
      timestamp: new Date().toISOString(),
    });
    console.log(`[AUDIT] ${event.type} logged for user ${event.userId}`);
  } catch (error) {
    console.error("Audit Logging Error:", error);
  }
}

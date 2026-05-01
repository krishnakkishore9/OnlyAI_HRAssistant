import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { validateLeaveRequest } from "@/lib/logic/decision-engine";
import { logAuditEvent } from "@/lib/logic/audit-logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, startDate, endDate, leaveType } = body;

    // 1. Calculate requested days (simplified)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 2. Fetch User Data from Firestore
    const userDoc = await adminDb.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const input = {
      userId,
      leaveBalance: userData?.leaveBalance || 0,
      requestedDays,
      leaveType,
      tenureMonths: userData?.tenureMonths || 0,
    };

    // 3. Run Decision Engine
    const decision = validateLeaveRequest(input);

    // 4. Save Request to Firestore
    const requestRef = adminDb.collection("leave_requests").doc();
    await requestRef.set({
      userId,
      startDate,
      endDate,
      requestedDays,
      leaveType,
      status: decision.status,
      reason: decision.reason,
      createdAt: new Date().toISOString(),
    });

    // 5. Update User Balance if APPROVED
    if (decision.status === "APPROVED") {
      await adminDb.collection("users").doc(userId).update({
        leaveBalance: (userData?.leaveBalance || 0) - requestedDays,
      });
    }

    // 6. Audit Log
    await logAuditEvent({
      userId,
      type: "LEAVE_DECISION",
      description: `Decision for ${requestedDays} days of ${leaveType}: ${decision.status}`,
      metadata: { decision }
    });

    return NextResponse.json({
      requestId: requestRef.id,
      ...decision,
    });
  } catch (error: any) {
    console.error("Leave Request API Error:", error);
    return NextResponse.json(
      { error: "Failed to process leave request" },
      { status: 500 }
    );
  }
}

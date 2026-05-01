/**
 * Deterministic Decision Engine for HR Leave Requests
 */

export interface LeaveRequestInput {
  userId: string;
  leaveBalance: number;
  requestedDays: number;
  leaveType: string;
  tenureMonths: number;
}

export interface DecisionResult {
  status: "APPROVED" | "REJECTED" | "REVIEW";
  reason: string;
}

export function validateLeaveRequest(input: LeaveRequestInput): DecisionResult {
  const { leaveBalance, requestedDays, leaveType, tenureMonths } = input;

  // Rule 1: Probation Check (3 months)
  if (tenureMonths < 3 && leaveType !== "sick") {
    return {
      status: "REVIEW",
      reason: "Employee is currently in the 3-month probation period. Manual HR review is required for non-sick leave.",
    };
  }

  // Rule 2: Balance Check
  if (requestedDays > leaveBalance) {
    return {
      status: "REJECTED",
      reason: `Insufficient leave balance. Requested ${requestedDays} days, but only ${leaveBalance} days are available.`,
    };
  }

  // Rule 3: Policy Max Check (e.g., max 10 days per request)
  const MAX_CONSECUTIVE_DAYS = 10;
  if (requestedDays > MAX_CONSECUTIVE_DAYS) {
    return {
      status: "REVIEW",
      reason: `Requests exceeding ${MAX_CONSECUTIVE_DAYS} consecutive days require manual HR approval.`,
    };
  }

  // If all checks pass
  return {
    status: "APPROVED",
    reason: "Request meets all policy criteria and leave balance is sufficient.",
  };
}

# ⚙️ 03. Automated Decision Engine

## 3.6 Core Logic
The system automatically validates leave requests using a deterministic rule-based engine. **The AI drafts the response, but the Backend makes the final decision.**

---

## 5. Decision Engine Inputs
* User's Leave balance.
* Requested duration and dates.
* Leave type (Annual, Sick, etc.).
* Company policy constraints (e.g., "max 10 consecutive days").

---

## 5. Logic Flow
```text
IF requested_days <= available_balance
AND requested_days <= max_allowed_per_policy
    → STATUS: APPROVED

ELSE IF edge_case (e.g., tenure < 3 months)
    → STATUS: REVIEW_REQUIRED

ELSE
    → STATUS: REJECTED
```

## 🛡️ Design Principle
* **LLM**: Understanding, explanation, and empathy.
* **Backend**: Final decision (deterministic and auditable).

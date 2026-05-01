# 🛡️ 07. Risks & AI Guardrails

## 12. Risks & Mitigations
| Risk | Mitigation |
| :--- | :--- |
| **Wrong Decisions** | Use deterministic rule-based backend logic. |
| **LLM Hallucinations** | Ground responses using RAG and HR policies. |
| **Data Privacy** | Implement strict Firestore security rules per user. |
| **Email Spam** | Rate limit leave requests and email drafting. |

---

## 13. AI Guardrails
* **No Direct Write**: The LLM cannot write to the `leave_requests` collection directly.
* **Structured Output**: AI must return structured data for email drafts to be parsed by the UI.
* **Audit Trail**: Every AI-generated draft and decision is logged with a timestamp and user ID.

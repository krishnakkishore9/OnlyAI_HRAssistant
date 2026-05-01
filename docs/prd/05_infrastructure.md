# 🧱 05. Infrastructure & Security

## 7. System Architecture
* **Frontend**: Next.js (App Router).
* **Backend**: Next.js API Routes (Serverless).
* **Authentication**: Firebase Auth (Google Login/Email).
* **Database**: Firebase Firestore.
* **LLM**: Groq (Fast Inference).

---

## 3.8 RBAC (Role Based Access Control)
* **Employee**: Access to own data, chatbot, and request forms.
* **Admin/HR**: Access to all leave requests, override status, and audit logs.

---

## 3.9 Audit & Logging
Every significant event is logged in the `logs` collection:
* Conversations (for RAG quality monitoring).
* Decisions made by the engine.
* Emails drafted and sent.
* System errors.

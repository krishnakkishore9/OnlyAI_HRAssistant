Below is your **complete, production-ready PRD in Markdown**, aligned with:

* Firebase (Auth + Firestore)
* React / Next.js frontend
* FastAPI / Express backend
* Groq / Hugging Face (LLMs)
* Pinecone (RAG)
* SMTP (email)
* Automated approval with guardrails

You can **copy this directly into your repo (README.md or docs/PRD.md)** 👇

---

# 📄 Product Requirements Document (PRD)

## 🏷️ Product Title

**OnlyAI – Enterprise HR Assistant (RAG + Email + Automated Decision System)**

---

# 🎯 1. Objective

Build an internal AI-powered HR assistant for **OnlyAI** that:

* Enables employees to interact with HR via natural language
* Retrieves HR policies using **Retrieval-Augmented Generation (RAG)**
* Displays personalized leave data (balance, usage, eligibility)
* Generates and sends **leave request emails via SMTP**
* Automatically **approves/rejects leave requests**
* Sends decision emails on behalf of HR
* Maintains **full audit logs for transparency and compliance**
* Is designed to be **modular and productizable (future SaaS)**

---

# 👥 2. Target Users

## Primary Users

* Employees

## Secondary Users

* HR/Admin (monitoring, override, audit)

---

# 💡 3. Key Features

## 3.1 Conversational HR Chatbot (RAG)

* Natural language interaction
* Context-aware responses
* Semantic retrieval from company documents
* Powered by:

  * Groq / Hugging Face
  * Pinecone

---

## 3.2 Employee Context Awareness

* Fetch and display:

  * Leave balance
  * Leave history
  * Leave eligibility
* Personalized responses using Firebase user context

---

## 3.3 Policy Intelligence (RAG Pipeline)

* Document ingestion (HR policies)
* Chunking + embeddings
* Vector search via Pinecone
* Grounded responses (reduce hallucination)

---

## 3.4 Email Drafting with User Confirmation ✅

* AI generates leave request email
* User can:

  * Edit
  * Approve
  * Cancel
* Email is sent **only after explicit confirmation**

---

## 3.5 SMTP Email Delivery

* Sends emails to HR/backend system
* Tracks delivery status
* Uses template-based structure

---

## 3.6 Automated Decision Engine (Core)

System automatically:

* Validates leave request
* Checks:

  * Leave balance
  * Policy constraints
* Produces:

  * ✅ Approved
  * ❌ Rejected
  * ⚠️ Review Required

---

## 3.7 Decision Notification System

* Sends automated email responses
* Acts on behalf of HR
* No manual HR action required (default)

---

## 3.8 Authentication & RBAC

Using **Firebase**

* Secure login
* Role-based access:

  * Employee
  * Admin

---

## 3.9 Audit & Logging

Store:

* Conversations
* Decisions
* Email drafts
* Sent emails
* Timestamps

---

## 3.10 Productization-Ready Design 🚀

* Modular services
* API-first architecture
* Configurable rules
* Future multi-tenant support

---

# 🧠 4. End-to-End Flow

## 🔄 Primary Flow: Chat → Draft → Confirm → Auto Decision → Email

```text
[1] User logs in (Firebase Auth)
        ↓
[2] Opens chatbot (UI widget)
        ↓
[3] User asks:
     "Can I take 5 days leave next week?"
        ↓
[4] Backend receives query
        ↓
[5] RAG retrieves policy (Pinecone)
        ↓
[6] Fetch user data (Firestore):
     - leave balance
     - history
        ↓
[7] LLM generates response:
     - eligibility
     - explanation
        ↓
[8] User:
     "Draft email"
        ↓
[9] EMAIL_DRAFT intent detected
        ↓
[10] LLM generates email draft
        ↓
[11] User edits & confirms
        ↓
[12] Backend:
      - Creates leave request
      - Runs decision engine
        ↓
[13] Decision:
      APPROVED / REJECTED / REVIEW
        ↓
[14] Generate decision email
        ↓
[15] Send via SMTP
        ↓
[16] UI shows result:
     "✅ Approved. Email sent"
        ↓
[17] Log everything
```

---

# ⚙️ 5. Decision Engine Logic

## Inputs

* Leave balance
* Requested duration
* Leave type
* Policy rules

---

## Rules

```text
IF leave_days <= available_balance
AND leave_days <= max_allowed
    → APPROVED

ELSE IF edge_case
    → REVIEW_REQUIRED

ELSE
    → REJECTED
```

---

## Design Principle

* LLM → understanding + explanation
* Backend → **final decision (deterministic)**

---

# 📧 6. Email System

## Flow

```text
User confirmation
      ↓
Decision engine
      ↓
Template selection
      ↓
SMTP send
```

---

## Email Types

### Approval

```
Subject: Leave Approved

Your leave from {start_date} to {end_date} has been approved.
```

---

### Rejection

```
Subject: Leave Request Update

Reason: {reason}
```

---

### Review Required

```
Subject: Leave Under Review

Your request requires manual review.
```

---

# 🧱 7. System Architecture

```text
Frontend (Next.js)
        ↓
Backend (FastAPI / Express)
        ↓
--------------------------------
Core Systems
--------------------------------
Firebase → Auth + Firestore
Pinecone → Vector DB (RAG)
Groq / Hugging Face → LLM
SMTP → Email delivery
--------------------------------
```

---

# 🖥️ 8. Frontend Requirements

## UI Components

* Dashboard
* Chat widget (bottom-right)
* Email preview modal

---

## Chat Features

* Message history
* Typing indicator
* Action buttons:

  * Send Email
  * Edit Draft

---

## Status Indicators

* ✅ Approved (green)
* ❌ Rejected (red)
* ⚠️ Review (yellow)

---

# 🗄️ 9. Database Design (Firestore)

## users

```json
{
  "id": "user_1",
  "email": "user@onlyai.com",
  "role": "employee",
  "leave_balance": 10
}
```

---

## leave_requests

```json
{
  "user_id": "user_1",
  "start_date": "...",
  "end_date": "...",
  "status": "approved",
  "reason": "balance ok"
}
```

---

## conversations

```json
{
  "user_id": "user_1",
  "messages": []
}
```

---

## email_logs

```json
{
  "type": "approval",
  "status": "sent"
}
```

---

---

# ⚠️ 12. Risks & Mitigations

| Risk              | Mitigation        |
| ----------------- | ----------------- |
| Wrong decisions   | Rule-based engine |
| LLM hallucination | RAG grounding     |
| Email spam        | Rate limiting     |


---

# 🛡️ 13. AI Guardrails

* LLM cannot approve/reject
* Always validate structured outputs
* Use RAG for grounding
* Log prompts + responses

---
--

# 🧠 Final Note

This system is not just a chatbot.

It is a:

> **Decision Engine + AI Assistant + Workflow Automation System**

Success depends on:

* Clear rules
* Strong logging
* Controlled AI usage

---



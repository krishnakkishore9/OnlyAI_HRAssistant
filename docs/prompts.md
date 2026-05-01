# 📝 Development Prompts - OnlyAI HR Assistant

This document contains detailed prompts for each development phase. These prompts are designed to guide an AI coding assistant through the implementation of the **OnlyAI HR Assistant** based on the [PRD](file:///c:/Software/OnlyAI_HRAssistant/prd.md) and [Design](file:///c:/Software/OnlyAI_HRAssistant/design.md).

---

## 🏗️ Phase 1: Foundation & Infrastructure
**Prompt:**
> "Initialize a new Next.js project in the current directory using `npx create-next-app@latest ./ --typescript --eslint --tailwind`. Once initialized, install the following dependencies: `firebase`, `firebase-admin`, `framer-motion`, `lucide-react`, and `groq-sdk`. 
>
> After installation, set up the Firebase configuration:
> 1. Create `lib/firebase.ts` for Client-side initialization using the `NEXT_PUBLIC_FIREBASE_CONFIG` environment variable.
> 2. Create `lib/firebase-admin.ts` for Server-side initialization using service account credentials.
> 3. Create a `.env.example` file with placeholders for all required keys (Firebase, Groq, SMTP).
>
> Finally, organize the folder structure with `components`, `lib/ai`, `lib/logic`, and `app/api/chat` directories."

---

## 🧠 Phase 2: AI Brain & RAG Pipeline
**Prompt:**
> "Implement the AI intelligence layer for the HR Assistant. 
> 1. Create `lib/ai/groq.ts` to handle completions using the Groq SDK. 
> 2. Implement a RAG (Retrieval-Augmented Generation) pipeline. Start with a simple version: create a `scripts/ingest.ts` script that reads markdown files from a `policies/` folder, chunks them, and prepares them for retrieval.
> 3. Create a POST API route in `app/api/chat/route.ts` that:
>    - Accepts a user message.
>    - Performs a search over the policy chunks.
>    - Construct a prompt for Groq that includes the relevant policy chunks and the user's query.
>    - Returns a grounded, natural language response.
>
> Ensure the AI always cites the policy it is referring to."

---

## ⚙️ Phase 3: Logic Engine & Data Modeling
**Prompt:**
> "Build the deterministic Decision Engine and Firestore data models.
> 1. Define the Firestore schema for `users` (balance, tenure, role) and `leave_requests` (dates, status, reason).
> 2. Create `lib/logic/decision-engine.ts`. This file should contain pure, testable functions to validate leave requests. 
>    - Logic: Check if (requestedDays <= leaveBalance) AND (requestedDays <= policyMax).
>    - Output: A status (`APPROVED`, `REJECTED`, or `REVIEW`) and a reason string.
> 3. Implement an API route `app/api/leave/request/route.ts` that receives a structured leave request, runs the Decision Engine, and updates Firestore accordingly.
>
> **Crucial**: The LLM must NOT write to Firestore directly. It should only trigger this deterministic logic."

---

## 🎨 Phase 4: Premium User Experience
**Prompt:**
> "Create a premium, high-end dashboard and chat interface using Next.js and Vanilla CSS. 
> 1. Implement a global theme in `app/globals.css` using a sleek dark mode or high-contrast professional palette. Use glassmorphism (backdrop-blur, subtle borders).
> 2. Build the Main Dashboard (`app/page.tsx`) with:
>    - A 'Leave Balance' card with a subtle gradient background.
>    - A 'Recent Requests' table with smooth hover effects.
> 3. Build a persistent `ChatWidget.tsx` using `framer-motion` for entry/exit animations. 
>    - The chat should have a typing indicator and message bubbles with premium typography (Inter or Outfit).
>    - Use Lucide icons for a modern feel."

---

## 📧 Phase 5: Automation & Email Flow
**Prompt:**
> "Connect the Chatbot to the Email automation flow.
> 1. Update the Chat API to recognize 'Intent: Leave Request'. When detected, the AI should generate a structured JSON object containing a professional email draft.
> 2. In the UI, when the AI provides a draft, show an 'Email Preview' modal. Allow the user to edit the text.
> 3. Implement `lib/email/sender.ts` using Nodemailer or Resend.
> 4. Create an action that, upon user confirmation, sends the email and logs the 'SENT' status in the `email_logs` Firestore collection."

---

## 🛡️ Phase 6: Compliance & Guardrails
**Prompt:**
> "Finalize the security and audit layers.
> 1. Write `firestore.rules` to ensure that:
>    - Users can only read/write their own `leave_requests` and `users` data.
>    - Admins can read everything.
> 2. Implement an 'Audit Logger' utility that records every AI response and every Decision Engine result into a `logs` collection.
> 3. Perform a final pass on error handling: ensure all API routes return helpful, user-friendly errors without leaking sensitive system info.
> 4. Add a 'Review Required' flag in the UI for requests that the Decision Engine couldn't automatically approve."

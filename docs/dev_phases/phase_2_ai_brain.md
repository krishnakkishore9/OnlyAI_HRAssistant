# 🧠 Phase 2: AI Brain & RAG Pipeline

## 🎯 Goal
Implement the intelligence layer to handle natural language policy queries.

## 📋 Tasks
1. **Groq Integration**:
   - Create `lib/ai/groq.ts` helper.
   - Implement basic chat completion API route.
2. **Policy Ingestion**:
   - Create `scripts/ingest.ts` to parse markdown policies.
   - Store chunks in Firestore (or local JSON for the "simple" phase).
3. **RAG Retrieval**:
   - Implement semantic search or keyword-based retrieval.
   - Build the "Retrieve-Augment-Generate" flow in `app/api/chat/route.ts`.

## ✅ Completion Criteria
- Chatbot responds accurately to HR policy questions.
- Hallucinations are minimized via document grounding.

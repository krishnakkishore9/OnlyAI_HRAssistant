# 🧠 02. Conversational HR Chatbot (RAG)

## 3.1 Conversational Intelligence
* **Natural Language Interaction**: Context-aware responses using Groq.
* **Grounding**: All responses must be backed by retrieved HR policy documents to reduce hallucinations.

---

## 3.3 Policy Intelligence (RAG Pipeline)
The system retrieves knowledge from company documents using the following flow:
1. **Ingestion**: Markdown/PDF policy documents are chunked and embedded.
2. **Storage**: Vectors are stored (initially local/simple, eventually Pinecone).
3. **Retrieval**: Semantic search finds relevant policy sections based on user query.
4. **Augmentation**: Top chunks are injected into the LLM prompt.

---

## 3.2 Employee Context Awareness
The chatbot is aware of the logged-in user's:
* Leave balance
* History
* Eligibility
* Department/Role (via Firebase)

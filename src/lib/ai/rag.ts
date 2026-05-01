import { Pinecone } from "@pinecone-database/pinecone";

const EMBED_MODEL = "llama-text-embed-v2";

let pcClient: Pinecone | null = null;
let indexName: string = "";

function getPineconeClient() {
  if (!pcClient) {
    pcClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    indexName = process.env.PINECONE_INDEX || "onlyai-hrassistant";
  }
  return { pc: pcClient, indexName };
}

/**
 * RAG Retrieval using Pinecone
 * This converts the query to an embedding and retrieves relevant policy sections.
 */
export async function getRelevantPolicies(query: string): Promise<string> {
  try {
    const { pc, indexName } = getPineconeClient();
    
    // 1. Embed the user query
    const embedResponse = await pc.inference.embed({
      model: EMBED_MODEL,
      inputs: [query],
      parameters: { inputType: "query", truncate: "END" },
    });

    const queryVector = (embedResponse.data[0] as any).values as number[];

    // 2. Search the index
    const index = pc.index(indexName);
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
    });

    // 3. Extract and combine text from matches
    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      return "No relevant policy information found.";
    }

    const relevantDocs = queryResponse.matches
      .map(match => match.metadata?.text as string)
      .filter(text => text)
      .join("\n\n---\n\n");

    return relevantDocs;
  } catch (error) {
    console.error("RAG Error:", error);
    return "No policy information available.";
  }
}

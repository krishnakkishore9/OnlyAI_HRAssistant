import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// The model used for embedding — hosted free by Pinecone (no OpenAI needed)
const EMBED_MODEL = "llama-text-embed-v2";

let indexName = process.env.PINECONE_INDEX || "onlyai-hrassistant";

async function seed() {
  console.log("🚀 Starting Pinecone seeding...");
  console.log("📌 Index name:", indexName);
  console.log("🤖 Embedding model:", EMBED_MODEL);

  const policiesDir = path.join(process.cwd(), "policies");
  const files = fs.readdirSync(policiesDir).filter(f => f.endsWith(".md"));

  if (files.length === 0) {
    console.error("❌ No .md files found in /policies directory.");
    return;
  }

  const documents = files.map(file => {
    const content = fs.readFileSync(path.join(policiesDir, file), "utf-8");
    return { id: file, text: content, metadata: { filename: file } };
  });

  console.log(`🧠 Generating embeddings for ${documents.length} document(s)...`);

  // SDK v7: pc.inference.embed() takes a SINGLE options object
  const embedResponse = await pc.inference.embed({
    model: EMBED_MODEL,
    inputs: documents.map(d => d.text),
    parameters: { inputType: "passage", truncate: "END" },
  });

  console.log(`✅ Got ${embedResponse.data.length} embedding(s) from Pinecone.`);

  const vectors = documents.map((doc, i) => {
    const embedding = embedResponse.data[i];
    const values = (embedding as any).values as number[];
    console.log(`  • [${doc.id}] embedding dimensions: ${values?.length ?? "MISSING"}`);
    return {
      id: doc.id,
      values: values,
      metadata: { ...doc.metadata, text: doc.text },
    };
  }).filter(v => v.values && v.values.length > 0);

  if (vectors.length === 0) {
    console.error("❌ No valid vectors to upsert. Aborting.");
    return;
  }

  console.log(`📤 Uploading ${vectors.length} vector(s) to Pinecone index...`);
  const index = pc.index(indexName);
  await index.upsert({ records: vectors });

  console.log("✅ Seeding complete! Policy documents are now in Pinecone.");
}

seed().catch(console.error);



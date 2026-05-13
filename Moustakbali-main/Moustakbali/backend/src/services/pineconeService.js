// src/services/pineconeService.js
import { Pinecone } from "@pinecone-database/pinecone";

let index = null;

function getIndex() {
  if (!index) {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    index = pc.index(process.env.PINECONE_INDEX_NAME);
  }
  return index;
}

export async function searchSimilar(vector) {
  const res = await getIndex().query({
    vector,
    topK: 5,
    includeMetadata: true,
  });
  return res.matches;
}

export async function upsertVector(id, vector, text) {
  await getIndex().upsert([
    {
      id,
      values: vector,
      metadata: { text }
    }
  ]);
}
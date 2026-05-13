import { getEmbedding } from "./embeddingService.js";
import { searchSimilar } from "./pineconeService.js";
import { callLLM } from "./llmService.js";

export async function ragService(question) {

  // 1. embedding Gemini
  const vector = await getEmbedding(question);

  // 2. search Pinecone
  const docs = await searchSimilar(vector);

  // 3. build context
  const context = docs
    .map(d => d.metadata.text)
    .join("\n");

  // 4. LLM response
  const answer = await callLLM(context, question);

  return answer;
}
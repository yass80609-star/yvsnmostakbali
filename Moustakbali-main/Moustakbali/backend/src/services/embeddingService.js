import axios from "axios";

export async function getEmbedding(text) {
   
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`, // ← key as query param
    {
      model: "models/gemini-embedding-001",
      content: {
        parts: [{ text }]
      }
    },
    {
      headers: {
        "Content-Type": "application/json" // ← optional but clean
      }
    }
  );

  return res.data.embedding.values;
}
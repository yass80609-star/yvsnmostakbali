import fs from "fs";
import { getEmbedding } from "./src/services/embeddingService.js";
import { upsertVector } from "./src/services/pineconeService.js";

const data = JSON.parse(fs.readFileSync("./data/dataset.json"));

for (let i = 0; i < data.length; i++) {
  const text = data[i].content;

  const vector = await getEmbedding(text);

  await upsertVector(`doc-${i}`, vector, text);
}
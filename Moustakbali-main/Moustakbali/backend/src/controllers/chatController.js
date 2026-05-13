import { ragService } from "../services/ragService.js";

export async function chat(req, res) {
  const message = req.body.message;

  const reply = await ragService(message);

  res.json({ reply });
}
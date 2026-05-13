import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import chatRoutes from './src/routes/chatRoutes.js';
import transcribeRoutes from './src/routes/transcribeRoutes.js';
import financeAiRoutes from './src/routes/financeAiRoutes.js';

const app = express();
app.use(cors());
// Increase body limit to support base64-encoded audio uploads (~10MB audio → ~14MB base64)
app.use(express.json({ limit: '20mb' }));
app.use('/api/chat', chatRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/finance-ai', financeAiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

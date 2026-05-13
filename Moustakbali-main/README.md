### Backend
- Node.js + Express
- Groq API (LLM: Llama 3.1 + Whisper for voice)
- Pinecone (vector database for RAG)
- Gemini API (embeddings)

## Project Structure
Moustakbali/
├── frontend/         # React app (platform + AI chat widget)
│   └── src/
│       ├── components/
│       │   └── ai/   # AI chat widget (isolated to make debugging easier, prefixed styles)
│       ├── pages/
│       ├── context/
│       └── hooks/
└── backend/          # Express API server
└── src/
├── controllers/
├── routes/
└── services/

##  Installation & Setup

### Prerequisites
- Node.js v18+
- API keys (see Environment Variables)

### 1. Backend
```bash
cd backend
npm install
npm start         # runs on http://localhost:5000
```        


### 2. Frontend
```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```


and

Create an `.env` file in the `backend/` folder:


## AI Assistant Architecture
User types/speaks
↓
[Voice] MediaRecorder → base64 → Groq Whisper → text
↓
Text → POST /api/chat
↓
Gemini embeddings → Pinecone vector search (RAG)
↓
Groq Llama 3.1 → response in user's language
↓
Displayed in chat widget (RTL if Arabic/Darija)

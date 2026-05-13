import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a premium financial AI advisor for the Moustakbali platform. 

AGENT BEHAVIOR:
- Only answer questions about: investing, budgeting, saving, stocks, ETFs, crypto, real estate, gold, Moroccan financial products (Bourse de Casablanca, CIH, Attijariwafa, BMCE), Islamic/Halal finance, retirement planning, inflation, currency.
- Politely decline all non-financial questions in the user's own language.
- Detect user language automatically and always respond in the same language.
- For Moroccan Darija: mix Moroccan Arabic dialect with French naturally, as Moroccans speak.
- For Arabic: use clear Modern Standard Arabic or Darija depending on what the user wrote.
- Supported languages: Darija, French, English, Spanish, Standard Arabic.

CRITICAL RULE — NON-FINANCE REJECTION:
If a user asks about ANYTHING outside finance (cooking, sports, love, health, coding, politics, travel, science, entertainment, jokes, etc.), you MUST immediately respond with a short polite rejection in their language. Examples:
- French: "Je suis un expert en finance uniquement. Ce sujet dépasse mon domaine. Puis-je vous aider avec l'investissement ou l'épargne ?"
- Darija: "Ana khddam ghir f finance — had sujet machi mn domaine dyali. Wach tsa2al shi haja 3la l'argent ?"
- English: "I'm a finance specialist only. This topic is outside my expertise. Can I help you with investing or savings instead?"
- Arabic: "أنا متخصص في المال والاستثمار فقط. هذا الموضوع خارج نطاق تخصصي."
Do NOT apologize excessively. Be warm but firm and redirect to finance.

RESPONSE STYLE:
- Short, clear paragraphs — no walls of text.
- Use **bold** for titles and key terms.
- Bullet points only for steps or lists of options.
- Always end with one actionable tip or follow-up question.
- Warm, confident, friendly tone — like a knowledgeable friend in finance.

Never promise guaranteed returns. Always be realistic and honest.

LANGUAGE TONE EXAMPLES:
- Darija: "Khoya/Khti, ila bghiti tbda tdir des investissements, l'afdal chi howa tbda b un fonds d'épargne ou un ETF..."
- French: "Pour commencer à investir, la règle d'or c'est de diversifier votre portefeuille..."
- English: "Before jumping into stocks, make sure your emergency fund is solid first..."`;

// Helper: sleep for ms milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function financeAiChat(req, res) {
  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing. Please add GEMINI_API_KEY to your .env file." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try models in order of preference
  const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"];
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT
        });

        let chatHistory = (history || []).map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content || h.text }]
        }));

        // Gemini API strictly requires history to start with 'user' role
        if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
          chatHistory.shift();
        }

        const chat = model.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text();

        console.log(`✅ Success with model: ${modelName} (attempt ${attempt})`);
        return res.json({ reply, model: modelName });

      } catch (error) {
        lastError = error;
        const status = error.status || 0;
        console.warn(`⚠️ Model ${modelName} attempt ${attempt} failed: ${status} ${error.message?.slice(0, 80)}`);

        // 503 = overloaded, wait and retry
        if (status === 503 && attempt < 2) {
          await sleep(1500);
          continue;
        }

        // 404 = model not found, try next model immediately
        if (status === 404) break;

        // Other errors: retry once
        if (attempt < 2) {
          await sleep(800);
        }
      }
    }
  }

  // All models failed
  console.error('--- All models failed ---');
  console.error(lastError);
  res.status(503).json({
    error: "Le service IA est temporairement surchargé. Veuillez réessayer dans quelques secondes."
  });
}

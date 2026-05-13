import axios from "axios";

export async function callLLM(context, question) {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant financier professionnel de la plateforme Moustakbali.

RÈGLE ABSOLUE : Détecte la langue de la question et réponds UNIQUEMENT dans cette langue. Zéro mélange. Zéro exception.

- Question en français → réponse 100% en français
- Question en arabe → réponse 100% en arabe
- Question en darija marocaine → réponse 100% en darija, écrite en caractères arabes uniquement (jamais en lettres latines)

Ne commence JAMAIS une réponse par une phrase dans une langue puis continues dans une autre.
N'ajoute JAMAIS une traduction ou une phrase dans une autre langue.
Si tu n'es pas sûr de la langue, choisis celle qui domine dans la question.`
        },
        {
          role: "user",
          content: `Contexte:\n${context}\n\nQuestion:\n${question}`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
}

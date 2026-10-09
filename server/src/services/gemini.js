const { GoogleGenAI } = require("@google/genai");

const PROMPT_VERSION = 1;

async function summarizeMedia(details) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model,
    contents: `Explain this title in clear, simple language for someone deciding whether to watch it.
Use 90-130 words. Avoid spoilers. Include the premise, tone, main themes, and who may enjoy it.

Title: ${details.title || details.name}
Type: ${details.media_type}
Genres: ${(details.genres || []).map((genre) => genre.name).join(", ")}
Overview: ${details.overview || "No overview available"}`,
  });

  return { summary: response.text.trim(), model };
}

module.exports = { PROMPT_VERSION, summarizeMedia };

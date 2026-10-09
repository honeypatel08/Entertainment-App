const { GoogleGenAI } = require("@google/genai");

const PROMPT_VERSION = 1;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function isRetryable(error) {
  const status = Number(error.status || error.code);
  return status === 408 || status === 429 || status >= 500;
}

async function summarizeMedia(details) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Explain this title in clear, simple language for someone deciding whether to watch it.
Use 90-130 words. Avoid spoilers. Include the premise, tone, main themes, and who may enjoy it.

Title: ${details.title || details.name}
Type: ${details.media_type}
Genres: ${(details.genres || []).map((genre) => genre.name).join(", ")}
Overview: ${details.overview || "No overview available"}`;
  const models = [
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite",
  ].filter((model, index, values) => values.indexOf(model) === index);

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return { summary: response.text.trim(), model };
      } catch (error) {
        if (!isRetryable(error)) throw error;
        if (attempt < 2) {
          await wait((2 ** attempt) * 750 + Math.floor(Math.random() * 250));
        }
      }
    }
  }

  const error = new Error("AI summary service is temporarily busy. Please try again shortly.");
  error.status = 503;
  throw error;
}

module.exports = { PROMPT_VERSION, summarizeMedia };

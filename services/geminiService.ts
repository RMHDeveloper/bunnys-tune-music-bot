
import { GoogleGenAI } from "@google/genai";
import { UserAnswers, RecommendationResponse } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryable = (err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('429');
};

export const getMusicRecommendations = async (answers: UserAnswers): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Suggest 5 popular songs based on these preferences:
- Language: ${answers.language}
- Mood: ${answers.mood}
- Era: ${answers.era}
- Occasion: ${answers.occasion}
- Instrument: ${answers.instrument}

Respond ONLY with a JSON object in this exact format, no extra text:
{
  "songs": [
    { "name": "Song Title", "artist": "Artist Name", "language": "${answers.language}", "description": "Short description" }
  ]
}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(attempt * 2000);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const text = typeof (response as any).text === 'function'
        ? (response as any).text()
        : (response as any).text;
      if (!text) throw new Error("Empty response from Gemini.");
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response.");
      return JSON.parse(jsonMatch[0]) as RecommendationResponse;
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err)) throw err;
      console.warn(`[Gemini] Attempt ${attempt + 1} failed, retrying...`);
    }
  }
  throw lastErr;
};

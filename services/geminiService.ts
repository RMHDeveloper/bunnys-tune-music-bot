
import { GoogleGenAI } from "@google/genai";
import { UserAnswers, RecommendationResponse } from "../types";

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

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  const raw = typeof (response as any).text === 'function'
    ? (response as any).text()
    : (response as any).text;

  console.log("[Gemini] response:", raw);

  const jsonMatch = raw?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response.");
  return JSON.parse(jsonMatch[0]) as RecommendationResponse;
};

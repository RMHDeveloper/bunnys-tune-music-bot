
import { GoogleGenAI, Type } from "@google/genai";
import { UserAnswers, RecommendationResponse } from "../types";

export const getMusicRecommendations = async (answers: UserAnswers): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Based on these preferences, suggest 5 popular songs:
    - Language: ${answers.language}
    - Mood: ${answers.mood}
    - Era: ${answers.era}
    - Occasion: ${answers.occasion}
    - Instrument: ${answers.instrument}
    
    Ensure the songs are highly relevant and widely known.`;

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                artist: { type: Type.STRING },
                language: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "artist", "language"]
            }
          }
        },
        required: ["songs"]
      }
    }
  });

  return JSON.parse(response.text) as RecommendationResponse;
};


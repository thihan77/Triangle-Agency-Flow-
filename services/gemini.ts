
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCaption = async (topic: string, platform: string, brandName: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a senior social media manager. Generate a high-converting, engaging caption for a ${platform} post about "${topic}" for the brand "${brandName}". Include 3-5 relevant hashtags and emojis. Keep the tone professional but approachable.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Failed to generate caption. Please try again later.";
  }
};

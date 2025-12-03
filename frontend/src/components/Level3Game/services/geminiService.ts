import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// NOTE: API Key is assumed to be in process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiHint = async (code: string, puzzleTitle: string, puzzleContext: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "SYSTEM ERROR: AI Core Offline. (Missing API Key)";
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are the "Loop Reactor Core AI".
      The user is playing a game to fix broken code.
      Puzzle: ${puzzleTitle}
      Goal: ${puzzleContext}
      
      Current User Code:
      ${code}

      The user is stuck. Analyze their code.
      Do NOT give the full solution answer immediately.
      Give a cryptic but helpful "system log" style hint about why the logic fails (e.g., "Infinite loop detected in iterator", "Condition never met").
      Keep it under 2 sentences.
      Tone: Robotic, helpful, slightly urgent.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Analyzing logic... pattern unclear. Try checking loop conditions.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "SYSTEM WARNING: Uplink to AI Core unstable. Please check your syntax manually.";
  }
};
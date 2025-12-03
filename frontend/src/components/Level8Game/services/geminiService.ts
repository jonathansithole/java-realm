import { GoogleGenAI } from "@google/genai";
import { LevelData } from "../types";

// Initialize the API client
// Note: In a real deployment, ensure process.env.API_KEY is set.
// If running locally without env, this might throw, so we wrap calls.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getHintFromAI = async (
  currentCode: string,
  level: LevelData
): Promise<string> => {
  if (!apiKey) return level.hint;

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are DEBUG-BOT, a helpful coding assistant in a game called "Debugging Dungeon".
      The player is trying to fix Java code.
      
      Level Context: ${level.scenario}
      Goal: Fix the following code to match: ${level.correctCode}
      
      Current User Code:
      ${currentCode}
      
      The user is stuck. Provide a short, encouraging, and specific hint about what is syntactically or logically wrong with their current code. 
      Do not give the full answer directly. Keep it under 20 words.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || level.hint;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return level.hint; // Fallback to static hint
  }
};

export const getSuccessMessage = async (level: LevelData): Promise<string> => {
  if (!apiKey) return "System stabilized! Great work engineer.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are DEBUG-BOT. The player just fixed the ${level.machineName}.
      Generate a short, celebratory message (under 15 words) referencing the machine working again.
      Use a sci-fi / technical tone.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "System stabilized! Great work engineer.";
  } catch (error) {
    return "System stabilized! Great work engineer.";
  }
};
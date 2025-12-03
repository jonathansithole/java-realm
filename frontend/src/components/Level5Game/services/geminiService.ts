import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// NOTE: In a real production app, you might proxy this through a backend to hide the key,
// but for this client-side demo per instructions, we use process.env directly.
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Missing API_KEY in environment variables.");
    // We will handle the missing key gracefully in the UI or return a mock client if needed,
    // but per instructions we assume it's there.
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const verifyCodeWithGemini = async (
  code: string, 
  levelDescription: string,
  expectedBehavior: string
): Promise<{ passed: boolean; feedback: string; consoleOutput: string }> => {
  
  const ai = getAiClient();
  
  const prompt = `
    You are MEK-5, a futuristic robot tutor teaching Java OOP concepts.
    
    CONTEXT:
    The user is playing "The Object Observatory".
    Current Challenge: ${levelDescription}
    Expected Behavior/Criteria: ${expectedBehavior}
    
    USER CODE:
    ${code}
    
    INSTRUCTIONS:
    1. Analyze the user's Java-like code. It doesn't need to be perfectly compilable standard Java (e.g. imports might be missing), but the logic must be correct.
    2. Determine if the user has met the specific criteria for this challenge.
    3. If there are syntax errors relevant to the challenge (e.g., missing constructor, wrong types), mark as failed.
    4. Generate a short console output simulation (e.g., "System: Telescope initialized...").
    5. Provide brief, encouraging, or corrective feedback as MEK-5.
    
    Return ONLY valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            consoleOutput: { type: Type.STRING },
          },
          required: ["passed", "feedback", "consoleOutput"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      passed: false,
      feedback: "Bzzzt! Communication error with the Observatory mainframe. Please check your API Key or try again.",
      consoleOutput: "ERROR: Connection Timeout"
    };
  }
};

export const getHintFromGemini = async (currentCode: string, challenge: string) => {
    const ai = getAiClient();
    const prompt = `
        You are MEK-5. The user is stuck on the following coding challenge: "${challenge}".
        Their current code is:
        ${currentCode}
        
        Give a short, helpful hint without giving away the full answer. 
        Keep it under 2 sentences. Speak like a friendly robot.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Check your syntax!";
    } catch (e) {
        return "I can't analyze your code right now, but check your curly braces!";
    }
}

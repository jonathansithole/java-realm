import { GoogleGenAI, Type } from "@google/genai";
import { Challenge, ValidationResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const validateCode = async (
  code: string,
  challenge: Challenge
): Promise<ValidationResult> => {
  if (!apiKey) {
    return {
      success: false,
      message: "System Error: API Key missing.",
    };
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    You are a strict Java code compiler and game validator for a coding game called "The Method Forge".
    
    Context:
    The user is solving level ${challenge.id}: ${challenge.title}.
    The goal is: ${challenge.description}
    Instructions: ${challenge.instructions.join(' ')}
    Solution Criteria: ${challenge.solutionCriteria}
    
    The User's Code Snippet:
    \`\`\`java
    ${code}
    \`\`\`
    
    Task:
    1. Analyze the code for Java syntax errors.
    2. Check if the method signature matches the requirement.
    3. Check if the logic correctly implements the instructions.
    4. Check if the return type and value are correct.
    
    If the code is valid and correct, act as if you ran it with test cases and it passed.
    If it fails, explain why briefly, like a compiler or a helpful tutor (MEK-4).
    
    Respond with a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING, description: "Feedback to the user from MEK-4" },
            consoleOutput: { type: Type.STRING, description: "Simulated console output or error logs" }
          },
          required: ["success", "message"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as ValidationResult;
    return result;
  } catch (error) {
    console.error("Gemini validation error:", error);
    return {
      success: false,
      message: "Connection to The Method Forge server failed. Please try again.",
      consoleOutput: "Network Error: 503 Service Unavailable"
    };
  }
};

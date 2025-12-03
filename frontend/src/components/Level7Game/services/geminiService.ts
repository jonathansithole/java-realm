import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string | undefined => {
    return process.env.API_KEY;
}

export const getGeminiHint = async (
    currentCode: string, 
    levelTitle: string, 
    errorType: string
): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        return "I cannot connect to the neural network (Missing API Key). Please assume the standard protocol: Check your syntax.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
            You are EXC-BOT, a friendly and slightly nervous robot assistant in the Fortress of Fail-Safes.
            The user is playing a game to learn Java Exception Handling.
            
            Current Level: ${levelTitle}
            Goal: Prevent a crash caused by ${errorType}.
            User's Code:
            ${currentCode}
            
            The user is failing the level. Provide a short, encouraging hint about what they might be missing in their try-catch block or syntax. 
            Do NOT write the full solution code. Just guide them. Keep it under 2 sentences.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "My circuits are fuzzy. Try checking the try-catch syntax again.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Communication uplinks down. Use your knowledge of 'try', 'catch', and the exception type!";
    }
};

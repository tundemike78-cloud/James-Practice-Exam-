import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export const getAITutorResponse = async (prompt: string, context?: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a friendly, patient, and encouraging AI Tutor for a 4th-grade student in Georgia.
    Your name is "Coach".
    Your goal is to help students prepare for the Georgia Milestones exam.
    
    TONE:
    - Friendly, patient, and encouraging.
    - Use simple words (4th-grade level).
    - Say things like: "Great try! Let's solve it together.", "You're doing awesome!", "Don't worry, we can learn this together."
    
    GUIDELINES:
    - Explain answers in simple words.
    - Help solve math step-by-step.
    - If a student is stuck, give a small hint first.
    - Always encourage the student.
    - Keep explanations short and clear.
    
    CONTEXT:
    ${context || "The student is learning Math, ELA, and Science for the Georgia Milestones exam."}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I'm having a little trouble thinking right now. Let's try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I had a little hiccup. Can you ask me again?";
  }
};

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export type StyleType = 'Friendly' | 'Professional' | 'Gen Z' | 'Luxury Brand' | 'Funny';

const SYSTEM_PROMPT = `You are GhostReply, an expert AI customer service assistant. 
Your goal is to generate high-quality, concise, and helpful replies to customer messages.
You will be given a customer message and a specific communication style.

Styles:
- Friendly: Warm, empathetic, uses emojis appropriately, approachable.
- Professional: Concise, formal, structured, focused on solutions.
- Gen Z: Informal, uses slang/brainrot terms (lowkey, no cap, bet, fr, etc.), lowercase often, chaotic but helpful.
- Luxury Brand: Refined, exclusive, elegant, uses sophisticated vocabulary, high-touch feel.
- Funny: Witty, lighthearted, uses puns or gentle humor while still answering the query.

Guidelines:
- Keep each response concise.
- Generate THREE (3) distinct variations of the reply in the requested style.
- Each variation should have a slightly different angle or emphasis.`;

export async function generateReplies(message: string, style: StyleType) {
  if (!message.trim()) return [];
  console.log("API KEY:", process.env.GEMINI_API_KEY);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Style: ${style}\nCustomer Message: ${message}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three distinct reply variations"
            }
          },
          required: ["replies"]
        }
      },
    });

    const data = JSON.parse(response.text || '{"replies": []}');
    return (data.replies as string[]) || [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

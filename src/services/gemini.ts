import { Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: || '',
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

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        style,
      }),
    });

    const data = await response.json();

    return data.replies || [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

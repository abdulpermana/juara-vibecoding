export type StyleType =
  | 'Friendly'
  | 'Professional'
  | 'Gen Z'
  | 'Luxury Brand'
  | 'Funny';

export async function generateReplies(
  message: string,
  style: StyleType
) {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate replies");
    }

    const data = await response.json();

    return data.replies || [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

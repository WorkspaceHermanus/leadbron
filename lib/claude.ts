import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export async function sendChatMessage(
  userMessage: string,
  conversationHistory: Message[],
  systemPrompt: string
): Promise<string> {
  const messages = conversationHistory.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  messages.push({
    role: "user" as const,
    content: userMessage,
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}

export async function extractLeadData(
  conversationHistory: Message[],
  extractionPrompt: string
): Promise<{
  name?: string;
  email?: string;
  phone?: string;
  province?: string;
  financialGoals?: string;
  productInterest?: string;
  category?: string;
  confidenceScore?: number;
  intent?: "HIGH" | "MEDIUM" | "LOW";
  disqualificationReason?: string;
}> {
  const messages = conversationHistory.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: extractionPrompt,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  try {
    return JSON.parse(textBlock.text);
  } catch {
    console.error("Failed to parse extraction response:", textBlock.text);
    return {};
  }
}

export function validateApiKey(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

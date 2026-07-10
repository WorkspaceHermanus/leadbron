import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendChatMessage } from "@/lib/claude";
import { getSystemPrompt } from "@/lib/ai-prompts";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { visitorId, message, conversationId } = body;

  if (!visitorId || !message) {
    return NextResponse.json({ error: "Missing visitorId or message." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured." },
      { status: 503 }
    );
  }

  try {
    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          visitorId,
          messages: [],
        },
      });
    }

    const currentMessages = Array.isArray(conversation.messages)
      ? conversation.messages
      : [];

    const systemPrompt = getSystemPrompt();
    const aiResponse = await sendChatMessage(message, currentMessages as any, systemPrompt);

    const updatedMessages = [
      ...currentMessages,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() },
    ];

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messages: updatedMessages },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractLeadData } from "@/lib/claude";
import { getExtractionPrompt } from "@/lib/ai-prompts";
import { getVertical } from "@/lib/verticals";

type LeadCategory =
  | "LIFE_INSURANCE"
  | "SHORT_TERM"
  | "MEDICAL_AID"
  | "WILLS_TRUSTS"
  | "BUSINESS"
  | "INVESTMENT"
  | "RETIREMENT"
  | "GENERAL";

type LeadIntent = "HIGH" | "MEDIUM" | "LOW";

const CATEGORY_TO_VERTICAL: Record<LeadCategory, string> = {
  LIFE_INSURANCE: "long-term",
  SHORT_TERM: "short-term",
  MEDICAL_AID: "medical-aid",
  WILLS_TRUSTS: "wills-trusts",
  BUSINESS: "business",
  INVESTMENT: "long-term", // Map to closest vertical
  RETIREMENT: "long-term",
  GENERAL: "long-term", // Default fallback
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { conversationId, consent } = body;

  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversationId." }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Consent required to create lead." },
      { status: 400 }
    );
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    const messages = Array.isArray(conversation.messages) ? conversation.messages : [];

    // Extract lead data using Claude
    const extractionPrompt = getExtractionPrompt();
    const extracted = await extractLeadData(messages as any, extractionPrompt);

    // Validate extracted data
    if (extracted.disqualificationReason) {
      return NextResponse.json({
        qualified: false,
        reason: extracted.disqualificationReason,
      });
    }

    if (!extracted.name || !extracted.email || !extracted.phone) {
      return NextResponse.json({
        qualified: false,
        reason: "Insufficient contact information provided.",
      });
    }

    const category = (extracted.category || "GENERAL") as LeadCategory;
    const verticalSlug = CATEGORY_TO_VERTICAL[category];
    const vertical = getVertical(verticalSlug);

    if (!vertical) {
      return NextResponse.json(
        { error: "Invalid category mapping." },
        { status: 400 }
      );
    }

    // Parse name
    const nameParts = extracted.name.split(" ");
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "Lead";

    // Normalize phone (same as form validation)
    const phone = extracted.phone.replace(/[^\d+]/g, "");

    // Check for duplicate within 30 days
    const dupe = await prisma.lead.findFirst({
      where: {
        phone,
        vertical: verticalSlug,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
      },
    });

    if (dupe) {
      return NextResponse.json({
        qualified: false,
        reason: "This phone number has already been registered for this product.",
      });
    }

    // Create QualifiedLead
    const qualifiedLead = await prisma.qualifiedLead.create({
      data: {
        conversationId,
        leadCategory: category,
        firstName,
        lastName,
        email: extracted.email,
        phone,
        province: extracted.province || "Unknown",
        financialGoals: extracted.financialGoals || null,
        productInterest: extracted.productInterest || null,
        confidenceScore: extracted.confidenceScore || 50,
        intent: (extracted.intent || "MEDIUM") as LeadIntent,
        conversationTranscript: messages,
        consentAt: new Date(),
        consentIp: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
      },
    });

    // Auto-create Lead entry linked to QualifiedLead
    const lead = await prisma.lead.create({
      data: {
        vertical: verticalSlug,
        firstName,
        lastName,
        email: extracted.email,
        phone,
        province: extracted.province || "Unknown",
        notes: extracted.financialGoals
          ? `AI Chat: ${extracted.financialGoals.slice(0, 1000)}`
          : "AI Chat Qualified Lead",
        source: "ai-chat",
        consentAt: new Date(),
        consentIp: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
        qualifiedLeadId: qualifiedLead.id,
        confidenceScore: extracted.confidenceScore || 50,
        conversationTranscript: messages,
      },
    });

    // Update conversation status
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: "COMPLETED",
        category,
        vertical: verticalSlug,
      },
    });

    // Trigger drip-fill for existing orders
    const { dripFill } = await import("@/lib/fulfil");
    dripFill(verticalSlug).catch((e) => console.error("dripFill failed", e));

    return NextResponse.json({
      qualified: true,
      leadId: lead.id,
      qualifiedLeadId: qualifiedLead.id,
      category,
      confidenceScore: extracted.confidenceScore || 50,
      message: "Thank you! An adviser will contact you shortly.",
    });
  } catch (error) {
    console.error("Qualification error:", error);
    return NextResponse.json(
      { error: "Failed to qualify lead. Please try again." },
      { status: 500 }
    );
  }
}

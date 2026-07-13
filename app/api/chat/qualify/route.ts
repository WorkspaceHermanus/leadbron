import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVertical, PROVINCES } from "@/lib/verticals";
import { dripFill } from "@/lib/fulfil";
import {
  CATEGORY_VERTICAL,
  scoreAnswers,
  buildGoalsSummary,
  type Answer,
  type LeadCategory,
} from "@/lib/chat-flow";

const CATEGORIES: LeadCategory[] = [
  "LIFE_INSURANCE",
  "SHORT_TERM",
  "MEDICAL_AID",
  "WILLS_TRUSTS",
  "BUSINESS",
  "INVESTMENT",
  "RETIREMENT",
  "GENERAL",
];

const PRODUCT_INTEREST: Record<LeadCategory, string> = {
  LIFE_INSURANCE: "Life cover & income protection",
  SHORT_TERM: "Car & home insurance",
  MEDICAL_AID: "Medical aid & gap cover",
  WILLS_TRUSTS: "Wills, trusts & estate planning",
  BUSINESS: "Business cover & employee benefits",
  INVESTMENT: "Investment & savings products",
  RETIREMENT: "Retirement & pension products",
  GENERAL: "General financial advice",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: silently accept bot submissions without storing them (mirrors
  // /api/leads). Humans never see or fill the `website` field.
  if (body.website) return NextResponse.json({ ok: true });

  if (body.consent !== true)
    return NextResponse.json(
      { error: "Consent is required before an adviser may contact you." },
      { status: 400 }
    );

  const visitorId = String(body.visitorId ?? "").slice(0, 100);
  const category: LeadCategory = CATEGORIES.includes(body.category) ? body.category : "GENERAL";
  const verticalSlug = CATEGORY_VERTICAL[category];
  const vertical = getVertical(verticalSlug);
  if (!vertical) return NextResponse.json({ error: "Unknown product." }, { status: 400 });

  const contact = body.contact ?? {};
  const firstName = String(contact.firstName ?? "").trim().slice(0, 100);
  const lastName = String(contact.lastName ?? "").trim().slice(0, 100);
  const email = String(contact.email ?? "").trim().slice(0, 200);
  const phone = String(contact.phone ?? "").replace(/[^\d+]/g, "");
  const province = String(contact.province ?? "").trim();

  if (!firstName || !lastName)
    return NextResponse.json({ error: "Please fill in your name." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 9)
    return NextResponse.json({ error: "Please enter a valid SA phone number." }, { status: 400 });
  if (!PROVINCES.includes(province))
    return NextResponse.json({ error: "Please choose your province." }, { status: 400 });

  // Answers: keep only well-formed entries; scoring validates each answer
  // against the flow definition, so tampered payloads can't inflate scores.
  const answers: Answer[] = Array.isArray(body.answers)
    ? body.answers
        .filter(
          (a: unknown): a is Answer =>
            !!a &&
            typeof (a as Answer).stepId === "string" &&
            typeof (a as Answer).question === "string" &&
            typeof (a as Answer).answer === "string"
        )
        .slice(0, 20)
        .map((a: Answer) => ({
          stepId: a.stepId.slice(0, 50),
          question: a.question.slice(0, 300),
          answer: a.answer.slice(0, 200),
        }))
    : [];

  const { intent, confidenceScore } = scoreAnswers(answers);
  const financialGoals = buildGoalsSummary(category, answers);

  // Transcript: clamp size, force the shape we store.
  const transcript = (Array.isArray(body.transcript) ? body.transcript : [])
    .slice(0, 80)
    .map((m: { role?: string; content?: string; timestamp?: string }) => ({
      role: m?.role === "user" ? "user" : "assistant",
      content: String(m?.content ?? "").slice(0, 600),
      timestamp: String(m?.timestamp ?? "").slice(0, 40),
    }));

  // Duplicate guard: same phone + vertical within 30 days — accept quietly.
  const dupe = await prisma.lead.findFirst({
    where: {
      phone,
      vertical: verticalSlug,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
    },
  });
  if (dupe) return NextResponse.json({ ok: true });

  const consentIp = req.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  const source = body.source ? String(body.source).slice(0, 200) : "chat";

  // Rate limit: cap chat leads from one IP to 5 per hour to blunt bot flooding.
  // Accept quietly (like the honeypot/dupe paths) so bots get no signal.
  if (consentIp) {
    const recentFromIp = await prisma.lead.count({
      where: {
        consentIp,
        source: "chat",
        createdAt: { gte: new Date(Date.now() - 3600 * 1000) },
      },
    });
    if (recentFromIp >= 5) return NextResponse.json({ ok: true });
  }

  const conversation = await prisma.conversation.create({
    data: {
      visitorId,
      messages: transcript,
      vertical: verticalSlug,
      category,
      status: "COMPLETED",
    },
  });

  const qualifiedLead = await prisma.qualifiedLead.create({
    data: {
      conversationId: conversation.id,
      leadCategory: category,
      firstName,
      lastName,
      email,
      phone,
      province,
      financialGoals,
      productInterest: PRODUCT_INTEREST[category],
      confidenceScore,
      intent,
      qualificationNotes: answers.map((a) => `${a.question} → ${a.answer}`).join(" | ").slice(0, 2000) || null,
      conversationTranscript: transcript,
      consentAt: new Date(),
      consentIp,
    },
  });

  await prisma.lead.create({
    data: {
      vertical: verticalSlug,
      firstName,
      lastName,
      email,
      phone,
      province,
      notes: financialGoals.slice(0, 1000),
      source,
      consentAt: new Date(),
      consentIp,
      qualifiedLeadId: qualifiedLead.id,
      confidenceScore,
      conversationTranscript: transcript,
    },
  });

  // Automation: if an adviser is waiting on stock in this vertical, deliver now.
  dripFill(verticalSlug).catch((e) => console.error("dripFill failed", e));

  return NextResponse.json({ ok: true });
}

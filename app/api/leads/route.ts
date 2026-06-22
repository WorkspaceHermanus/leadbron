import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVertical } from "@/lib/verticals";
import { dripFill } from "@/lib/fulfil";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: silently accept bot submissions without storing them.
  if (body.website) return NextResponse.json({ ok: true });

  const vertical = getVertical(String(body.vertical ?? ""));
  if (!vertical) return NextResponse.json({ error: "Unknown product." }, { status: 400 });

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").replace(/[^\d+]/g, "");
  const province = String(body.province ?? "").trim();

  if (!firstName || !lastName) return NextResponse.json({ error: "Please fill in your name." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 9)
    return NextResponse.json({ error: "Please enter a valid SA phone number." }, { status: 400 });
  if (!province) return NextResponse.json({ error: "Please choose your province." }, { status: 400 });
  if (body.consent !== true)
    return NextResponse.json({ error: "Consent is required before an adviser may contact you." }, { status: 400 });

  // Basic duplicate guard: same phone + vertical within 30 days.
  const dupe = await prisma.lead.findFirst({
    where: {
      phone,
      vertical: vertical.slug,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
    },
  });
  if (dupe) return NextResponse.json({ ok: true }); // accept quietly, don't double-store

  await prisma.lead.create({
    data: {
      vertical: vertical.slug,
      firstName,
      lastName,
      email,
      phone,
      province,
      notes: body.notes ? String(body.notes).slice(0, 1000) : null,
      source: body.source ? String(body.source).slice(0, 200) : null,
      consentAt: new Date(),
      consentIp: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
    },
  });

  // Automation: if an adviser is waiting on stock in this vertical, deliver now.
  dripFill(vertical.slug).catch((e) => console.error("dripFill failed", e));

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Offline conversion export for Google Ads.
 *
 * Form fills are a weak optimisation target — Google will happily find you
 * a thousand people who fill in forms and never buy. Uploading the leads
 * that turned into real business, with their value, teaches the bidding
 * algorithm to chase revenue instead of volume. This is the single biggest
 * lever on cost per acquisition once there is a bit of history.
 *
 * Usage:
 *   1. Mark a lead as sold:
 *      POST /api/admin/offline-conversions?token=ADMIN_TOKEN
 *      { "leadId": "...", "saleValueRands": 4500 }
 *   2. Download the upload file:
 *      GET /api/admin/offline-conversions?token=ADMIN_TOKEN
 *   3. In Google Ads: Goals > Conversions > Import > Upload the CSV.
 */

export const dynamic = "force-dynamic";

function authorised(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  return !!token && req.nextUrl.searchParams.get("token") === token;
}

/** Google requires this exact timestamp shape, including the offset. */
function googleTimestamp(d: Date): string {
  const iso = d.toISOString().replace("T", " ").slice(0, 19);
  return `${iso}+00:00`;
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const conversionName =
    process.env.GOOGLE_ADS_OFFLINE_CONVERSION_NAME || "Qualified Lead Sale";

  const leads = await prisma.lead.findMany({
    where: {
      gclid: { not: null },
      saleConfirmedAt: { not: null },
      uploadedToAdsAt: null,
    },
    orderBy: { saleConfirmedAt: "asc" },
    take: 2000,
  });

  // Google's template: two header lines, then the rows.
  const lines = [
    "Parameters:TimeZone=Africa/Johannesburg",
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
  ];
  for (const l of leads) {
    lines.push(
      [
        l.gclid,
        conversionName,
        googleTimestamp(l.saleConfirmedAt as Date),
        ((l.saleValueCents ?? 0) / 100).toFixed(2),
        "ZAR",
      ].join(",")
    );
  }

  const filename = `offline-conversions-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Mark a batch as uploaded once you've submitted the file to Google, so
  // the same conversions aren't sent twice.
  if (body.markUploaded === true) {
    const result = await prisma.lead.updateMany({
      where: { gclid: { not: null }, saleConfirmedAt: { not: null }, uploadedToAdsAt: null },
      data: { uploadedToAdsAt: new Date() },
    });
    return NextResponse.json({ ok: true, marked: result.count });
  }

  const leadId = String(body.leadId ?? "");
  const rands = Number(body.saleValueRands);
  if (!leadId) return NextResponse.json({ error: "leadId is required." }, { status: 400 });
  if (!Number.isFinite(rands) || rands < 0) {
    return NextResponse.json({ error: "saleValueRands must be a positive number." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      saleValueCents: Math.round(rands * 100),
      saleConfirmedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    leadId,
    hasGclid: !!lead.gclid,
    note: lead.gclid
      ? "Will be included in the next offline conversion export."
      : "This lead has no gclid (it did not come from a Google ad), so it cannot be uploaded.",
  });
}

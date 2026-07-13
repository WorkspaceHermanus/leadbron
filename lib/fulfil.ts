import { prisma } from "@/lib/prisma";
import { getVertical } from "@/lib/verticals";
import nodemailer from "nodemailer";

function transcriptToText(transcript: unknown): string {
  if (!Array.isArray(transcript)) return "";
  return transcript
    .map((m) => {
      const who = m?.role === "user" ? "Lead" : "Assistant";
      const content = String(m?.content ?? "").replace(/[\r\n]+/g, " ");
      return `${who}: ${content}`;
    })
    .join(" | ");
}

/**
 * Neutralise spreadsheet formula injection (CWE-1236). A visitor-controlled
 * field like `=HYPERLINK(...)` or `+cmd|...` would otherwise be evaluated when
 * an adviser opens the CSV in Excel/Sheets/LibreOffice. Prefix any cell that
 * starts with a formula trigger with a single quote.
 */
function csvCell(value: unknown): string {
  const s = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

function leadsToCsv(
  leads: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    province: string;
    notes: string | null;
    consentAt: Date;
    createdAt: Date;
    conversationTranscript?: unknown;
  }[]
): string {
  const header =
    "first_name,last_name,email,phone,province,notes,conversation,consent_at,received_at";
  const rows = leads.map((l) =>
    [
      l.firstName,
      l.lastName,
      l.email,
      l.phone,
      l.province,
      (l.notes ?? "").replace(/[\r\n,]+/g, " "),
      transcriptToText(l.conversationTranscript),
      l.consentAt.toISOString(),
      l.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Core automation. Allocates AVAILABLE leads to a PAID/PARTIAL order,
 * marks them SOLD, emails them to the adviser, and updates order status.
 * Safe to call repeatedly: from the PayFast ITN webhook and from the
 * lead-intake endpoint (drip-fill of open orders).
 */
export async function fulfilOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  if (!["PAID", "PARTIAL"].includes(order.status)) return;

  const needed = order.quantity - order.deliveredCount;
  if (needed <= 0) return;

  const candidates = await prisma.lead.findMany({
    where: { vertical: order.vertical, status: "AVAILABLE" },
    orderBy: { createdAt: "asc" },
    take: needed,
    select: { id: true },
  });
  if (candidates.length === 0) return;

  const claimed = await prisma.lead.updateMany({
    where: { id: { in: candidates.map((c) => c.id) }, status: "AVAILABLE" },
    data: { status: "SOLD", orderId: order.id },
  });
  if (claimed.count === 0) return;

  const leads = await prisma.lead.findMany({
    where: { orderId: order.id, status: "SOLD" },
    orderBy: { createdAt: "asc" },
  });

  const delivered = leads.length;
  await prisma.order.update({
    where: { id: order.id },
    data: {
      deliveredCount: delivered,
      status: delivered >= order.quantity ? "FULFILLED" : "PARTIAL",
    },
  });

  await emailLeads(order.adviserEmail, order.adviserName, order.vertical, leads, {
    delivered,
    total: order.quantity,
  });
}

/** After a new lead arrives, try to drip-fill the oldest open order in that vertical. */
export async function dripFill(vertical: string): Promise<void> {
  const openOrder = await prisma.order.findFirst({
    where: { vertical, status: { in: ["PAID", "PARTIAL"] } },
    orderBy: { createdAt: "asc" },
  });
  if (openOrder) await fulfilOrder(openOrder.id);
}

async function emailLeads(
  to: string,
  name: string,
  verticalSlug: string,
  leads: Parameters<typeof leadsToCsv>[0],
  progress: { delivered: number; total: number }
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set — leads allocated but email not sent.");
    return;
  }

  const vertical = getVertical(verticalSlug)?.name ?? verticalSlug;
  const remaining = progress.total - progress.delivered;

  const transport = createTransport();
  await transport.sendMail({
    from: `"LeadBron" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your ${vertical} leads (${progress.delivered}/${progress.total})`,
    text:
      `Hi ${name},\n\n` +
      `Attached are your ${vertical} leads — ${progress.delivered} of ${progress.total} delivered so far.` +
      (remaining > 0
        ? ` The remaining ${remaining} will be emailed to you automatically as new leads come in.\n\n`
        : `\n\n`) +
      `Every lead in the file gave explicit consent (POPIA) to be contacted by a financial adviser; the consent timestamp is in the file.\n\n` +
      `LeadBron`,
    attachments: [
      {
        filename: `leads-${verticalSlug}-${new Date().toISOString().slice(0, 10)}.csv`,
        content: Buffer.from(leadsToCsv(leads)).toString("base64"),
        encoding: "base64",
      },
    ],
  });
}

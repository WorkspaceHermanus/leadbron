import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyItnSignature, validateItnWithPayfast } from "@/lib/payfast";
import { fulfilOrder } from "@/lib/fulfil";

/**
 * PayFast Instant Transaction Notification.
 * This is the moment the automation kicks in: payment confirmed -> order
 * marked PAID -> leads allocated and emailed, no human involved.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const payload = Object.fromEntries(new URLSearchParams(rawBody)) as Record<string, string>;

  // 1. Signature check
  if (!verifyItnSignature(payload)) {
    console.warn("ITN rejected: bad signature");
    return new NextResponse("bad signature", { status: 400 });
  }

  // 2. Server-to-server confirmation with PayFast
  const confirmed = await validateItnWithPayfast(rawBody).catch(() => false);
  if (!confirmed) {
    console.warn("ITN rejected: PayFast validation failed");
    return new NextResponse("not valid", { status: 400 });
  }

  // 3. Order + amount check
  const orderId = payload.m_payment_id;
  const order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;
  if (!order) return new NextResponse("unknown order", { status: 400 });

  const paidCents = Math.round(parseFloat(payload.amount_gross ?? "0") * 100);
  if (Math.abs(paidCents - order.amountCents) > 1) {
    console.warn(`ITN amount mismatch for ${order.id}: got ${paidCents}, expected ${order.amountCents}`);
    return new NextResponse("amount mismatch", { status: 400 });
  }

  if (payload.payment_status === "COMPLETE" && order.status === "PENDING") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", pfPaymentId: payload.pf_payment_id ?? null },
    });
    await fulfilOrder(order.id);
  } else if (payload.payment_status === "CANCELLED" && order.status === "PENDING") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  }

  return new NextResponse("ok");
}

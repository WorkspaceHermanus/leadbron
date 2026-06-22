import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVertical } from "@/lib/verticals";
import { buildCheckout } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const vertical = getVertical(String(body.vertical ?? ""));
  const quantity = Number(body.quantity);
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!vertical) return NextResponse.json({ error: "Unknown lead type." }, { status: 400 });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500)
    return NextResponse.json({ error: "Quantity must be between 1 and 500." }, { status: 400 });
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });

  // Price is always taken from the server-side catalogue — never from the client.
  const amountCents = vertical.unitPriceCents * quantity;

  const order = await prisma.order.create({
    data: {
      adviserName: name,
      adviserEmail: email,
      adviserPhone: body.phone ? String(body.phone).slice(0, 30) : null,
      vertical: vertical.slug,
      quantity,
      unitPriceCents: vertical.unitPriceCents,
      amountCents,
    },
  });

  const checkout = buildCheckout({
    orderId: order.id,
    amountCents,
    itemName: `${quantity} x ${vertical.name} leads`,
    buyerName: name,
    buyerEmail: email,
  });

  return NextResponse.json(checkout);
}

import crypto from "crypto";

const SANDBOX_HOST = "sandbox.payfast.co.za";
const LIVE_HOST = "www.payfast.co.za";

export function payfastHost(): string {
  return process.env.PAYFAST_MODE === "live" ? LIVE_HOST : SANDBOX_HOST;
}

export function payfastProcessUrl(): string {
  return `https://${payfastHost()}/eng/process`;
}

/**
 * PayFast signature: urlencode values (spaces as +), keep field order as
 * constructed, append passphrase if set, then MD5.
 */
function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
}

export function payfastSignature(
  fields: Record<string, string>,
  passphrase?: string
): string {
  let str = Object.entries(fields)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join("&");
  if (passphrase) str += `&passphrase=${pfEncode(passphrase)}`;
  return crypto.createHash("md5").update(str).digest("hex");
}

export type CheckoutFields = { action: string; fields: Record<string, string> };

export function buildCheckout(opts: {
  orderId: string;
  amountCents: number;
  itemName: string;
  buyerName: string;
  buyerEmail: string;
}): CheckoutFields {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const [firstName, ...rest] = opts.buyerName.split(" ");
  // Field order matters for the signature — keep PayFast's documented order.
  const fields: Record<string, string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID ?? "",
    merchant_key: process.env.PAYFAST_MERCHANT_KEY ?? "",
    return_url: `${appUrl}/buy/thanks?order=${opts.orderId}`,
    cancel_url: `${appUrl}/buy?cancelled=1`,
    notify_url: `${appUrl}/api/payfast/itn`,
    name_first: firstName ?? "",
    name_last: rest.join(" "),
    email_address: opts.buyerEmail,
    m_payment_id: opts.orderId,
    amount: (opts.amountCents / 100).toFixed(2),
    item_name: opts.itemName.slice(0, 100),
  };
  fields.signature = payfastSignature(fields, process.env.PAYFAST_PASSPHRASE || undefined);
  return { action: payfastProcessUrl(), fields };
}

/** Verify an ITN payload's signature. */
export function verifyItnSignature(payload: Record<string, string>): boolean {
  const { signature, ...rest } = payload;
  if (!signature) return false;
  const calculated = payfastSignature(rest, process.env.PAYFAST_PASSPHRASE || undefined);
  return calculated === signature;
}

/** Ask PayFast's server to confirm the ITN data is genuine. */
export async function validateItnWithPayfast(rawBody: string): Promise<boolean> {
  const res = await fetch(`https://${payfastHost()}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: rawBody,
  });
  const text = await res.text();
  return text.trim() === "VALID";
}

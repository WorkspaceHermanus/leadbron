"use client";

import { useMemo, useState } from "react";

type Item = {
  slug: string;
  name: string;
  price: string;
  unitPriceCents: number;
  inStock: number;
};

export default function BuyForm({
  catalogue,
  initialVertical,
}: {
  catalogue: Item[];
  initialVertical?: string;
}) {
  const [vertical, setVertical] = useState(
    catalogue.find((c) => c.slug === initialVertical)?.slug ?? catalogue[0].slug
  );
  const [quantity, setQuantity] = useState(10);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const item = useMemo(() => catalogue.find((c) => c.slug === vertical)!, [catalogue, vertical]);
  const totalCents = item.unitPriceCents * quantity;

  async function checkout() {
    setError("");
    if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please fill in your name and a valid email — that's where your leads go.");
      return;
    }
    if (quantity < 1 || quantity > 500) {
      setError("Quantity must be between 1 and 500.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vertical, quantity, name, email, phone }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not start payment. Please try again.");
      setBusy(false);
      return;
    }
    const { action, fields } = (await res.json()) as {
      action: string;
      fields: Record<string, string>;
    };
    // Build and submit the PayFast form.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    for (const [k, v] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="rounded-lg border border-moss/20 bg-white p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="vertical">Lead type</label>
          <select id="vertical" value={vertical} onChange={(e) => setVertical(e.target.value)}>
            {catalogue.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} — {c.price}/lead ({c.inStock} in stock)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="qty">Quantity</label>
          <input
            id="qty"
            type="number"
            min={1}
            max={500}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="name">Your name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email (leads are sent here)</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-md bg-mist p-4">
        <span className="font-mono text-sm text-moss">
          {quantity} × {item.price}
        </span>
        <span className="font-display text-2xl font-800">R{(totalCents / 100).toFixed(2)}</span>
      </div>

      {item.inStock < quantity && (
        <p className="mt-3 text-sm text-moss">
          {item.inStock} lead{item.inStock === 1 ? "" : "s"} will be delivered immediately; the
          remaining {quantity - item.inStock} will be emailed automatically as new leads arrive.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-signal">{error}</p>}

      <button onClick={checkout} disabled={busy} className="btn-brass mt-6 disabled:opacity-60">
        {busy ? "Opening PayFast…" : "Pay with PayFast"}
      </button>
    </div>
  );
}

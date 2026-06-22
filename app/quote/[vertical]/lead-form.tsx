"use client";

import { useState } from "react";

export default function LeadForm({
  vertical,
  provinces,
  defaultProvince,
}: {
  vertical: string;
  provinces: string[];
  defaultProvince?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    setState("busy");
    setError("");
    const get = (id: string) =>
      (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
    const consent = (document.getElementById("consent") as HTMLInputElement | null)?.checked;

    if (!consent) {
      setError("Please tick the consent box so an adviser is allowed to contact you.");
      setState("idle");
      return;
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vertical,
        firstName: get("firstName"),
        lastName: get("lastName"),
        email: get("email"),
        phone: get("phone"),
        province: get("province"),
        notes: get("notes"),
        website: get("website"), // honeypot
        consent: true,
        source: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
      }),
    });

    if (res.ok) setState("done");
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please check your details and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    const shareText = encodeURIComponent(
      "I just requested a free insurance quote from LeadBron — a qualified adviser calls you back. Try it: https://leadbron.vercel.app/quote"
    );
    const whatsappShare = `https://wa.me/?text=${shareText}`;
    return (
      <div className="rounded-lg border border-brass bg-white p-8 text-center">
        <p className="text-4xl">✓</p>
        <p className="mt-3 font-display text-2xl font-700">You&apos;re all set</p>
        <p className="mt-2 text-moss">
          An accredited adviser will call you shortly. Keep your phone nearby.
        </p>
        <div className="mt-6 border-t border-moss/15 pt-6">
          <p className="text-sm font-semibold text-ink">
            Know someone else who needs cover?
          </p>
          <a
            href={whatsappShare}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brass mt-3 inline-flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-moss/20 bg-white p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" autoComplete="given-name" required />
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" autoComplete="family-name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="province">Province</label>
          <select id="province" defaultValue={defaultProvince ?? ""}>
            <option value="" disabled>
              Choose your province
            </option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes">Anything an adviser should know? (optional)</label>
          <textarea id="notes" rows={3} />
        </div>
        {/* Honeypot — humans never see or fill this */}
        <input id="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 normal-case tracking-normal">
        <input id="consent" type="checkbox" className="mt-1 h-4 w-4 !w-4" />
        <span className="text-sm normal-case tracking-normal text-ink">
          I agree that my details may be shared with an accredited financial adviser
          who will contact me about this request (POPIA consent).
        </span>
      </label>

      {error && <p className="mt-4 text-sm text-signal">{error}</p>}

      <button onClick={submit} disabled={state === "busy"} className="btn-brass mt-6 disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Request my call back"}
      </button>
    </div>
  );
}

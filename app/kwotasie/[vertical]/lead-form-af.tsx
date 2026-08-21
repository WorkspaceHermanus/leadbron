"use client";

import { useState } from "react";
import { getAttribution, trackConversion } from "@/lib/attribution";

export default function LeadFormAf({
  vertical,
  provinces,
}: {
  vertical: string;
  provinces: { en: string; af: string }[];
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    setState("busy");
    setError("");
    const get = (id: string) =>
      (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
    const consent = (document.getElementById("af_consent") as HTMLInputElement | null)?.checked;

    if (!consent) {
      setError("Merk asseblief die blokkie sodat 'n adviseur jou mag kontak.");
      setState("idle");
      return;
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vertical,
        firstName: get("af_firstName"),
        lastName: get("af_lastName"),
        email: get("af_email"),
        phone: get("af_phone"),
        province: get("af_province"),
        notes: get("af_notes"),
        website: get("af_website"), // heuningpot
        consent: true,
        source: "af",
        attribution: getAttribution(),
      }),
    });

    if (res.ok) {
      trackConversion();
      setState("done");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Iets het verkeerd geloop. Kontroleer asseblief jou besonderhede.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-lg border border-brass bg-white p-8 text-center">
        <p className="text-4xl">✓</p>
        <p className="mt-3 font-display text-2xl font-700">Alles reg!</p>
        <p className="mt-2 text-moss">
          &apos;n Geakkrediteerde adviseur bel jou binnekort. Hou jou foon naby.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-moss/20 bg-white p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="af_firstName">Naam</label>
          <input id="af_firstName" autoComplete="given-name" required />
        </div>
        <div>
          <label htmlFor="af_lastName">Van</label>
          <input id="af_lastName" autoComplete="family-name" required />
        </div>
        <div>
          <label htmlFor="af_email">E-pos</label>
          <input id="af_email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="af_phone">Selfoonnommer</label>
          <input id="af_phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="af_province">Provinsie</label>
          <select id="af_province" defaultValue="">
            <option value="" disabled>
              Kies jou provinsie
            </option>
            {provinces.map((p) => (
              <option key={p.en} value={p.en}>
                {p.af}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="af_notes">Iets wat die adviseur moet weet? (opsioneel)</label>
          <textarea id="af_notes" rows={3} />
        </div>
        <input id="af_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 normal-case tracking-normal">
        <input id="af_consent" type="checkbox" className="mt-1 h-4 w-4 !w-4" />
        <span className="text-sm normal-case tracking-normal text-ink">
          Ek stem in dat my besonderhede met een geakkrediteerde finansiële adviseur
          gedeel mag word wat my oor hierdie navraag sal kontak (POPIA toestemming).
        </span>
      </label>

      {error && <p className="mt-4 text-sm text-signal">{error}</p>}

      <button onClick={submit} disabled={state === "busy"} className="btn-brass mt-6 disabled:opacity-60">
        {state === "busy" ? "Stuur tans…" : "Laat my terugbel"}
      </button>
    </div>
  );
}

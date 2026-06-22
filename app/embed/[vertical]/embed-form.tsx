"use client";

import { useState } from "react";

export default function EmbedForm({
  vertical,
  verticalName,
  provinces,
}: {
  vertical: string;
  verticalName: string;
  provinces: string[];
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError("");
    const fd = new FormData(e.currentTarget);
    const consent = fd.get("consent") === "on";
    if (!consent) {
      setError("Please tick the consent box.");
      setState("idle");
      return;
    }
    const res = await fetch("https://leadbron.vercel.app/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vertical,
        firstName: fd.get("firstName"),
        lastName: fd.get("lastName"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        province: fd.get("province"),
        notes: fd.get("notes"),
        website: fd.get("website"),
        consent: true,
        source: "embed",
      }),
    });
    if (res.ok) {
      setState("done");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="done">
        <h2>✓ You&apos;re all set</h2>
        <p>An accredited adviser will call you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <p style={{ fontSize: 13, color: "#2e5546", marginBottom: 16 }}>
        Request a free {verticalName.toLowerCase()} quote — an accredited adviser will call you back.
      </p>
      <div className="grid">
        <div>
          <label>First name</label>
          <input name="firstName" autoComplete="given-name" required />
        </div>
        <div>
          <label>Last name</label>
          <input name="lastName" autoComplete="family-name" required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label>Phone</label>
          <input name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="span2">
          <label>Province</label>
          <select name="province" defaultValue="" required>
            <option value="" disabled>Choose your province</option>
            {provinces.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="span2">
          <label>Anything an adviser should know? (optional)</label>
          <textarea name="notes" rows={2} />
        </div>
        {/* Honeypot */}
        <input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden />
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" />
        <span>
          I agree my details may be shared with one accredited financial adviser for this request (POPIA consent).
        </span>
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn" disabled={state === "busy"}>
        {state === "busy" ? "Sending…" : "Request my call back"}
      </button>
    </form>
  );
}

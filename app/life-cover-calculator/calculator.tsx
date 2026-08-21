"use client";

import { useMemo, useState } from "react";
import { getAttribution, trackConversion } from "@/lib/attribution";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

// Rough SA cost of raising a child to tertiary completion (education-weighted).
const COST_PER_CHILD = 400000;
const RETIREMENT_AGE = 65;

// Share of income the household still needs once the earner is gone. Their own
// living costs fall away, so replacing 100% overstates the need.
const REPLACEMENT_RATIO = 0.75;

// Real (after-inflation) return assumed on the invested lump sum. Without
// discounting, income × years wildly overstates the cover required.
const REAL_RETURN = 0.03;

/** Present value of `annual` paid every year for `years`, at a real return. */
function presentValue(annual: number, years: number): number {
  if (annual <= 0 || years <= 0) return 0;
  return annual * ((1 - Math.pow(1 + REAL_RETURN, -years)) / REAL_RETURN);
}

type Field = "income" | "age" | "children" | "debts" | "existing";

export default function Calculator({ provinces }: { provinces: string[] }) {
  const [values, setValues] = useState<Record<Field, string>>({
    income: "",
    age: "",
    children: "",
    debts: "",
    existing: "",
  });

  const num = (f: Field) => {
    const n = parseFloat(values[f].replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const result = useMemo(() => {
    const income = num("income");
    const age = num("age");
    const children = num("children");
    const debts = num("debts");
    const existing = num("existing");

    // Income replacement until retirement (min 10 years so a 60-year-old
    // still models a meaningful runway for dependants). Discounted to today's
    // value, because the payout is invested rather than kept under a mattress.
    const years = Math.max(10, RETIREMENT_AGE - age);
    const incomeReplacement = presentValue(income * REPLACEMENT_RATIO, years);
    const education = children * COST_PER_CHILD;

    const recommended = incomeReplacement + debts + education;
    const shortfall = Math.max(0, recommended - existing);

    return { years, incomeReplacement, education, recommended, shortfall, existing };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const hasEnoughToCalculate = num("income") > 0 && num("age") > 0;
  const [showLeadForm, setShowLeadForm] = useState(false);

  function set(field: Field, raw: string) {
    setValues((prev) => ({ ...prev, [field]: raw }));
  }

  const summary = hasEnoughToCalculate
    ? `Life Cover Calculator result — recommended cover ${zar.format(
        result.recommended
      )}, existing cover ${zar.format(result.existing)}, shortfall ${zar.format(
        result.shortfall
      )}. (Income ${zar.format(num("income"))}/yr, age ${num("age")}, ${num(
        "children"
      )} children, debts ${zar.format(num("debts"))}.)`
    : "";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="rounded-lg border border-moss/20 bg-white p-6 md:p-8">
        <h2 className="font-display text-xl font-700">Your details</h2>
        <p className="mt-1 text-sm text-moss">
          Nothing is stored while you calculate. Adjust any number to see it update.
        </p>

        <div className="mt-6 space-y-5">
          <NumberField
            id="income"
            label="Your gross annual income (R)"
            placeholder="e.g. 480000"
            value={values.income}
            onChange={(v) => set("income", v)}
            hint="Total yearly income before tax."
          />
          <NumberField
            id="age"
            label="Your age"
            placeholder="e.g. 38"
            value={values.age}
            onChange={(v) => set("age", v)}
            hint="Used to work out how many earning years to protect."
          />
          <NumberField
            id="children"
            label="Number of children to support"
            placeholder="e.g. 2"
            value={values.children}
            onChange={(v) => set("children", v)}
            hint={`We budget about ${zar.format(COST_PER_CHILD)} per child for raising & education.`}
          />
          <NumberField
            id="debts"
            label="Total debts — bond, car, loans (R)"
            placeholder="e.g. 950000"
            value={values.debts}
            onChange={(v) => set("debts", v)}
            hint="What would need to be settled if you passed away."
          />
          <NumberField
            id="existing"
            label="Life cover you already have (R)"
            placeholder="e.g. 500000"
            value={values.existing}
            onChange={(v) => set("existing", v)}
            hint="Include employer group cover if you have it."
          />
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col gap-4">
        {!hasEnoughToCalculate ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-moss/30 bg-white p-8 text-center">
            <p className="text-4xl">🧮</p>
            <p className="mt-3 font-display text-lg font-700">Your result appears here</p>
            <p className="mt-2 max-w-xs text-sm text-moss">
              Enter at least your income and age on the left to see how much life
              cover you should have.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Recommended cover" value={zar.format(result.recommended)} tone="neutral" />
              <StatCard label="Cover you have" value={zar.format(result.existing)} tone="neutral" />
            </div>

            <div
              className={`rounded-lg p-6 text-center ${
                result.shortfall > 0 ? "bg-signal text-white" : "bg-moss text-white"
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest opacity-80">
                {result.shortfall > 0 ? "Your cover shortfall" : "You're covered"}
              </p>
              <p className="mt-1 font-display text-4xl font-800">
                {zar.format(result.shortfall)}
              </p>
              <p className="mt-2 text-sm opacity-90">
                {result.shortfall > 0
                  ? `If something happened tomorrow, your family could be short ${zar.format(
                      result.shortfall
                    )} to stay in their home and keep their standard of living.`
                  : "Based on these numbers your existing cover meets the recommended amount. It's still worth a free check-up as your life changes."}
              </p>
            </div>

            <div className="rounded-lg border border-moss/20 bg-white p-4 text-sm text-moss">
              <p className="font-semibold text-ink">How we got there</p>
              <ul className="mt-2 space-y-1">
                <li>
                  Income to replace ({result.years} yrs at 75%):{" "}
                  {zar.format(result.incomeReplacement)}
                </li>
                <li>Debts to settle: {zar.format(num("debts"))}</li>
                <li>Children provision: {zar.format(result.education)}</li>
                <li>Less cover you have: −{zar.format(result.existing)}</li>
              </ul>
              <p className="mt-2 text-xs text-moss/70">
                The income portion is discounted at 3% a year, because a lump sum
                is invested rather than spent all at once.
              </p>
            </div>

            {!showLeadForm ? (
              <button onClick={() => setShowLeadForm(true)} className="btn-brass w-full text-center">
                {result.shortfall > 0
                  ? "Get a free plan to close this gap →"
                  : "Get a free cover check-up →"}
              </button>
            ) : (
              <LeadCapture provinces={provinces} summary={summary} />
            )}
            <p className="text-center text-[11px] text-moss/70">
              This is a general estimate, not financial advice. An accredited
              adviser can tailor it to your situation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  placeholder,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-moss/70">{hint}</p>}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "neutral" }) {
  return (
    <div className="rounded-lg border border-moss/20 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-moss">{label}</p>
      <p className="mt-1 font-display text-xl font-800 text-ink">{value}</p>
    </div>
  );
}

function LeadCapture({ provinces, summary }: { provinces: string[]; summary: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    setState("busy");
    setError("");
    const get = (id: string) =>
      (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
    const consent = (document.getElementById("lc_consent") as HTMLInputElement | null)?.checked;

    if (!consent) {
      setError("Please tick the consent box so an adviser is allowed to contact you.");
      setState("idle");
      return;
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vertical: "long-term",
        firstName: get("lc_firstName"),
        lastName: get("lc_lastName"),
        email: get("lc_email"),
        phone: get("lc_phone"),
        province: get("lc_province"),
        notes: summary,
        website: get("lc_website"), // honeypot
        consent: true,
        source:
          new URLSearchParams(window.location.search).get("utm_source") ??
          "life-cover-calculator",
        attribution: getAttribution(),
      }),
    });

    if (res.ok) {
      trackConversion();
      setState("done");
    }
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please check your details and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-lg border border-brass bg-white p-6 text-center">
        <p className="text-3xl">✓</p>
        <p className="mt-2 font-display text-lg font-700">Your breakdown is on its way</p>
        <p className="mt-1 text-sm text-moss">
          An accredited adviser will call you shortly with a plan to close the gap.
          Keep your phone nearby.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-moss/20 bg-white p-6">
      <p className="font-display font-700">Get your free plan</p>
      <p className="mt-1 text-sm text-moss">
        An accredited adviser will call with options that fit your budget — no cost,
        no obligation.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="lc_firstName">First name</label>
          <input id="lc_firstName" autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="lc_lastName">Last name</label>
          <input id="lc_lastName" autoComplete="family-name" />
        </div>
        <div>
          <label htmlFor="lc_email">Email</label>
          <input id="lc_email" type="email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="lc_phone">Phone</label>
          <input id="lc_phone" type="tel" autoComplete="tel" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lc_province">Province</label>
          <select id="lc_province" defaultValue="">
            <option value="" disabled>
              Choose your province
            </option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        {/* Honeypot */}
        <input
          id="lc_website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 normal-case tracking-normal">
        <input id="lc_consent" type="checkbox" className="mt-1 h-4 w-4 !w-4" />
        <span className="text-sm normal-case tracking-normal text-ink">
          I agree that my details may be shared with one accredited financial
          adviser who will contact me about this request (POPIA consent).
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-signal">{error}</p>}

      <button
        onClick={submit}
        disabled={state === "busy"}
        className="btn-brass mt-5 w-full text-center disabled:opacity-60"
      >
        {state === "busy" ? "Sending…" : "Request my free call"}
      </button>
    </div>
  );
}

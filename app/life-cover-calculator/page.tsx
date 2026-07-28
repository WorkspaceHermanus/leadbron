import type { Metadata } from "next";
import Link from "next/link";
import { PROVINCES } from "@/lib/verticals";
import { SITE_URL } from "@/lib/site";
import Calculator from "./calculator";

const TITLE = "How much life cover do I need? — Free SA calculator";
const DESCRIPTION =
  "Work out how much life cover you actually need in South Africa. Free calculator — income replacement, debts and children's education, minus the cover you already have. No signup.";

export const metadata: Metadata = {
  title: `${TITLE} | LeadBron`,
  description: DESCRIPTION,
  alternates: { canonical: "/life-cover-calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_ZA",
  },
};

const FAQS = [
  {
    q: "How much life cover do I need in South Africa?",
    a: "A common rule of thumb is 10 to 15 times your annual income, but that ignores your actual situation. A better estimate works out the income your family would need until you would have retired — typically around 75% of what you earn, since your own living costs fall away — then adds every debt that must be settled (bond, car, personal loans) and the cost of raising and educating your children, and subtracts the cover you already have, including group cover through your employer.",
  },
  {
    q: "Does life cover from my employer count?",
    a: "Yes, include it — but treat it as temporary. Group life cover usually ends the day you leave that job, and the payout is often only two to four times your annual salary. It is a useful base, not a full plan, and it is worth knowing exactly what it pays out.",
  },
  {
    q: "What does life cover actually pay for?",
    a: "It pays a lump sum to your beneficiaries when you die. In practice that money settles the bond so your family can stay in the home, clears debts that would otherwise be paid out of your estate, covers immediate costs, and replaces the income your household relied on.",
  },
  {
    q: "Is life cover expensive in South Africa?",
    a: "It is usually cheaper than people expect, and premiums are heavily influenced by your age, health and whether you smoke. Cover bought in your thirties costs meaningfully less than the same cover bought in your fifties, because premiums are priced on your age when the policy starts.",
  },
  {
    q: "Is this calculator financial advice?",
    a: "No. It is a general estimate to give you a realistic starting number. Your actual need depends on your tax position, your estate, existing policies, your spouse's income and other factors. An accredited financial adviser can tailor it properly — and that consultation is free.",
  },
];

export default function LifeCoverCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Life Cover Needs Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: `${SITE_URL}/life-cover-calculator`,
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR" },
      provider: {
        "@type": "Organization",
        name: "LeadBron",
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-ink py-14 text-mist">
        <div className="mx-auto max-w-5xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
            Free calculator · No signup
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-800 leading-tight tracking-tight md:text-5xl">
            How much life cover do you actually need?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-mist/80">
            Most South Africans are guessing — and most are underinsured. Answer
            five questions and see your real number in about thirty seconds.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <Calculator provinces={PROVINCES} />
      </section>

      {/* Explainer */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-2xl font-700 tracking-tight">
            How this calculator works
          </h2>
          <p className="mt-3 text-moss">
            The &ldquo;ten times your salary&rdquo; rule is a shortcut that ignores
            your debts and your children. This calculator builds your number from
            four parts instead:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                t: "Income to replace",
                d: "Roughly 75% of your income for every year until you would have retired at 65 — discounted, because a lump sum is invested rather than spent at once.",
              },
              {
                t: "Debts to settle",
                d: "Your bond, car finance and loans. If these are not settled, they are paid out of your estate before anything reaches your family.",
              },
              {
                t: "Children's provision",
                d: "Roughly R400,000 per child towards raising and educating them through to tertiary level.",
              },
              {
                t: "Cover you already have",
                d: "Existing policies and employer group cover are subtracted, because that portion of the need is already met.",
              },
            ].map((s) => (
              <div key={s.t} className="rounded-lg border border-moss/20 bg-mist/40 p-5">
                <p className="font-display font-700">{s.t}</p>
                <p className="mt-1 text-sm text-moss">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-moss">
            The result is an estimate designed to be realistic rather than precise.
            It does not account for tax, estate duty, your spouse&apos;s income or
            existing investments — which is exactly what a free consultation with an
            accredited adviser covers.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-display text-2xl font-700 tracking-tight">
          Common questions
        </h2>
        <div className="mt-6 divide-y divide-moss/15 border-y border-moss/15">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {f.q}
                <span className="font-mono text-brass transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-moss">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Cross-links to the other verticals */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-xl font-700 tracking-tight">
            Also worth sorting out
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { href: "/quote/long-term", label: "Life cover quote" },
              { href: "/quote/medical-aid", label: "Medical aid & gap cover" },
              { href: "/quote/wills-trusts", label: "Get a will drawn up" },
              { href: "/quote/short-term", label: "Car & home insurance" },
              { href: "/quote/business", label: "Business cover" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-moss/25 px-4 py-2 text-sm font-medium text-ink transition hover:border-brass hover:text-brassdeep"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

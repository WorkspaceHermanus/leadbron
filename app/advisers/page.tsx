import type { Metadata } from "next";
import Link from "next/link";
import { VERTICALS, rand } from "@/lib/verticals";

export const metadata: Metadata = {
  title: "For Financial Advisers — LeadBron",
  description:
    "Buy fresh, POPIA-consented leads from people actively looking for insurance and financial planning. Pay once, receive instantly. No monthly fees.",
};

export default function AdvisersPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-ink py-16 text-mist">
        <div className="mx-auto max-w-4xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">For financial advisers</p>
          <h1 className="mt-4 font-display text-5xl font-800 leading-tight tracking-tight md:text-6xl">
            Stop chasing cold leads.
            <br />
            Buy warm ones.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-mist/80">
            Every lead on LeadBron is a real South African who asked to be called by a financial adviser.
            You pay once, we email you the contact details instantly. No subscription, no minimum spend,
            no shared leads — every lead is sold to one adviser only.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/buy" className="btn-brass text-base">
              Start buying leads →
            </Link>
          </div>
        </div>
      </section>

      {/* Why LeadBron */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-display text-3xl font-700 tracking-tight">Why advisers choose LeadBron</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "✓",
              title: "POPIA-compliant consent",
              body: "Every lead ticked a consent box with a timestamp. You're covered legally before you make the first call.",
            },
            {
              icon: "✓",
              title: "Exclusive — sold once",
              body: "When you buy a lead, it's yours. We remove it from inventory immediately. You never compete for the same person.",
            },
            {
              icon: "✓",
              title: "Delivered instantly",
              body: "Pay via PayFast and the CSV lands in your inbox automatically — no waiting, no account manager, no delays.",
            },
            {
              icon: "✓",
              title: "No subscriptions",
              body: "Buy 1 lead or 100. Pay only for what you order. Cancel any time by simply not ordering more.",
            },
            {
              icon: "✓",
              title: "Backorder protection",
              body: "If we're out of stock in your vertical, your order stays open. Leads are emailed to you automatically as they come in.",
            },
            {
              icon: "✓",
              title: "Fresh intent",
              body: "These people just filled in a form — they're actively looking right now. Strike while the intent is hot.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-moss/20 bg-white p-6">
              <p className="font-mono text-brass">{f.icon}</p>
              <p className="mt-2 font-display text-lg font-700">{f.title}</p>
              <p className="mt-2 text-sm text-moss">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-3xl font-700 tracking-tight">Lead pricing</h2>
          <p className="mt-2 text-moss">Flat price per category. No hidden fees.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VERTICALS.map((v) => (
              <div key={v.slug} className="rounded-lg border border-moss/20 p-6">
                <p className="font-display text-base font-700">{v.name}</p>
                <p className="mt-3 font-mono text-3xl text-ink">
                  {rand(v.unitPriceCents)}
                  <span className="text-sm text-moss"> / lead</span>
                </p>
                <Link
                  href={`/buy?vertical=${v.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-brassdeep hover:text-brass"
                >
                  Order now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-display text-3xl font-700 tracking-tight">How it works</h2>
        <ol className="mt-8 space-y-8">
          {[
            {
              step: "1",
              title: "Pick your category and quantity",
              body: 'Go to the Buy Leads page, choose the insurance type (life, short-term, medical aid, etc.) and how many leads you want.',
            },
            {
              step: "2",
              title: "Pay securely with PayFast",
              body: "Credit card, EFT, or instant EFT — PayFast handles the transaction. Your order is created the moment payment clears.",
            },
            {
              step: "3",
              title: "CSV lands in your inbox",
              body: "Within seconds of payment, an email arrives with a CSV attached. Name, email, phone, province, and the POPIA consent timestamp for each person.",
            },
            {
              step: "4",
              title: "Call them — they're expecting it",
              body: "The lead asked for an adviser to call them. You're not cold-calling. You're following up on a request. Close rates are significantly higher.",
            },
          ].map((s) => (
            <li key={s.step} className="flex gap-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass font-display text-lg font-800 text-ink">
                {s.step}
              </span>
              <div>
                <p className="font-display text-lg font-700">{s.title}</p>
                <p className="mt-1 text-moss">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-mist">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-4xl font-800 tracking-tight">Ready to fill your pipeline?</h2>
          <p className="mt-4 text-mist/80">
            No account required. Pick a lead type, pay, and receive your contacts within seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/buy" className="btn-brass text-base">
              Buy leads now →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


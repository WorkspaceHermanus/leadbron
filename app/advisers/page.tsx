import type { Metadata } from "next";
import Link from "next/link";
import { VERTICALS, rand } from "@/lib/verticals";

export const metadata: Metadata = {
  title: "For Financial Advisers — LeadBron",
  description:
    "Buy fresh, POPIA-consented leads from people actively looking for insurance and financial planning. Pay once, receive instantly. No monthly fees.",
};

const WHATSAPP_NUMBER = "27000000000"; // TODO: replace with your WhatsApp number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'm a financial adviser and I'd like to know more about buying leads from LeadBron."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-mist/30 px-6 py-3 font-semibold text-mist hover:border-brass hover:text-brass"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-mist/30 px-6 py-3 font-semibold text-mist hover:border-brass hover:text-brass"
            >
              <WhatsAppIcon />
              Ask us anything on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

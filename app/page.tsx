import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VERTICALS, getVertical, rand } from "@/lib/verticals";

export const dynamic = "force-dynamic";

function timeAgo(d: Date): string {
  const mins = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

async function tickerItems(): Promise<{ label: string; meta: string }[]> {
  try {
    const recent = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { vertical: true, province: true, createdAt: true },
    });
    if (recent.length > 0) {
      return recent.map((l) => ({
        label: getVertical(l.vertical)?.name ?? l.vertical,
        meta: `${l.province} · ${timeAgo(l.createdAt)}`,
      }));
    }
  } catch {
    // DB not provisioned yet — fall through to sample tape.
  }
  return [
    { label: "Life cover & long term", meta: "Gauteng · 4 min ago" },
    { label: "Medical aid & gap cover", meta: "Western Cape · 9 min ago" },
    { label: "Wills & trusts", meta: "KwaZulu-Natal · 16 min ago" },
    { label: "Short term insurance", meta: "Gauteng · 21 min ago" },
    { label: "Business cover", meta: "Western Cape · 33 min ago" },
    { label: "Life cover & long term", meta: "Free State · 41 min ago" },
  ];
}

export default async function Home() {
  const items = await tickerItems();
  const tape = [...items, ...items]; // duplicated for seamless loop

  return (
    <main>
      {/* Hero */}
      <section className="bg-ink text-mist">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
            The South African lead exchange
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-800 leading-[1.05] tracking-tight md:text-6xl">
            Fresh, consented leads.
            <br />
            Delivered the minute you pay.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-mist/80">
            Every lead is a real person who asked to be contacted by a financial
            adviser — captured with timestamped POPIA consent, sold once, and
            emailed to you automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/buy" className="btn-brass">Buy leads</Link>
            <Link
              href="/quote"
              className="inline-block rounded-md border border-mist/30 px-6 py-3 font-semibold text-mist hover:border-brass hover:text-brass"
            >
              I want a quote instead
            </Link>
          </div>
        </div>

        {/* Signature: the lead tape — leads as a live market feed */}
        <div className="overflow-hidden border-y border-brass/30 bg-pine py-3" aria-label="Recent leads">
          <div className="tape-track flex w-max gap-10">
            {tape.map((t, i) => (
              <span key={i} className="flex items-baseline gap-3 whitespace-nowrap font-mono text-sm">
                <span className="text-brass">▮</span>
                <span className="text-mist">{t.label}</span>
                <span className="text-mist/50">{t.meta}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Verticals + pricing */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-700 tracking-tight">What a lead costs</h2>
        <p className="mt-2 max-w-xl text-moss">
          One flat price per vertical. Exclusive — a lead is sold to one adviser
          only, then retired.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v) => (
            <div key={v.slug} className="rounded-lg border border-moss/20 bg-white p-6">
              <p className="font-display text-lg font-700">{v.name}</p>
              <p className="mt-3 font-mono text-3xl text-ink">
                {rand(v.unitPriceCents)}
                <span className="text-sm text-moss"> / lead</span>
              </p>
              <Link
                href={`/buy?vertical=${v.slug}`}
                className="mt-5 inline-block font-semibold text-brassdeep hover:text-brass"
              >
                Order {v.name.toLowerCase()} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-700 tracking-tight">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                t: "A consumer asks for help",
                d: "Our campaign pages capture people actively looking for cover — with explicit, timestamped consent to be contacted by an adviser.",
              },
              {
                t: "You place an order",
                d: "Pick a vertical and quantity, pay securely with PayFast. No subscriptions, no minimums.",
              },
              {
                t: "Leads land in your inbox",
                d: "Available leads are emailed instantly as a CSV. If stock runs short, the rest are sent automatically as new leads arrive — oldest order first.",
              },
            ].map((s) => (
              <div key={s.t}>
                <p className="font-display text-lg font-700">{s.t}</p>
                <p className="mt-2 text-moss">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

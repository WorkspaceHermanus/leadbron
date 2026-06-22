import Link from "next/link";
import { VERTICALS } from "@/lib/verticals";

export default function QuoteHub() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl font-800 tracking-tight">
        What do you need help with?
      </h1>
      <p className="mt-3 text-moss">
        Pick one and an accredited financial adviser will call you back — usually
        the same day.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {VERTICALS.map((v) => (
          <Link
            key={v.slug}
            href={`/quote/${v.slug}`}
            className="rounded-lg border border-moss/20 bg-white p-6 transition hover:border-brass"
          >
            <p className="font-display text-lg font-700">{v.name}</p>
            <p className="mt-2 text-sm text-moss">{v.consumerSub}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVertical, VERTICALS, PROVINCES } from "@/lib/verticals";
import LeadForm from "./lead-form";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export function generateMetadata({ params }: { params: { vertical: string } }): Metadata {
  const v = getVertical(params.vertical);
  if (!v) return {};
  return {
    title: `${v.consumerHeadline} — LeadBron`,
    description: v.consumerSub,
    openGraph: { title: v.consumerHeadline, description: v.consumerSub },
  };
}

export default function QuotePage({ params }: { params: { vertical: string } }) {
  const v = getVertical(params.vertical);
  if (!v) notFound();

  return (
    <main>
      <section className="bg-ink py-14 text-mist">
        <div className="mx-auto max-w-3xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">{v.name}</p>
          <h1 className="mt-3 font-display text-4xl font-800 leading-tight tracking-tight md:text-5xl">
            {v.consumerHeadline}
          </h1>
          <p className="mt-4 max-w-xl text-mist/80">{v.consumerSub}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <LeadForm vertical={v.slug} provinces={PROVINCES} />
        <p className="mt-6 text-xs text-moss">
          Your details are shared with one accredited financial adviser only, for
          the purpose you requested, in line with the Protection of Personal
          Information Act (POPIA). We never resell your information.
        </p>
      </section>
    </main>
  );
}

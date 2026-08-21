import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVerticalAf, VERTICALS_AF, PROVINSIE_NAAM } from "@/lib/verticals-af";
import { getVertical, PROVINCES } from "@/lib/verticals";
import { SITE_URL } from "@/lib/site";
import LeadFormAf from "./lead-form-af";

export function generateStaticParams() {
  return VERTICALS_AF.map((v) => ({ vertical: v.slug }));
}

export function generateMetadata({ params }: { params: { vertical: string } }): Metadata {
  const v = getVerticalAf(params.vertical);
  if (!v) return {};
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: `/kwotasie/${v.slug}` },
    openGraph: { title: v.headline, description: v.metaDescription, locale: "af_ZA" },
  };
}

export default function KwotasiePage({ params }: { params: { vertical: string } }) {
  const v = getVerticalAf(params.vertical);
  if (!v) notFound();

  const english = getVertical(v.englishSlug);
  if (!english) notFound();

  const provinces = PROVINCES.map((p) => ({ en: p, af: PROVINSIE_NAAM[p] ?? p }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: v.name,
    description: v.metaDescription,
    areaServed: { "@type": "Country", name: "South Africa" },
    provider: { "@type": "Organization", name: "LeadBron", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
      description: "Gratis kwotasie — geen verpligting",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-ink py-14 text-mist">
        <div className="mx-auto max-w-3xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">{v.name}</p>
          <h1 className="mt-3 font-display text-4xl font-800 leading-tight tracking-tight md:text-5xl">
            {v.headline}
          </h1>
          <p className="mt-4 max-w-xl text-mist/80">{v.sub}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist/70">
            <li>✓ Heeltemal gratis</li>
            <li>✓ Geen verpligting</li>
            <li>✓ Geakkrediteerde adviseurs</li>
            <li>✓ Ons verkoop nooit jou besonderhede aan meer as een adviseur nie</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <LeadFormAf vertical={english.slug} provinces={provinces} />
        <p className="mt-6 text-xs text-moss">
          Jou besonderhede word met slegs een geakkrediteerde finansiële adviseur
          gedeel, vir die doel wat jy aangevra het, ooreenkomstig die Wet op die
          Beskerming van Persoonlike Inligting (POPIA). Ons herverkoop nooit jou
          inligting nie.
        </p>
      </section>
    </main>
  );
}

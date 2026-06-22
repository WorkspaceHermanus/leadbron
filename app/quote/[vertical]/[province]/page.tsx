import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVertical, getProvince, VERTICALS, PROVINCE_SLUGS, PROVINCES } from "@/lib/verticals";
import LeadForm from "../lead-form";

export function generateStaticParams() {
  const params = [];
  for (const v of VERTICALS) {
    for (const pSlug of Object.keys(PROVINCE_SLUGS)) {
      params.push({ vertical: v.slug, province: pSlug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { vertical: string; province: string };
}): Metadata {
  const v = getVertical(params.vertical);
  const province = getProvince(params.province);
  if (!v || !province) return {};
  const title = `${v.name} quotes in ${province} — LeadBron`;
  const description = `Looking for ${v.name.toLowerCase()} in ${province}? Get a free callback from an accredited financial adviser. POPIA-compliant, no obligation.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function ProvinceQuotePage({
  params,
}: {
  params: { vertical: string; province: string };
}) {
  const v = getVertical(params.vertical);
  const province = getProvince(params.province);
  if (!v || !province) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${v.name} in ${province}`,
    description: `Get ${v.name.toLowerCase()} quotes in ${province}. An accredited financial adviser will call you back with options that fit your needs.`,
    areaServed: {
      "@type": "State",
      name: province,
      containedInPlace: { "@type": "Country", name: "South Africa" },
    },
    provider: {
      "@type": "Organization",
      name: "LeadBron",
      url: "https://leadbron.vercel.app",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
      description: "Free quote — no obligation",
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
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
            {v.name} · {province}
          </p>
          <h1 className="mt-3 font-display text-4xl font-800 leading-tight tracking-tight md:text-5xl">
            {v.name} quotes in {province}
          </h1>
          <p className="mt-4 max-w-xl text-mist/80">
            {v.consumerSub} We connect you with an accredited adviser who covers {province}.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-12">
        <LeadForm vertical={v.slug} provinces={PROVINCES} defaultProvince={province} />
        <p className="mt-6 text-xs text-moss">
          Your details are shared with one accredited financial adviser only, for the purpose you
          requested, in line with the Protection of Personal Information Act (POPIA). We never
          resell your information.
        </p>
      </section>
    </main>
  );
}

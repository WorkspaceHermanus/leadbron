import { MetadataRoute } from "next";
import { VERTICALS, PROVINCE_SLUGS } from "@/lib/verticals";

const BASE = "https://leadbron.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/buy`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/advisers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/partner`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/quote`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/quote/${v.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const provincePages: MetadataRoute.Sitemap = VERTICALS.flatMap((v) =>
    Object.keys(PROVINCE_SLUGS).map((pSlug) => ({
      url: `${BASE}/quote/${v.slug}/${pSlug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...verticalPages, ...provincePages];
}

import { MetadataRoute } from "next";
import { VERTICALS } from "@/lib/verticals";

const BASE = "https://leadbron.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/buy`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/advisers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/quote`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${BASE}/quote/${v.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...verticalPages];
}

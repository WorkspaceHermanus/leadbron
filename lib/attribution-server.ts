/** Server-side sanitising of the attribution blob a browser sends us. */

export type StoredAttribution = {
  gclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landingPage: string | null;
};

const clean = (v: unknown, max = 300): string | null => {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s.length > 0 ? s : null;
};

export function parseAttribution(input: unknown): StoredAttribution {
  const a = (input ?? {}) as Record<string, unknown>;
  return {
    gclid: clean(a.gclid, 200),
    utmSource: clean(a.utmSource, 100),
    utmMedium: clean(a.utmMedium, 100),
    utmCampaign: clean(a.utmCampaign, 150),
    utmTerm: clean(a.utmTerm, 200),
    utmContent: clean(a.utmContent, 150),
    landingPage: clean(a.landingPage, 300),
  };
}

/**
 * Paid-acquisition attribution.
 *
 * A visitor often lands on an ad, browses, and only converts a few pages
 * later — by which point the ?gclid= is long gone from the URL. So we stash
 * it on first touch and read it back at submit time.
 *
 * First-touch wins: if someone arrives from an ad and later returns via a
 * Google search, the ad still gets the credit for creating the demand.
 */

const KEY = "leadbron_attribution";
const MAX_AGE_DAYS = 90; // matches Google Ads' default conversion window

export type Attribution = {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  capturedAt?: string;
};

function isFresh(a: Attribution): boolean {
  if (!a.capturedAt) return false;
  const age = Date.now() - new Date(a.capturedAt).getTime();
  return age < MAX_AGE_DAYS * 24 * 3600 * 1000;
}

/** Call once on page load. Records the click if this is a first touch. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const gclid = params.get("gclid") ?? undefined;
  const utmSource = params.get("utm_source") ?? undefined;

  // Nothing to record and we already have a live first touch — leave it.
  const existing = getAttribution();
  if (!gclid && !utmSource && isFresh(existing)) return;

  // A new paid click overwrites an older one; organic never overwrites paid.
  if (!gclid && !utmSource) {
    if (Object.keys(existing).length > 0) return;
  }

  const next: Attribution = {
    gclid,
    utmSource,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    landingPage: window.location.pathname,
    capturedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing / storage disabled — attribution is best-effort.
  }
}

/** Read the stored click for submission alongside a lead. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution;
    return isFresh(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Fire the Google Ads conversion. Safe to call when gtag is absent — the
 * site works with or without the tag installed.
 */
export function trackConversion(value?: number): void {
  if (typeof window === "undefined") return;
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (!gtag || !id || !label) return;

  gtag("event", "conversion", {
    send_to: `${id}/${label}`,
    value: value ?? 0,
    currency: "ZAR",
  });
}

"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Loads the Google tag and records paid-click attribution on every page.
 * If NEXT_PUBLIC_GOOGLE_ADS_ID isn't set the tag simply doesn't load, so
 * the site runs fine before the Ads account exists.
 */
export default function Analytics() {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  useEffect(() => {
    captureAttribution();
  }, []);

  if (!adsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${adsId}');
        `}
      </Script>
    </>
  );
}

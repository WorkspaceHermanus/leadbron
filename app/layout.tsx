import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadBron — verified leads for South African financial advisers",
  description:
    "Buy fresh, POPIA-consented insurance and financial leads. Delivered to your inbox automatically, the moment you pay.",
  metadataBase: new URL("https://leadbron.vercel.app"),
  openGraph: {
    siteName: "LeadBron",
    type: "website",
    locale: "en_ZA",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <header className="border-b border-moss/15 bg-mist">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-display text-xl font-800 tracking-tight text-ink">
              Lead<span className="text-brass">Bron</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/quote" className="text-moss hover:text-ink">Get a quote</Link>
              <Link href="/advisers" className="text-moss hover:text-ink">For advisers</Link>
              <Link href="/buy" className="btn-brass !px-4 !py-2 text-sm">Buy leads</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-20 border-t border-moss/15 bg-ink py-10 text-mist/70">
          <div className="mx-auto max-w-6xl px-5 text-sm">
            <p className="font-display text-lg text-mist">
              Lead<span className="text-brass">Bron</span>
            </p>
            <p className="mt-2 max-w-xl">
              Every lead on this platform gave explicit, timestamped consent (POPIA) to be
              contacted by an accredited financial adviser. We never resell a lead.
            </p>
            <p className="mt-4 font-mono text-xs">
              © {new Date().getFullYear()} LeadBron · South Africa ·{" "}
              <Link href="/privacy" className="underline hover:text-mist">Privacy Policy</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

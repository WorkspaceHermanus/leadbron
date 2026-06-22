import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LeadBron",
  description: "How LeadBron collects, uses, and protects your personal information under POPIA.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl font-800 text-ink">Privacy Policy</h1>
      <p className="mt-2 font-mono text-xs text-moss">Last updated: 12 June 2026</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ink/90">
        <section>
          <h2 className="font-display text-xl font-700 text-ink">1. Who we are</h2>
          <p className="mt-2">
            LeadBron ("we", "us") operates this website. In terms of the Protection of
            Personal Information Act, 4 of 2013 ("POPIA"), we are the <strong>responsible
            party</strong> for the personal information collected through this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">2. What we collect and why</h2>
          <p className="mt-2">
            When you request a quote, we collect your name, email address, phone number,
            province, and any notes you add, together with the date, time, and IP address
            of your consent. We collect this for one purpose only: to connect you with an
            accredited South African financial adviser who can provide the quote you asked for.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">3. Consent and sharing</h2>
          <p className="mt-2">
            We only share your details with an adviser after you have given explicit,
            recorded consent on the quote form. Your details are shared with{" "}
            <strong>one adviser only</strong> — we never resell a lead to multiple buyers,
            and we never add your details to marketing lists. We do not buy, scrape, or
            import contact details from any other source.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">4. Payment information</h2>
          <p className="mt-2">
            Advisers purchasing leads are redirected to PayFast, our payment processor.
            We never see or store card numbers. PayFast's own privacy policy applies to
            the payment itself.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">5. Retention and security</h2>
          <p className="mt-2">
            Your information is stored in an encrypted database hosted with our cloud
            provider. We keep lead records for as long as necessary to fulfil the purpose
            above and to maintain the consent audit trail, after which they are deleted.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">6. Your rights under POPIA</h2>
          <p className="mt-2">You may at any time:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>request a copy of the personal information we hold about you;</li>
            <li>ask us to correct it;</li>
            <li>withdraw your consent and ask us to delete your information;</li>
            <li>object to processing, or lodge a complaint with the Information
              Regulator (<span className="font-mono text-sm">inforeg.org.za</span>).</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, email us at the address below and we will
            respond within a reasonable time, and in any event within the periods POPIA
            prescribes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">7. Contact</h2>
          <p className="mt-2">
            Information Officer, LeadBron —{" "}
            <a className="text-brass underline" href="mailto:privacy@leadbron.co.za">
              privacy@leadbron.co.za
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

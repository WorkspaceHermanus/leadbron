import type { Metadata } from "next";
import { VERTICALS } from "@/lib/verticals";
import CopyButton from "./copy-button";

export const metadata: Metadata = {
  title: "Partner embed — LeadBron",
  description: "Add a lead capture form to your own website. Every submission goes into the LeadBron pool — and you can buy those leads back at standard pricing.",
};

export default function PartnerPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Partner programme</p>
      <h1 className="mt-3 font-display text-4xl font-800 leading-tight tracking-tight">
        Put a lead form on your website
      </h1>
      <p className="mt-4 max-w-2xl text-moss">
        If you have a website, blog, or Facebook page you can embed a LeadBron form in one line.
        Every person who fills it in is captured in our system with full POPIA consent.
        As a buyer, you get first pick of leads in your vertical.
      </p>

      <div className="mt-12 space-y-10">
        {VERTICALS.map((v) => {
          const code = `<iframe src="https://leadbron.vercel.app/embed/${v.slug}" width="100%" height="520" frameborder="0" style="border:none;border-radius:8px;"></iframe>`;
          return (
            <div key={v.slug} className="rounded-lg border border-moss/20 bg-white p-6">
              <p className="font-display text-lg font-700">{v.name}</p>
              <p className="mt-1 text-sm text-moss">
                Embeds a lead capture form for {v.name.toLowerCase()} on any page.
              </p>
              <div className="mt-4 flex items-start gap-3">
                <pre className="flex-1 overflow-x-auto rounded-md bg-ink p-4 font-mono text-xs text-mist/80 leading-relaxed">
                  {code}
                </pre>
                <CopyButton text={code} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-lg border border-brass/40 bg-white p-6">
        <p className="font-display text-lg font-700">How it works</p>
        <ol className="mt-4 space-y-3 text-sm text-moss">
          <li><span className="font-semibold text-ink">1.</span> Copy the embed code for your insurance category.</li>
          <li><span className="font-semibold text-ink">2.</span> Paste it into your website&apos;s HTML wherever you want the form to appear.</li>
          <li><span className="font-semibold text-ink">3.</span> Your visitors fill it in — their details land in the LeadBron system instantly.</li>
          <li><span className="font-semibold text-ink">4.</span> Head to <a href="/buy" className="text-brassdeep underline hover:text-brass">/buy</a> to purchase those leads at standard pricing.</li>
        </ol>
      </div>
    </main>
  );
}

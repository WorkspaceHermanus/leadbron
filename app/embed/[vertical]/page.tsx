import { notFound } from "next/navigation";
import { getVertical, VERTICALS, PROVINCES } from "@/lib/verticals";
import EmbedForm from "./embed-form";

export const metadata = { robots: "noindex" };

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export default function EmbedPage({ params }: { params: { vertical: string } }) {
  const v = getVertical(params.vertical);
  if (!v) notFound();

  return (
    <>
      <style>{`
        header, footer, nav { display: none !important; }
        body { background: #fff !important; }
      `}</style>
      <div style={{ padding: "16px", fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "0 auto" }}>
        <EmbedForm vertical={v.slug} verticalName={v.name} provinces={PROVINCES} />
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#8aa89e" }}>
          Powered by{" "}
          <a href="https://leadbron.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#8aa89e" }}>
            LeadBron
          </a>
        </p>
      </div>
    </>
  );
}

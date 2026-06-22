import { prisma } from "@/lib/prisma";
import { VERTICALS, rand } from "@/lib/verticals";
import BuyForm from "./buy-form";

export const dynamic = "force-dynamic";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { vertical?: string; cancelled?: string };
}) {
  let stock: Record<string, number> = {};
  try {
    const counts = await prisma.lead.groupBy({
      by: ["vertical"],
      where: { status: "AVAILABLE" },
      _count: { _all: true },
    });
    stock = Object.fromEntries(counts.map((c) => [c.vertical, c._count._all]));
  } catch {
    // DB not provisioned yet.
  }

  const catalogue = VERTICALS.map((v) => ({
    slug: v.slug,
    name: v.name,
    price: rand(v.unitPriceCents),
    unitPriceCents: v.unitPriceCents,
    inStock: stock[v.slug] ?? 0,
  }));

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl font-800 tracking-tight">Order leads</h1>
      <p className="mt-3 text-moss">
        Pay with PayFast. Available leads are emailed to you immediately; if
        stock runs short, the balance is delivered automatically as new leads
        come in — your order keeps first claim.
      </p>
      {searchParams.cancelled && (
        <p className="mt-4 rounded-md border border-signal/40 bg-signal/10 p-3 text-sm text-signal">
          Payment was cancelled — your order wasn&apos;t charged. You can try again below.
        </p>
      )}
      <div className="mt-8">
        <BuyForm catalogue={catalogue} initialVertical={searchParams.vertical} />
      </div>
    </main>
  );
}

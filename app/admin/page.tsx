import { prisma } from "@/lib/prisma";
import { getVertical, rand } from "@/lib/verticals";

export const dynamic = "force-dynamic";

export default async function Admin({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || searchParams.token !== token) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-display text-3xl font-800">Admin</h1>
        <p className="mt-3 text-moss">
          Add <code className="font-mono">?token=YOUR_ADMIN_TOKEN</code> to the URL.
          The token is the <code className="font-mono">ADMIN_TOKEN</code> environment
          variable on Vercel.
        </p>
      </main>
    );
  }

  const [leads, orders, available] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.lead.groupBy({ by: ["vertical"], where: { status: "AVAILABLE" }, _count: { _all: true } }),
  ]);

  const revenueCents = orders
    .filter((o) => ["PAID", "PARTIAL", "FULFILLED"].includes(o.status))
    .reduce((s, o) => s + o.amountCents, 0);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-3xl font-800">Operations</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Revenue (paid orders)" value={`R${(revenueCents / 100).toFixed(2)}`} />
        <Stat label="Leads on file" value={String(leads.length >= 100 ? "100+" : leads.length)} />
        <Stat
          label="Available stock"
          value={available.map((a) => `${getVertical(a.vertical)?.name ?? a.vertical}: ${a._count._all}`).join(" · ") || "0"}
        />
      </div>

      <h2 className="mt-12 font-display text-xl font-700">Orders</h2>
      <Table
        head={["When", "Adviser", "Vertical", "Qty", "Delivered", "Amount", "Status"]}
        rows={orders.map((o) => [
          o.createdAt.toISOString().slice(0, 16).replace("T", " "),
          `${o.adviserName} <${o.adviserEmail}>`,
          getVertical(o.vertical)?.name ?? o.vertical,
          String(o.quantity),
          String(o.deliveredCount),
          rand(o.amountCents),
          o.status,
        ])}
      />

      <h2 className="mt-12 font-display text-xl font-700">Latest leads</h2>
      <Table
        head={["When", "Name", "Phone", "Vertical", "Province", "Status"]}
        rows={leads.map((l) => [
          l.createdAt.toISOString().slice(0, 16).replace("T", " "),
          `${l.firstName} ${l.lastName}`,
          l.phone,
          getVertical(l.vertical)?.name ?? l.vertical,
          l.province,
          l.status,
        ])}
      />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-moss/20 bg-white p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-moss">{label}</p>
      <p className="mt-2 font-display text-xl font-800">{value}</p>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-moss/20 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-moss/15">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-moss">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-moss" colSpan={head.length}>
                Nothing here yet.
              </td>
            </tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-moss/10 last:border-0">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

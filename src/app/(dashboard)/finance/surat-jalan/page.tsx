"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { useDistribusiList } from "@/lib/preview-store";

/** Finance · Surat Jalan view-only (#59) */
export default function FinanceSuratJalanPage() {
  const { items } = useDistribusiList();
  const rows = items.map((d) => ({
    id: `SJ-${d.id.replace("DIST-", "")}`,
    distId: d.id,
    tanggal: d.tanggal,
    tujuan: d.ke,
    status: d.status,
  }));

  return (
    <div>
      <PageHeader
        title="Surat Jalan (View Only)"
        desc="Monitoring dokumen pengiriman · tidak dapat edit dari Finance"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Surat Jalan" }]}
      />
      <DataTable
        columns={[
          { key: "id", label: "No. SJ", render: (r) => <span className="font-mono font-semibold">{String(r.id)}</span> },
          {
            key: "distId",
            label: "Distribusi",
            render: (r) => (
              <Link href={`/operasional/distribusi/${r.distId}`} className="text-brand font-mono text-[12px] hover:underline">
                {String(r.distId)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "tujuan", label: "Tujuan" },
          { key: "status", label: "Status" },
        ]}
        data={rows}
      />
    </div>
  );
}

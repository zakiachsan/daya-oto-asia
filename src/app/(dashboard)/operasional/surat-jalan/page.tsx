"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDistribusiList } from "@/lib/preview-store";

export default function SuratJalanOpsPage() {
  const { items } = useDistribusiList();
  const rows = items.map((d) => ({
    id: `SJ-${d.id.replace("DIST-", "")}`,
    distId: d.id,
    tanggal: d.tanggal,
    tujuan: d.ke,
    items: d.lines.length,
    status: d.status === "Selesai" ? "Terkirim" : "Draft",
  }));

  return (
    <div>
      <PageHeader
        title="Surat Jalan"
        desc="Dokumen pengiriman ke cabang · cabang dapat buat SJ dari ajuan/distribusi"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Surat Jalan" }]}
      />
      <DataTable
        columns={[
          {
            key: "id",
            label: "No. SJ",
            render: (r) => (
              <Link href={`/operasional/surat-jalan/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "distId", label: "Distribusi ID" },
          { key: "tanggal", label: "Tanggal" },
          { key: "tujuan", label: "Tujuan" },
          { key: "items", label: "Item" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={rows}
      />
    </div>
  );
}

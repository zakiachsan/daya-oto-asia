"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { distribusiStatus, suratJalanId } from "@/lib/distribusi-utils";
import { useDistribusiList } from "@/lib/preview-store";

export default function SuratJalanOpsPage() {
  const { items } = useDistribusiList();
  /* Surat jalan terbit hanya setelah distribusi dikirim (bukan Draft) */
  const rows = items
    .filter((d) => distribusiStatus(d) !== "Draft")
    .map((d) => ({
      id: suratJalanId(d.id),
      distId: d.id,
      tanggal: d.tanggal,
      kirim: d.waktuKirim?.slice(0, 10) ?? "-",
      tujuan: d.ke,
      items: d.lines.length,
      status: distribusiStatus(d) === "Selesai" ? "Diterima" : "Terkirim",
    }));

  return (
    <div>
      <PageHeader
        title="Surat Jalan"
        desc="Terbit otomatis saat distribusi dikirim · status mengikuti konfirmasi terima cabang"
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
          { key: "kirim", label: "Tgl. Kirim" },
          { key: "tujuan", label: "Tujuan" },
          { key: "items", label: "Item" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={rows}
      />
    </div>
  );
}

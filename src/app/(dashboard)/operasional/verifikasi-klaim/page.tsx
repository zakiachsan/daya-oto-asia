"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useKlaimWarna } from "@/lib/preview-store";
import { klaimStatusBadge } from "@/lib/klaim-utils";
import type { KlaimWarnaRow } from "@/lib/mock-data";

export default function VerifikasiKlaimPage() {
  const { items } = useKlaimWarna();
  const pending = items.filter((k) => k.status === "Menunggu Verifikasi");

  return (
    <div>
      <PageHeader
        title="Verifikasi Klaim Warna"
        desc="Supervisor verifikasi klaim bengkel · klik no. klaim untuk detail & keputusan"
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Verifikasi Klaim Warna" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Menunggu Verifikasi" value={String(pending.length)} icon={Clock} color="amber" />
        <StatCard label="Valid" value={String(items.filter((k) => k.status === "Valid").length)} icon={CheckCircle2} color="green" />
        <StatCard label="Ditolak" value={String(items.filter((k) => k.status === "Ditolak").length)} icon={XCircle} color="red" />
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Klaim",
            render: (r) => (
              <Link href={`/operasional/verifikasi-klaim/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "cabang", label: "Cabang" },
          { key: "warna", label: "Warna" },
          {
            key: "status",
            label: "Status",
            render: (r) => <StatusBadge status={klaimStatusBadge((r as KlaimWarnaRow).status)} />,
          },
          {
            key: "aksi",
            label: "",
            render: (r) => {
              const klaim = r as KlaimWarnaRow;
              if (klaim.status !== "Menunggu Verifikasi") {
                return (
                  <span className="text-[11px] text-slds-text-weak max-w-[160px] block truncate" title={klaim.catatan}>
                    {klaim.catatan ?? "-"}
                  </span>
                );
              }
              return (
                <Link
                  href={`/operasional/verifikasi-klaim/${klaim.id}`}
                  className="px-2 py-1 bg-brand/10 text-brand rounded-md text-[11px] font-semibold hover:bg-brand/20"
                >
                  Verifikasi →
                </Link>
              );
            },
          },
        ]}
        data={items}
      />
    </div>
  );
}

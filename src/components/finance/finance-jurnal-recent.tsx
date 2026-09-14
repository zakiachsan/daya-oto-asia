"use client";

import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { jurnalSlug, JURNAL_SOURCE_LABELS } from "@/lib/jurnal-utils";
import { useJurnalList } from "@/lib/preview-store";

export function FinanceJurnalRecent() {
  const { all } = useJurnalList();
  const recent = all.slice(0, 8);

  return (
    <DataTable
      columns={[
        {
          key: "id",
          label: "No. Jurnal",
          render: (r) => (
            <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(String(r.id))}`} className="font-mono text-[12px] text-brand hover:underline">
              {String(r.id)}
            </Link>
          ),
        },
        { key: "tanggal", label: "Tanggal" },
        {
          key: "sourceType",
          label: "Sumber",
          render: (r) => (r.sourceType ? JURNAL_SOURCE_LABELS[r.sourceType] : "—"),
        },
        { key: "keterangan", label: "Keterangan" },
        { key: "debit", label: "Debit", render: (r) => formatIDR(Number(r.debit)), className: "text-right" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
      ]}
      data={recent}
      emptyMessage="Belum ada jurnal"
    />
  );
}

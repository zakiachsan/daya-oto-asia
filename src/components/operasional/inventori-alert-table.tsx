"use client";

import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatStokBreakdown, type InventoriStokRow } from "@/lib/inventori-utils";
import { useInventoriStok } from "@/lib/preview-store";

export function InventoriAlertTable() {
  const { rows } = useInventoriStok();
  const alerts = rows.filter((r) => r.status !== "Aman").slice(0, 6);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-slds-text">Stok Perlu Perhatian</h2>
        <Link href="/operasional/inventori" className="text-[12px] text-brand font-semibold">Lihat semua</Link>
      </div>
      <DataTable<InventoriStokRow>
        columns={[
          { key: "produk", label: "Produk" },
          { key: "cabang", label: "Cabang" },
          {
            key: "breakdown",
            label: "Stok",
            render: (r) => formatStokBreakdown(r),
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={alerts}
      />
    </>
  );
}

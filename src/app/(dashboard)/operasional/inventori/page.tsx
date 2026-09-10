"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_STOK } from "@/lib/mock-data";

const LOKASI = ["Semua Lokasi", "Pusat", "Surabaya", "Malang", "Jember"] as const;

export default function InventoriPage() {
  const [tab, setTab] = useState<(typeof LOKASI)[number]>("Semua Lokasi");

  const data =
    tab === "Semua Lokasi"
      ? MOCK_STOK
      : MOCK_STOK.filter((s) => {
          if (tab === "Pusat") return s.cabang === "Pusat";
          if (tab === "Surabaya") return s.cabang === "Surabaya";
          if (tab === "Malang") return s.cabang === "Malang";
          if (tab === "Jember") return s.cabang === "Jember";
          return true;
        });

  return (
    <div>
      <PageHeader
        title="Inventori & Stok"
        desc="Stok bahan baku per lokasi — kaleng belum dibuka & produk gram"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Inventori" }]}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {LOKASI.map((t) => (
          <button
            type="button"
            key={t}
            data-no-toast
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors
              ${tab === t ? "bg-brand text-white" : "bg-white border border-slds-border text-slds-text hover:bg-slds-bg"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          { key: "produk", label: "Produk" },
          { key: "cabang", label: "Lokasi" },
          { key: "qty", label: "Qty", render: (r) => `${r.qty} ${r.satuan}` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={data}
      />
    </div>
  );
}

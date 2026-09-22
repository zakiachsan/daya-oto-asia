"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLemburList } from "@/lib/preview-store";

export default function LemburPage() {
  const { items } = useLemburList();
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      const isPending = r.status === "Menunggu TTD";
      if (tab === "pending" ? !isPending : isPending) return false;
      if (!q) return true;
      return r.nama.toLowerCase().includes(q) || r.lokasi.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    });
  }, [items, tab, search]);

  return (
    <div>
      <PageHeader
        title="Lembur"
        desc="Approval lembur dengan bukti foto + GPS · klik no. untuk detail"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Lembur" }]}
      />

      <div className="flex gap-1 mb-4 border-b border-slds-border">
        {(["pending", "history"] as const).map((t) => (
          <button type="button"
            key={t}
            data-no-toast onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors
              ${tab === t ? "border-brand text-brand" : "border-transparent text-slds-text-weak hover:text-slds-text"}`}
          >
            {t === "pending" ? "Menunggu Approval" : "Riwayat"}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari karyawan, lokasi..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} item</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No.",
            render: (r) => (
              <Link href={`/hris/lembur/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "nama", label: "Karyawan" },
          { key: "tanggal", label: "Tanggal" },
          { key: "jam", label: "Durasi", render: (r) => `${r.jam} jam` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

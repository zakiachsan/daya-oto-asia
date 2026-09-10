"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Package, Clock, CheckCircle2 } from "lucide-react";
import { ajuanStatusBadge, type AjuanStokDetail } from "@/lib/ajuan-stok-utils";
import { useAjuanStok } from "@/lib/preview-store";

export default function AjuanStokPage() {
  const { items } = useAjuanStok();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const pending = items.filter((r) => r.status === "Menunggu");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (statusFilter !== "Semua Status" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.tinter.toLowerCase().includes(q) ||
        r.cabang.toLowerCase().includes(q) ||
        r.produk.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Ajuan Stok"
        desc="Approval permintaan stok dari tinter — klik no. ajuan untuk detail & aksi"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Ajuan Stok" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Menunggu Approval" value={String(pending.length)} icon={Clock} color="amber" />
        <StatCard label="Disetujui Bulan Ini" value={String(items.filter((r) => r.status === "Disetujui").length)} icon={CheckCircle2} color="green" />
        <StatCard label="Total Ajuan" value={String(items.length)} icon={Package} color="blue" />
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tinter, cabang, produk..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none">
          {["Semua Status", "Menunggu", "Disetujui", "Ditolak"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Ajuan",
            render: (r) => (
              <Link href={`/operasional/ajuan-stok/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "tinter", label: "Tinter" },
          { key: "produk", label: "Produk" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={ajuanStatusBadge((r as AjuanStokDetail).status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

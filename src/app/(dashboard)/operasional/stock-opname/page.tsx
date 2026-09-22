"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Scale, AlertTriangle, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TOLERANSI_GRAM, isOpnameRowDalamToleransi } from "@/lib/stock-opname-utils";
import { useStockOpname } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function StockOpnamePage() {
  const { toast } = useToast();
  const { items, bulkUpdate } = useStockOpname();
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua Cabang");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (cabangFilter !== "Semua Cabang" && !r.cabang.includes(cabangFilter)) return false;
      if (statusFilter !== "Semua Status" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.cabang.toLowerCase().includes(q) ||
        r.tinter.toLowerCase().includes(q) ||
        r.produk.toLowerCase().includes(q)
      );
    });
  }, [items, search, cabangFilter, statusFilter]);

  function approveAll() {
    bulkUpdate((prev) =>
      prev.map((r) =>
        r.status === "Menunggu Review" && isOpnameRowDalamToleransi(r)
          ? { ...r, status: "Selesai", supervisor: "Pak Ahmad" }
          : r,
      ),
    );
    toast("Opname dalam toleransi di-approve", "success");
  }

  function flagLarge() {
    bulkUpdate((prev) =>
      prev.map((r) =>
        r.status === "Menunggu Review" && !isOpnameRowDalamToleransi(r)
          ? { ...r, status: "Perlu Review", catatan: "Selisih melebihi toleransi · investigasi tinter" }
          : r,
      ),
    );
    toast("Selisih besar di-flag untuk investigasi", "info");
  }

  const menungguReview = items.filter((r) => r.status === "Menunggu Review").length;
  const dalamToleransi = items.filter((r) => isOpnameRowDalamToleransi(r)).length;

  return (
    <div>
      <PageHeader
        title="Stock Opname"
        desc={`Supervisor rekonsiliasi timbang tinter · klik no. opname untuk detail · toleransi ±${TOLERANSI_GRAM}g`}
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Stock Opname" }]}
        actions={
          <div className="flex items-center gap-2 text-[12px] text-slds-text-weak bg-slds-bg px-3 py-2 rounded-md">
            <Scale className="h-4 w-4" />
            Toleransi: ±{TOLERANSI_GRAM} gram
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Menunggu Review" value={String(menungguReview)} sub="Baru dari tinter mobile" icon={Scale} color="blue" />
        <StatCard label="Dalam Toleransi" value={String(dalamToleransi)} sub={`Kaleng cocok · gram ±${TOLERANSI_GRAM}g`} icon={Scale} color="green" />
        <StatCard label="Perlu Review" value={String(items.filter((r) => r.status === "Perlu Review").length)} sub="Selisih / kaleng tidak cocok" icon={AlertTriangle} color="red" />
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari cabang, tinter, produk..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <select value={cabangFilter} onChange={(e) => setCabangFilter(e.target.value)} className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none">
          {["Semua Cabang", "Surabaya", "Malang", "Jember"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none">
          {["Semua Status", "Menunggu Review", "Selesai", "Perlu Review"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Opname",
            render: (r) => (
              <Link href={`/operasional/stock-opname/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "cabang", label: "Cabang" },
          { key: "produk", label: "Produk" },
          {
            key: "kaleng",
            label: "Kaleng",
            render: (r) => {
              if (r.kalengFisik == null) return <span className="text-slds-text-weak">-</span>;
              const sk = r.selisihKaleng ?? 0;
              return (
                <span className={sk === 0 ? "text-green-600 font-semibold" : "text-red-600 font-bold"}>
                  {r.kalengFisik} {sk !== 0 ? `(${sk > 0 ? "+" : ""}${sk})` : ""}
                </span>
              );
            },
          },
          {
            key: "selisih",
            label: "Selisih Gram",
            render: (r) => {
              const s = Number(r.selisih);
              const ok = isOpnameRowDalamToleransi(r);
              return (
                <span className={ok ? "text-green-600 font-semibold" : "text-red-600 font-bold"}>
                  {s > 0 ? `+${s}` : s} gr
                </span>
              );
            },
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />

      <div className="mt-4 bg-white border border-slds-border rounded-lg p-4">
        <p className="text-[13px] font-bold text-slds-text mb-2">Aksi Supervisor (Bulk)</p>
        <div className="flex gap-2">
          <button type="button" data-no-toast onClick={approveAll} className="px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold hover:bg-brand-dark">
            Approve Semua (Dalam Toleransi)
          </button>
          <button type="button" data-no-toast onClick={flagLarge} className="px-3 py-2 border border-red-300 text-red-700 rounded-md text-[12px] font-semibold hover:bg-red-50">
            Flag Selisih Besar
          </button>
        </div>
      </div>
    </div>
  );
}

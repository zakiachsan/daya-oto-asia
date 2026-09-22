"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTransaksiList } from "@/lib/preview-store";

import { TRANSAKSI_STATUS_FILTER } from "@/lib/transaksi-status-utils";

const STATUS_OPTIONS = [...TRANSAKSI_STATUS_FILTER];
const CABANG_OPTIONS = ["Semua Cabang", "Surabaya", "Malang", "Jember", "Kediri"];

export default function TransaksiPage() {
  const { all } = useTransaksiList();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua Status");
  const [cabang, setCabang] = useState("Semua Cabang");
  const [tanggal, setTanggal] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((t) => {
      if (tanggal && t.tanggal !== tanggal) return false;
      if (status !== "Semua Status" && t.status !== status) return false;
      if (cabang !== "Semua Cabang" && !t.cabang.includes(cabang)) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.cabang.toLowerCase().includes(q) ||
        t.warna.toLowerCase().includes(q) ||
        t.kodeWarna.toLowerCase().includes(q) ||
        t.tinter.toLowerCase().includes(q) ||
        t.platNomor.toLowerCase().includes(q)
      );
    });
  }, [all, search, status, cabang, tanggal]);

  return (
    <div>
      <PageHeader
        title="Transaksi"
        desc="Monitoring transaksi tinter · klik baris untuk detail lengkap"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Transaksi" }]}
      />

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. trx, cabang, warna, plat..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        />
        <select
          value={cabang}
          onChange={(e) => setCabang(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        >
          {CABANG_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {all.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Transaksi",
            render: (r) => (
              <Link href={`/operasional/transaksi/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
                {r.parentId ? <span className="ml-1 text-[10px] text-blue-600 font-normal">+bahan</span> : null}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "cabang", label: "Cabang", className: "max-w-[140px]" },
          { key: "warna", label: "Warna" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

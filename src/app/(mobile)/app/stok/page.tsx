"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, AlertTriangle, Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatStokBreakdown } from "@/lib/inventori-utils";
import { matchesOpnameSearch } from "@/lib/stock-opname-mobile-utils";
import { useInventoriStok } from "@/lib/preview-store";
import { MOBILE_CABANG } from "@/lib/mobile-app-utils";

export default function AppStokPage() {
  const { rows } = useInventoriStok();
  const cabang = "Surabaya";
  const [search, setSearch] = useState("");

  const cabangRows = useMemo(
    () => rows.filter((r) => r.cabang === cabang && matchesOpnameSearch(r, search)),
    [rows, search],
  );
  const alerts = cabangRows.filter((r) => r.status !== "Aman");

  return (
    <div className="space-y-4">
      <Link href="/app" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Beranda
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <div className="flex items-start gap-3">
          <Package className="h-8 w-8 text-brand shrink-0" />
          <div>
            <h1 className="text-base font-bold text-slds-text">Stok Cabang</h1>
            <p className="text-[12px] text-slds-text-weak mt-1">{MOBILE_CABANG} · kaleng utuh + gram terbuka</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk atau kode AXT..."
          className="w-full pl-9 pr-3 py-2.5 border border-slds-border rounded-xl text-[14px] bg-white focus:border-brand focus:outline-none"
        />
      </div>

      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-[12px] text-amber-800">{alerts.length} produk perlu perhatian (menipis/kritis/habis)</p>
        </div>
      )}

      <div className="space-y-2">
        {cabangRows.length === 0 ? (
          <p className="text-center text-[13px] text-slds-text-weak py-6">
            {search.trim() ? "Produk tidak ditemukan" : "Belum ada data stok cabang"}
          </p>
        ) : (
          cabangRows.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-3.5 border border-slds-border">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slds-text truncate">{r.produk}</p>
                  <p className="text-[10px] font-mono text-slds-text-weak mt-0.5">{r.kodeProduk}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slds-border text-[12px]">
                <div className="bg-slds-bg rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slds-text-weak uppercase font-semibold">Kaleng</p>
                  <p className="text-lg font-bold text-slds-text">{r.kalengUtuh}</p>
                </div>
                <div className="bg-brand/5 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-brand uppercase font-semibold">Gram</p>
                  <p className="text-lg font-bold text-brand">{r.gramTerbuka.toLocaleString("id-ID")}</p>
                </div>
              </div>
              <p className="text-[11px] text-slds-text-weak mt-2">{formatStokBreakdown(r)}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href="/app/buka-kaleng" className="py-3 text-center border border-brand text-brand rounded-xl font-semibold text-[13px] bg-white">
          Buka Kaleng
        </Link>
        <Link href="/app/ajukan-stok" className="py-3 text-center bg-brand text-white rounded-xl font-semibold text-[13px]">
          Ajukan Stok
        </Link>
      </div>
    </div>
  );
}

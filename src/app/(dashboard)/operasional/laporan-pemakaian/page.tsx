"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LaporanPemakaianPreview, printLaporanPemakaianPreview } from "@/components/ui/laporan-pemakaian-preview";
import {
  buildLaporanPemakaian,
  totalGramLaporan,
  uniqueCabangShort,
  uniqueTinters,
} from "@/lib/laporan-pemakaian";
import { useTransaksiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function LaporanPemakaianPage() {
  const { toast } = useToast();
  const { all } = useTransaksiList();
  const [bulan, setBulan] = useState("2026-09");
  const [cabang, setCabang] = useState("Semua Cabang");
  const [tinter, setTinter] = useState("Semua Tinter");

  const cabangOptions = useMemo(() => uniqueCabangShort(all), [all]);
  const tinterOptions = useMemo(() => uniqueTinters(all), [all]);

  const rows = useMemo(
    () => buildLaporanPemakaian(all, { bulan, cabang, tinter }),
    [all, bulan, cabang, tinter],
  );

  const bengkelLabel = cabang === "Semua Cabang" ? "Auto 2000 Surabaya" : cabang;
  const tinterLabel = tinter === "Semua Tinter" ? "Semua Tinter" : tinter;

  function handlePrint() {
    if (rows.length === 0) {
      toast("Tidak ada data untuk filter ini", "error");
      return;
    }
    printLaporanPemakaianPreview();
    toast("Laporan pemakaian dicetak", "success");
  }

  return (
    <div>
      <PageHeader
        title="Laporan Pemakaian Base"
        desc="Grid pemakaian bahan cat per gram — referensi form DOA Cabang Bogor"
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Laporan Pemakaian Base" },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Printer className="h-4 w-4" /> Cetak Laporan
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="month"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
        />
        <select
          value={cabang}
          onChange={(e) => setCabang(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        >
          {cabangOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={tinter}
          onChange={(e) => setTinter(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        >
          {tinterOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">
          {rows.length} baris · {totalGramLaporan(rows)} gr total
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-[13px] text-amber-800">
          Tidak ada transaksi dengan nota tercetak untuk filter ini. Coba ubah bulan/cabang/tinter.
        </div>
      ) : (
        <div className="max-w-4xl">
          <LaporanPemakaianPreview
            bengkel={bengkelLabel}
            tinter={tinterLabel}
            bulan={bulan}
            rows={rows}
          />
        </div>
      )}
    </div>
  );
}

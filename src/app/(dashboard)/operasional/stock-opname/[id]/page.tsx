"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Scale, Check, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TOLERANSI_GRAM, isOpnameRowDalamToleransi } from "@/lib/stock-opname-utils";
import { usePenyesuaianStok, useStockOpname } from "@/lib/preview-store";
import { penyesuaianForOpname } from "@/lib/ops-finance-bridge";
import { penyesuaianSlug } from "@/lib/penyesuaian-stok-utils";
import { useToast } from "@/components/ui/toast";
import { formatWaktu } from "@/lib/mock-data";

export default function StockOpnameDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, updateStatus } = useStockOpname();
  const { items: penyesuaian } = usePenyesuaianStok();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Stock opname tidak ditemukan</p>
        <Link href="/operasional/stock-opname" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const ok = isOpnameRowDalamToleransi(row);
  const existingAdj = penyesuaianForOpname(row.id, penyesuaian);
  const needsAdj = row.selisih !== 0 && !existingAdj;

  function handleApprove() {
    updateStatus(row.id, "Selesai", { supervisor: "Pak Ahmad", catatan: "Disetujui supervisor · dalam toleransi" });
    toast("Opname di-approve", "success");
  }

  function handleFlag() {
    updateStatus(row.id, "Perlu Review", { catatan: "Selisih melebihi toleransi · investigasi tinter" });
    toast("Opname di-flag untuk review", "info");
  }

  return (
    <div>
      <PageHeader
        title={row.produk}
        desc={`${row.id} Â· ${row.tanggal}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Stock Opname", href: "/operasional/stock-opname" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/operasional/stock-opname" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3 flex items-center gap-2">
            <Scale className="h-4 w-4" /> Hasil Timbang
          </h3>
          {row.kalengFisik != null ? (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slds-bg rounded-lg p-3">
                <p className="text-[10px] uppercase text-slds-text-weak font-semibold mb-2">Kaleng</p>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slds-text-weak">Sistem</span>
                  <span className="font-bold">{row.kalengSistem ?? "-"}</span>
                </div>
                <div className="flex justify-between text-[13px] mt-1">
                  <span className="text-slds-text-weak">Fisik</span>
                  <span className="font-bold">{row.kalengFisik}</span>
                </div>
                <div className="flex justify-between text-[13px] mt-1 pt-1 border-t border-slds-border">
                  <span className="text-slds-text-weak">Selisih</span>
                  <span className={`font-bold ${(row.selisihKaleng ?? 0) === 0 ? "text-green-700" : "text-red-700"}`}>
                    {(row.selisihKaleng ?? 0) === 0 ? "Cocok" : `${row.selisihKaleng! > 0 ? "+" : ""}${row.selisihKaleng} kaleng`}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-[10px] uppercase text-blue-700 font-semibold mb-2">Gram terbuka</p>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slds-text-weak">Sistem</span>
                  <span className="font-bold">{row.gramSistem ?? row.sistem} gr</span>
                </div>
                <div className="flex justify-between text-[13px] mt-1">
                  <span className="text-slds-text-weak">Fisik</span>
                  <span className="font-bold">{row.gramFisik ?? row.fisik} gr</span>
                </div>
                <div className="flex justify-between text-[13px] mt-1 pt-1 border-t border-blue-200">
                  <span className="text-slds-text-weak">Selisih</span>
                  <span className={`font-bold ${Math.abs(row.selisih) <= TOLERANSI_GRAM ? "text-green-700" : "text-red-700"}`}>
                    {row.selisih > 0 ? `+${row.selisih}` : row.selisih} gr
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slds-bg rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase text-slds-text-weak font-semibold">Stok Sistem</p>
                <p className="text-2xl font-bold text-slds-text mt-1">{row.sistem} gr</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase text-blue-700 font-semibold">Timbang Fisik</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{row.fisik} gr</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${ok ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-[10px] uppercase font-semibold ${ok ? "text-green-700" : "text-red-700"}`}>Selisih</p>
                <p className={`text-2xl font-bold mt-1 ${ok ? "text-green-900" : "text-red-900"}`}>
                  {row.selisih > 0 ? `+${row.selisih}` : row.selisih} gr
                </p>
              </div>
            </div>
          )}
          <p className={`text-[12px] font-semibold ${ok ? "text-green-700" : "text-red-700"}`}>
            {ok
              ? `✓ Dalam toleransi · kaleng cocok · gram ±${TOLERANSI_GRAM}g`
              : `✗ Melebihi toleransi · cek kaleng & gram`}
          </p>
          {row.batchId && (
            <p className="text-[11px] text-slds-text-weak mt-2 font-mono">Batch: {row.batchId}</p>
          )}
        </div>

        <div className="bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Info Opname</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span className="font-semibold">{row.cabang}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tinter</span><span>{row.tinter}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Waktu Timbang</span><span>{row.waktuTimbang ? formatWaktu(row.waktuTimbang) : "â"}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Supervisor</span><span>{row.supervisor ?? "â"}</span></div>
          {row.catatan && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan</p>
              <p className="text-[12px]">{row.catatan}</p>
            </div>
          )}
        </div>
      </div>

      {row.status === "Menunggu Review" && (
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[13px] font-bold text-slds-text mb-2">Aksi Supervisor (Pak Ahmad)</p>
          <p className="text-[12px] text-slds-text-weak mb-3">Dikirim dari mobile tinter · approve jika kaleng & gram dalam toleransi.</p>
          <div className="flex gap-2 flex-wrap">
            {ok && (
              <button type="button" data-no-toast onClick={handleApprove} className="inline-flex items-center gap-1 px-4 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
                <Check className="h-3.5 w-3.5" /> Approve Opname
              </button>
            )}
            {!ok && (
              <button type="button" data-no-toast onClick={handleFlag} className="inline-flex items-center gap-1 px-4 py-2 border border-red-300 text-red-700 rounded-md text-[12px] font-semibold hover:bg-red-50">
                <AlertTriangle className="h-3.5 w-3.5" /> Flag Investigasi
              </button>
            )}
          </div>
        </div>
      )}

      {(row.status === "Selesai" || row.status === "Perlu Review") && needsAdj && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-[13px] font-bold text-amber-900 mb-1">Selisih perlu penyesuaian persediaan</p>
          <p className="text-[12px] text-amber-800 mb-3">
            Selisih {row.selisih}gr terdeteksi · buat penyesuaian di Finance untuk koreksi stok & jurnal.
          </p>
          <Link
            href={`/finance/persediaan/penyesuaian-persediaan?opname=${encodeURIComponent(row.id)}`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-brand text-white rounded-md text-[12px] font-semibold hover:bg-brand-dark"
          >
            Buat Penyesuaian Persediaan
          </Link>
        </div>
      )}

      {existingAdj && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-[13px] font-bold text-green-900 mb-1">Penyesuaian sudah dibuat</p>
          <Link
            href={`/finance/persediaan/penyesuaian-persediaan/${penyesuaianSlug(existingAdj.id)}`}
            className="font-mono text-[12px] font-semibold text-brand hover:underline"
          >
            {existingAdj.id} · {existingAdj.status}
          </Link>
        </div>
      )}
    </div>
  );
}

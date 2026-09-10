"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ajuanStatusBadge } from "@/lib/ajuan-stok-utils";
import { useAjuanStok } from "@/lib/preview-store";

export default function MobileAjuanDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { items } = useAjuanStok();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-4 text-center">
        <p className="text-slds-text-weak text-[13px]">Ajuan tidak ditemukan</p>
        <Link href="/app/ajukan-stok" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const badge = ajuanStatusBadge(row.status);

  return (
    <div className="space-y-4">
      <Link href="/app/ajukan-stok" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[12px] text-slds-text-weak">{row.id}</p>
            <p className="text-[15px] font-bold text-slds-text">{row.produk}</p>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
            ${badge === "Selesai" ? "bg-green-100 text-green-700" : badge === "Menunggu TTD" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
            {badge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div><span className="text-slds-text-weak block">Qty</span><span className="font-semibold">{row.qty} kaleng</span></div>
          <div><span className="text-slds-text-weak block">Tanggal</span><span>{row.tanggal}</span></div>
          <div><span className="text-slds-text-weak block">Cabang</span><span>{row.cabang}</span></div>
          <div><span className="text-slds-text-weak block">Stok saat ini</span><span className="text-red-600 font-semibold">{row.stokSaatIni}</span></div>
        </div>

        <div>
          <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Alasan</p>
          <p className="text-[13px]">{row.alasan}</p>
        </div>

        {row.catatanApprover && (
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan pusat</p>
            <p className="text-[13px]">{row.catatanApprover}</p>
          </div>
        )}

        {row.refPo && (
          <p className="text-[12px] text-green-700 font-semibold">PO dibuat: {row.refPo}</p>
        )}
      </div>
    </div>
  );
}

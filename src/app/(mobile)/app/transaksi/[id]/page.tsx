"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, PenLine, Clock, Plus, Palette } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR, formatWaktu, formatDurasi } from "@/lib/mock-data";
import { NotaPenjualanPreview, printNotaPenjualanPreview } from "@/components/ui/nota-penjualan-preview";
import { useToast } from "@/components/ui/toast";
import { useNotaPrint, useTransaksiList } from "@/lib/preview-store";
import { CetakNotaAudit } from "@/components/ui/cetak-nota-audit";
import { useState } from "react";

export default function TransaksiDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { all } = useTransaksiList();
  const { recordPrint, byTrxId } = useNotaPrint();
  const trx = all.find((t) => t.id === id);
  const auditLogs = byTrxId(id);

  const [printed, setPrinted] = useState(trx?.status === "Selesai" || !!trx?.waktuCetakNota);
  const [signed, setSigned] = useState(trx?.status === "Selesai" || !!trx?.waktuTTD);
  const [showNota, setShowNota] = useState(!!trx?.waktuCetakNota);

  if (!trx) {
    return (
      <div className="text-center py-8">
        <p className="text-slds-text-weak text-[13px]">Transaksi tidak ditemukan</p>
        <Link href="/app/transaksi" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const canTambahBahan = trx.status === "Menunggu TTD" || trx.status === "Draft";

  return (
    <div className="space-y-4">
      <Link href="/app/transaksi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
        <div className="px-4 py-3 bg-brand text-white flex justify-between items-start">
          <div>
            <p className="text-[11px] opacity-80">{trx.id}</p>
            <p className="text-base font-bold">{trx.warna}</p>
          </div>
          <StatusBadge status={trx.status} />
        </div>
        <div className="p-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-slds-text-weak">Mobil</span><span>{trx.mobil}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{trx.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Durasi Mixing</span><span className="font-bold text-brand">{formatDurasi(trx.durasiMixingMenit)}</span></div>
          <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
            <span>Total</span><span className="text-brand">{formatIDR(trx.total)}</span>
          </div>
        </div>
      </div>

      {canTambahBahan && (
        <Link
          href={`/app/transaksi/baru?parent=${encodeURIComponent(trx.id)}&mobil=${encodeURIComponent(trx.mobil)}&warna=${encodeURIComponent(trx.warna)}`}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-brand text-brand rounded-xl font-semibold text-[14px]"
        >
          <Plus className="h-4 w-4" /> Tambah Bahan (Mobil Sama)
        </Link>
      )}

      <Link
        href={`/app/klaim-warna?kode=${encodeURIComponent(trx.kodeWarna)}&plat=${encodeURIComponent(trx.platNomor)}`}
        className="flex items-center justify-center gap-2 w-full py-3 border border-slds-border text-slds-text rounded-xl font-semibold text-[14px] bg-white"
      >
        <Palette className="h-4 w-4 text-brand" /> Ajukan Klaim Warna
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] font-bold text-slds-text mb-2">Bahan Digunakan</p>
        {trx.bahan.map((b) => (
          <div key={b.kode} className="flex justify-between py-1.5 text-[13px] border-b border-slds-border last:border-0">
            <span>{b.kode}</span>
            <span className="font-semibold">{b.gram} gr</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 border border-slds-border text-[12px] space-y-1.5">
        <p className="font-bold text-slds-text mb-2 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Timeline</p>
        <div className="flex justify-between"><span className="text-slds-text-weak">Mulai</span><span>{formatWaktu(trx.waktuMulai)}</span></div>
        <div className="flex justify-between"><span className="text-slds-text-weak">Selesai Mixing</span><span>{formatWaktu(trx.waktuSelesaiMixing)}</span></div>
        <div className="flex justify-between"><span className="text-slds-text-weak">Cetak Nota</span><span>{formatWaktu(trx.waktuCetakNota)}</span></div>
        <div className="flex justify-between"><span className="text-slds-text-weak">TTD DocuMatrix</span><span>{formatWaktu(trx.waktuTTD)}</span></div>
      </div>

      {(showNota || trx.waktuCetakNota || trx.status === "Menunggu TTD") && (
        <div className="overflow-x-auto">
          <p className="text-[12px] font-bold text-slds-text mb-2">Nota Penjualan</p>
          <NotaPenjualanPreview trx={trx} className="min-w-[320px] shadow-sm" />
        </div>
      )}

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] font-bold text-slds-text mb-2">Audit Cetak Nota</p>
        <CetakNotaAudit logs={auditLogs} />
      </div>

      {trx.status === "Menunggu TTD" && (
        <div className="space-y-2">
          <button
            type="button"
            data-no-toast
            onClick={() => {
              const isReprint = recordPrint(trx.id, trx.tinter, trx.cabang);
              setPrinted(true);
              setShowNota(true);
              printNotaPenjualanPreview();
              toast(isReprint ? "Cetak ulang tercatat di audit log" : "Nota penjualan berhasil dicetak", isReprint ? "error" : "success");
            }}
            className="w-full py-3.5 bg-slds-text text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" /> {printed ? "Cetak Ulang Nota" : "Cetak Nota Penjualan"}
          </button>
          <button type="button" data-no-toast onClick={() => { setSigned(true); toast("Tanda tangan DocuMatrix berhasil", "success"); }} disabled={!printed || signed} className="w-full py-3 border-2 border-brand text-brand rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-50">
            <PenLine className="h-4 w-4" /> {signed ? "Sudah Ditandatangani" : "DocuMatrix — TTD Kepala Bengkel"}
          </button>
        </div>
      )}
    </div>
  );
}

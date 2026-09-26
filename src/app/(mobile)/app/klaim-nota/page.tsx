"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, FileX, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useKlaimNota, useTransaksiList } from "@/lib/preview-store";
import { klaimNotaStatusBadge } from "@/lib/klaim-nota-utils";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";

export default function KlaimNotaPage() {
  const { toast } = useToast();
  const { items, add } = useKlaimNota();
  const { all, update } = useTransaksiList();
  const [showForm, setShowForm] = useState(false);
  const [platNomor, setPlatNomor] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [alasan, setAlasan] = useState("");

  const cabangItems = items.filter((k) => k.cabang === MOBILE_CABANG);

  function handleSubmit() {
    if (!platNomor.trim() || !receiptId.trim()) {
      toast("No. polisi dan Receipt ID wajib diisi", "error");
      return;
    }
    if (!alasan.trim()) {
      toast("Alasan pembatalan wajib diisi", "error");
      return;
    }
    const trx = all.find((t) => t.id === receiptId.trim() || t.receiptId === receiptId.trim());
    const id = `KN-${Date.now().toString().slice(-6)}`;
    add({
      id,
      tanggal,
      cabang: MOBILE_CABANG,
      platNomor: platNomor.trim().toUpperCase(),
      receiptId: receiptId.trim(),
      trxId: trx?.id ?? receiptId.trim(),
      alasan: alasan.trim(),
      diajukanOleh: MOBILE_USER,
      status: "Menunggu Verifikasi",
    });
    if (trx) {
      update(trx.id, { status: "Dibatalkan" });
    }
    setShowForm(false);
    setPlatNomor("");
    setReceiptId("");
    setAlasan("");
    toast("Klaim nota terkirim · stok akan dikembalikan setelah disetujui", "success");
  }

  return (
    <div className="space-y-4">
      <Link href="/app" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Beranda
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <div className="flex items-start gap-3">
          <FileX className="h-8 w-8 text-red-500 shrink-0" />
          <div>
            <h1 className="text-base font-bold text-slds-text">Klaim Nota</h1>
            <p className="text-[12px] text-slds-text-weak mt-1">
              Batalkan nota yang sudah tercetak (mis. OPB tidak terbit). Stok produk dikembalikan setelah disetujui.
            </p>
          </div>
        </div>
      </div>

      {!showForm ? (
        <button type="button" data-no-toast onClick={() => setShowForm(true)} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
          Ajukan Pembatalan Nota
        </button>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Tanggal Pengajuan</span>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">No. Polisi *</span>
            <input value={platNomor} onChange={(e) => setPlatNomor(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Receipt ID *</span>
            <input value={receiptId} onChange={(e) => setReceiptId(e.target.value)} placeholder="DOA-2026-xxxx" className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] font-mono" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Alasan Pembatalan *</span>
            <textarea value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]" placeholder="OPB tidak terbit · system Astra ditutup" />
          </label>
          <div className="flex gap-2">
            <button type="button" data-no-toast onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slds-border rounded-xl font-semibold text-[13px]">Batal</button>
            <button type="button" data-no-toast onClick={handleSubmit} className="flex-1 py-2.5 bg-brand text-white rounded-xl font-bold text-[13px]">Kirim</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Riwayat Klaim Nota</p>
        {cabangItems.length === 0 ? (
          <p className="text-[13px] text-slds-text-weak text-center py-4">Belum ada klaim nota</p>
        ) : (
          cabangItems.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-3 border border-slds-border flex justify-between items-center">
              <div>
                <p className="text-[13px] font-bold">{r.receiptId}</p>
                <p className="text-[11px] text-slds-text-weak">{r.platNomor} · {r.tanggal}</p>
              </div>
              <StatusBadge status={klaimNotaStatusBadge(r.status)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useTransaksiList } from "@/lib/preview-store";
import { MOBILE_USER } from "@/lib/mobile-app-utils";

/** Tukar-Tambah Nota (#42) · nota batal digabung ke nota berjalan tanpa restore stok */
export default function TukarNotaPage() {
  const { toast } = useToast();
  const { all, update } = useTransaksiList();
  const mine = all.filter((t) => t.tinter === MOBILE_USER);
  const [batalId, setBatalId] = useState("");
  const [targetId, setTargetId] = useState("");

  const notaBatal = mine.filter((t) => t.status === "Menunggu TTD" || t.status === "Menunggu OPB");
  const notaJalan = mine.filter((t) => t.status === "Draft" || t.status === "Menunggu TTD");

  function handleGabung() {
    if (!batalId || !targetId || batalId === targetId) {
      toast("Pilih nota batal dan nota tujuan yang berbeda", "error");
      return;
    }
    update(batalId, { status: "Dibatalkan", parentId: targetId });
    toast("Nota dibatalkan digabung · stok tidak dikembalikan (tetap terjual)", "success");
    setBatalId("");
    setTargetId("");
  }

  return (
    <div className="space-y-4">
      <Link href="/app/transaksi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Transaksi
      </Link>
      <h1 className="text-lg font-bold text-slds-text flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-brand" /> Tukar-Tambah Nota
      </h1>
      <p className="text-[12px] text-slds-text-weak leading-snug">
        Pilih nota yang dibatalkan dan nota pekerjaan berjalan. Stok yang sudah keluar tidak dikembalikan; saat digabung tidak mengurangi inventory lagi.
      </p>
      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase text-slds-text-weak">Nota dibatalkan</span>
          <select value={batalId} onChange={(e) => setBatalId(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]">
            <option value="">Pilih…</option>
            {notaBatal.map((t) => (
              <option key={t.id} value={t.id}>{t.id} · {t.platNomor}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase text-slds-text-weak">Nota sedang berjalan</span>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]">
            <option value="">Pilih…</option>
            {notaJalan.map((t) => (
              <option key={t.id} value={t.id}>{t.id} · {t.warna}</option>
            ))}
          </select>
        </label>
        <button type="button" data-no-toast onClick={handleGabung} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
          Gabung Nota
        </button>
      </div>
    </div>
  );
}

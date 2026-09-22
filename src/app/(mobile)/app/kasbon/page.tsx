"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useKasbon } from "@/lib/preview-store";
import { kasbonStatusBadge } from "@/lib/kasbon-utils";
import { formatIDR } from "@/lib/mock-data";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";

export default function KasbonPage() {
  const { toast } = useToast();
  const { items, add } = useKasbon();
  const [showForm, setShowForm] = useState(false);
  const [nominal, setNominal] = useState(300000);
  const [keperluan, setKeperluan] = useState("");

  const myItems = items.filter((k) => k.nama === MOBILE_USER);

  function handleSubmit() {
    if (nominal < 50000) {
      toast("Nominal minimal Rp 50.000", "error");
      return;
    }
    if (!keperluan.trim()) {
      toast("Keperluan wajib diisi", "error");
      return;
    }
    add({
      id: `KB-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString().slice(0, 10),
      nama: MOBILE_USER,
      cabang: MOBILE_CABANG,
      nominal,
      keperluan: keperluan.trim(),
      status: "Menunggu TTD",
    });
    setShowForm(false);
    setKeperluan("");
    setNominal(300000);
    toast("Pengajuan kasbon terkirim · menunggu approval HR", "success");
  }

  return (
    <div className="space-y-4">
      <Link href="/app/profil" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Profil
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border flex gap-3">
        <Wallet className="h-8 w-8 text-brand shrink-0" />
        <div>
          <h1 className="text-base font-bold">Pengajuan Kasbon</h1>
          <p className="text-[12px] text-slds-text-weak mt-1">Ajukan kasbon operasional · approval via HRIS</p>
        </div>
      </div>

      {!showForm ? (
        <button type="button" data-no-toast onClick={() => setShowForm(true)} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Ajukan Kasbon
        </button>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Nominal (Rp) *</span>
            <input type="number" min={50000} step={50000} value={nominal} onChange={(e) => setNominal(Number(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[14px] font-bold" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Keperluan *</span>
            <textarea value={keperluan} onChange={(e) => setKeperluan(e.target.value)} rows={3} placeholder="Jelaskan kebutuhan kasbon..." className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px]" />
          </label>
          <div className="flex gap-2">
            <button type="button" data-no-toast onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slds-border rounded-xl font-semibold text-[13px]">Batal</button>
            <button type="button" data-no-toast onClick={handleSubmit} className="flex-1 py-2.5 bg-brand text-white rounded-xl font-bold text-[13px]">Kirim</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase text-slds-text-weak px-1">Riwayat Kasbon</p>
        {myItems.length === 0 ? (
          <p className="text-[13px] text-slds-text-weak text-center py-4">Belum ada pengajuan</p>
        ) : (
          myItems.map((k) => (
            <div key={k.id} className="bg-white rounded-xl p-3 border border-slds-border">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-[14px] font-bold text-brand">{formatIDR(k.nominal)}</p>
                  <p className="text-[11px] text-slds-text-weak">{k.id} · {k.tanggal}</p>
                </div>
                <StatusBadge status={kasbonStatusBadge(k.status)} />
              </div>
              <p className="text-[12px] text-slds-text mt-2">{k.keperluan}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

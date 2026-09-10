"use client";

import { useState } from "react";
import { Scale, Package } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useBukaKaleng } from "@/lib/preview-store";
import { MOCK_PRODUK } from "@/lib/mock-data";

export default function BukaKalengPage() {
  const { toast } = useToast();
  const { items, add } = useBukaKaleng();
  const [produk, setProduk] = useState(MOCK_PRODUK[0].kode);
  const [beratKosong, setBeratKosong] = useState(120);
  const [beratIsi, setBeratIsi] = useState(1120);
  const netGram = Math.max(0, beratIsi - beratKosong);

  function handleSubmit() {
    if (netGram <= 0) {
      toast("Berat isi harus lebih besar dari berat kosong", "error");
      return;
    }
    const p = MOCK_PRODUK.find((x) => x.kode === produk);
    add({
      id: `BK-${Date.now()}`,
      produk: p ? `${p.kode} — ${p.nama}` : produk,
      beratKosong,
      beratIsi,
      netGram,
      tinter: "Andi Wijaya",
      cabang: "Surabaya",
      tanggal: new Date().toISOString().slice(0, 10),
    });
    toast(`${netGram} gram masuk stok cabang`, "success");
    setBeratKosong(120);
    setBeratIsi(1120);
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-slds-text-weak">
        Buka kaleng baru — timbang kosong & isi. Netto masuk stok gram cabang.
      </p>

      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Produk (Kaleng)</label>
          <select value={produk} onChange={(e) => setProduk(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] bg-white">
            {MOCK_PRODUK.filter((p) => p.satuan === "gram").map((p) => (
              <option key={p.kode} value={p.kode}>{p.kode} — {p.nama}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Timbang Kosong (gr)</label>
            <input type="number" min={0} value={beratKosong} onChange={(e) => setBeratKosong(Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] font-bold text-right" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Timbang Isi (gr)</label>
            <input type="number" min={0} value={beratIsi} onChange={(e) => setBeratIsi(Number(e.target.value))} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] font-bold text-right" />
          </div>
        </div>
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-brand flex items-center gap-1"><Scale className="h-4 w-4" /> Netto Stok</span>
          <span className="text-xl font-bold text-brand">{netGram} gr</span>
        </div>
        <button type="button" data-no-toast onClick={handleSubmit} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
          Konfirmasi Buka Kaleng
        </button>
      </div>

      {items.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat Hari Ini</p>
          {items.slice(0, 5).map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-3 border border-slds-border mb-2 flex items-center gap-3">
              <Package className="h-5 w-5 text-brand shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold truncate">{r.produk}</p>
                <p className="text-[11px] text-slds-text-weak">{r.tanggal} · kosong {r.beratKosong}gr → isi {r.beratIsi}gr</p>
              </div>
              <span className="text-[13px] font-bold text-green-700">{r.netGram} gr</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

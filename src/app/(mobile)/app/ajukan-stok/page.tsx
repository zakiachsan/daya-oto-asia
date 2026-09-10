"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useAjuanStok } from "@/lib/preview-store";
import { ajuanStatusBadge } from "@/lib/ajuan-stok-utils";

const STOCK_ITEMS = [
  { produk: "Toner HS-30 Black", sisa: "2 kaleng", status: "Kritis" as const },
  { produk: "Clear Coat CC-100", sisa: "120 gram", status: "Menipis" as const },
];

export default function AjukanStokPage() {
  const { toast } = useToast();
  const { items, add } = useAjuanStok();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [qty, setQty] = useState(5);

  const myAjuan = items.filter((i) => i.tinter === "Andi Wijaya");
  const diajukanSet = new Set(myAjuan.map((i) => i.produk));

  function handleAjukan(produk: string, sisa: string) {
    const id = `AJ-${Date.now()}`;
    add({
      id,
      produk,
      qty,
      cabang: "Surabaya",
      tinter: "Andi Wijaya",
      tanggal: new Date().toISOString().slice(0, 10),
      status: "Menunggu",
      stokSaatIni: sisa,
      alasan: `Stok ${sisa} — permintaan restock dari mobile`,
    });
    setActiveForm(null);
    toast(`Permintaan stok ${produk} terkirim ke pusat`, "success");
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-slds-text-weak">Ajukan permintaan stok ke pusat jika bahan di cabang habis atau menipis.</p>

      {myAjuan.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase text-slds-text-weak">Ajuan Saya</p>
          {myAjuan.map((a) => {
            const badge = ajuanStatusBadge(a.status);
            return (
              <Link key={a.id} href={`/app/ajuan-stok/${a.id}`} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slds-border hover:border-brand/40">
                <div>
                  <p className="text-[13px] font-bold text-slds-text">{a.produk}</p>
                  <p className="text-[11px] text-slds-text-weak">{a.id} · {a.qty} kaleng</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                    ${badge === "Selesai" ? "bg-green-100 text-green-700" : badge === "Menunggu TTD" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {badge}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slds-text-weak" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {STOCK_ITEMS.map((item) => {
        const diajukan = diajukanSet.has(item.produk);
        return (
          <div key={item.produk} className="bg-white rounded-xl p-3.5 border border-slds-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-bold text-slds-text">{item.produk}</p>
                <p className="text-[11px] text-slds-text-weak">Sisa: {item.sisa}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                ${diajukan ? "bg-green-100 text-green-700" : item.status === "Kritis" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {diajukan ? "Diajukan" : item.status}
              </span>
            </div>

            {activeForm === item.produk ? (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Qty Diminta (kaleng)</label>
                  <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[14px]" />
                </div>
                <div className="flex gap-2">
                  <button type="button" data-no-toast onClick={() => handleAjukan(item.produk, item.sisa)} className="flex-1 py-2 bg-brand text-white rounded-lg text-[12px] font-semibold">
                    Kirim
                  </button>
                  <button type="button" data-no-toast onClick={() => setActiveForm(null)} className="flex-1 py-2 border border-slds-border rounded-lg text-[12px]">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              !diajukan && (
                <button
                  type="button"
                  data-no-toast
                  onClick={() => setActiveForm(item.produk)}
                  className="mt-3 w-full py-2 border border-brand text-brand rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-brand/5"
                >
                  <Package className="h-3.5 w-3.5" /> Ajukan
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

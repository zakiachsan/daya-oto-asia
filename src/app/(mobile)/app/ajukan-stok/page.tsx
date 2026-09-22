"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useAjuanStok, useInventoriStok } from "@/lib/preview-store";
import { ajuanStatusBadge } from "@/lib/ajuan-stok-utils";
import { formatStokBreakdown } from "@/lib/inventori-utils";
import { MOBILE_USER } from "@/lib/mobile-app-utils";

export default function AjukanStokPage() {
  const { toast } = useToast();
  const { items, add } = useAjuanStok();
  const { rows } = useInventoriStok();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [qty, setQty] = useState(5);

  const cabang = "Surabaya";
  const stockItems = useMemo(
    () =>
      rows
        .filter((r) => r.cabang === cabang)
        .map((r) => ({
          produk: r.produk,
          kode: r.kodeProduk,
          sisa: formatStokBreakdown(r),
          status: r.status === "Habis" ? ("Kritis" as const) : r.status === "Kritis" ? ("Kritis" as const) : r.status === "Menipis" ? ("Menipis" as const) : ("Aman" as const),
        })),
    [rows],
  );

  const myAjuan = items.filter((i) => i.tinter === MOBILE_USER);
  const diajukanSet = new Set(myAjuan.map((i) => i.produk));

  function handleAjukan(produk: string, sisa: string) {
    const id = `AJ-${Date.now()}`;
    add({
      id,
      produk,
      qty,
      cabang: "Surabaya",
      tinter: MOBILE_USER,
      tanggal: new Date().toISOString().slice(0, 10),
      status: "Menunggu",
      stokSaatIni: sisa,
      alasan: `Stok ${sisa}, permintaan restock dari mobile`,
    });
    setActiveForm(null);
    toast(`Permintaan stok ${produk} terkirim ke pusat`, "success");
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-slds-text-weak">
        Ajukan permintaan bahan ke pusat saat stok menipis atau kebutuhan mendadak.
      </p>

      {myAjuan.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase text-slds-text-weak">Ajuan Saya</p>
          {myAjuan.map((a) => {
            const badge = ajuanStatusBadge(a.status);
            return (
              <Link key={a.id} href={`/app/ajuan-stok/${a.id}`} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slds-border hover:border-brand/40">
                <div>
                  <p className="text-[13px] font-bold">{a.produk}</p>
                  <p className="text-[11px] text-slds-text-weak">{a.id} · {a.qty} kaleng</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge === "Disetujui" ? "bg-green-100 text-green-700" : badge === "Ditolak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {badge}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slds-text-weak" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase text-slds-text-weak">Stok Cabang Saat Ini</p>
        {stockItems.map((item) => {
          const diajukan = diajukanSet.has(item.produk);
          return (
            <div key={item.kode} className="bg-white rounded-xl p-3.5 border border-slds-border">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold">{item.produk}</p>
                  <p className="text-[11px] text-slds-text-weak">{item.sisa}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0
                ${diajukan ? "bg-green-100 text-green-700" : item.status === "Kritis" ? "bg-red-100 text-red-700" : item.status === "Menipis" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
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
    </div>
  );
}

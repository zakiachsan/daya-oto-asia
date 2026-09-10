"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const ITEMS = [
  { produk: "Toner HS-30 Black", stokSistem: 850 },
  { produk: "Toner Silver Metallic", stokSistem: 420 },
  { produk: "Clear Coat CC-100", stokSistem: 120 },
];

export default function AppStockOpnamePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
    toast("Hasil timbang dikirim ke supervisor untuk rekonsiliasi", "success");
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-[12px] font-bold text-blue-800">Stock Opname Mingguan</p>
        <p className="text-[11px] text-blue-700 mt-0.5">Timbang stok gram yang ada. Supervisor yang rekonsiliasi.</p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-[14px] font-bold text-green-800">Data sudah dikirim</p>
          <p className="text-[12px] text-green-700 mt-1">Menunggu rekonsiliasi Pak Ahmad</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {ITEMS.map((item) => (
              <div key={item.produk} className="bg-white rounded-xl p-3.5 border border-slds-border">
                <p className="text-[13px] font-bold text-slds-text">{item.produk}</p>
                <p className="text-[11px] text-slds-text-weak mb-2">Stok sistem: {item.stokSistem} gram</p>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-brand shrink-0" />
                  <input
                    type="number"
                    placeholder="Timbang (gram)"
                    className="flex-1 px-3 py-2 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-no-toast
            onClick={handleSubmit}
            className="w-full py-3.5 bg-brand text-white rounded-xl font-bold text-[14px]"
          >
            Kirim Hasil Timbang
          </button>
        </>
      )}
    </div>
  );
}

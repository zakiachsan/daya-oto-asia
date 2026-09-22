"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AXT_PRODUK, type AxtProduk } from "@/lib/axt-products";

type TonerPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Pick<AxtProduk, "kode" | "nama">) => void;
  /** Kode toner yang sudah ada di layer aktif */
  existingKodes?: string[];
  layerLabel?: string;
};

export function TonerPickerModal({
  open,
  onClose,
  onSelect,
  existingKodes = [],
  layerLabel,
}: TonerPickerModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AXT_PRODUK.filter((p) => {
      if (p.status !== "Aktif") return false;
      if (!q) return true;
      return p.kode.toLowerCase().includes(q) || p.nama.toLowerCase().includes(q);
    });
  }, [query]);

  if (!open) return null;

  function handleSelect(product: AxtProduk) {
    if (existingKodes.includes(product.kode)) return;
    onSelect({ kode: product.kode, nama: product.nama });
    setQuery("");
    onClose();
  }

  function handleClose() {
    setQuery("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={handleClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="toner-picker-title"
        className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[85vh]"
      >
        <div className="p-4 border-b border-slds-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="toner-picker-title" className="text-[15px] font-bold text-slds-text">
                Pilih Toner
              </h2>
              <p className="text-[12px] text-slds-text-weak mt-0.5">
                {layerLabel ? `Tambah ke ${layerLabel}` : "Cari berdasarkan kode atau nama produk"}
              </p>
            </div>
            <button type="button" data-no-toast onClick={handleClose} className="p-1 text-slds-text-weak" aria-label="Tutup">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Cari kode toner, mis. AXT-207"
              className="w-full pl-9 pr-3 py-2.5 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 p-2">
          {filtered.length === 0 ? (
            <p className="text-[13px] text-slds-text-weak text-center py-8">Toner tidak ditemukan</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((product) => {
                const exists = existingKodes.includes(product.kode);
                return (
                  <li key={product.kode}>
                    <button
                      type="button"
                      data-no-toast
                      disabled={exists}
                      onClick={() => handleSelect(product)}
                      className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors
                        ${exists
                          ? "border-slds-border bg-slds-bg opacity-60 cursor-not-allowed"
                          : "border-slds-border bg-white hover:border-brand/40 hover:bg-brand/5"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold font-mono text-slds-text">{product.kode}</p>
                          <p className="text-[11px] text-slds-text-weak mt-0.5 line-clamp-2">{product.nama}</p>
                        </div>
                        {exists ? (
                          <span className="text-[10px] font-bold uppercase text-slds-text-weak shrink-0">Sudah ada</span>
                        ) : (
                          <span className="text-[10px] font-semibold text-brand shrink-0">Pilih</span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="px-4 py-2.5 text-[10px] text-slds-text-weak border-t border-slds-border shrink-0">
          {filtered.length} produk · ketik kode AXT untuk filter cepat
        </p>
      </div>
    </div>
  );
}

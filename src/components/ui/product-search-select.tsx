"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { formatProdukOptionLabel, listProdukAktif } from "@/lib/inventori-utils";

type ProductSearchSelectProps = {
  value: string;
  onChange: (kode: string, nama: string) => void;
  className?: string;
  placeholder?: string;
};

function namaTanpaKode(kode: string, nama: string) {
  if (!nama.toUpperCase().startsWith(kode.toUpperCase())) return nama;
  return nama.slice(kode.length).replace(/^[\s\-·]+/, "").trim() || nama;
}

export function ProductSearchSelect({
  value,
  onChange,
  className = "",
  placeholder = "Cari kode atau nama produk...",
}: ProductSearchSelectProps) {
  const products = useMemo(() => listProdukAktif(), []);
  const selected = products.find((p) => p.kode === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 15);
    return products
      .filter((p) => p.kode.toLowerCase().includes(q) || p.nama.toLowerCase().includes(q))
      .slice(0, 15);
  }, [products, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(kode: string, nama: string) {
    onChange(kode, nama);
    setOpen(false);
    setQuery("");
  }

  const displayValue = open
    ? query
    : selected
      ? formatProdukOptionLabel(selected.kode, selected.nama)
      : value;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak pointer-events-none" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
        />
      </div>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-slds-border rounded-md shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-[12px] text-slds-text-weak">Produk tidak ditemukan</li>
          ) : (
            filtered.map((p) => (
              <li key={p.kode} role="option" aria-selected={p.kode === value}>
                <button
                  type="button"
                  data-no-toast
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(p.kode, p.nama)}
                  className={`w-full text-left px-3 py-2.5 text-[13px] hover:bg-slds-bg border-b border-slds-border last:border-0
                    ${p.kode === value ? "bg-brand/5" : ""}`}
                >
                  <span className="font-mono font-semibold text-slds-text">{p.kode}</span>
                  <span className="block text-[12px] text-slds-text-weak mt-0.5 truncate">
                    {namaTanpaKode(p.kode, p.nama)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

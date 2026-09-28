"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";
import type { TransaksiRow } from "@/lib/mock-data";

/** Field nota yang ikut dicari saat user mengetik keyword */
const DEFAULT_SEARCH_KEYS: (keyof TransaksiRow)[] = [
  "id",
  "receiptId",
  "platNomor",
  "warna",
  "kodeWarna",
  "kategori",
  "mobil",
  "status",
  "noPkb",
];

type NotaSearchSelectProps = {
  label: string;
  items: TransaksiRow[];
  value: string;
  onChange: (id: string) => void;
  /** Info singkat pendamping nomor nota, mis. plat nomor atau warna */
  detailOf: (trx: TransaksiRow) => string;
  placeholder?: string;
  /** Pesan kalau daftarnya memang kosong (bukan karena keyword) */
  emptyHint?: string;
  searchKeys?: (keyof TransaksiRow)[];
  maxVisible?: number;
};

function labelFor(t: TransaksiRow, detailOf: (trx: TransaksiRow) => string) {
  const detail = detailOf(t);
  return detail ? `${t.id} · ${detail}` : t.id;
}

/**
 * Pilih nota lewat pencarian keyword, bukan dropdown panjang.
 * Ketik keyword, rekomendasi muncul di dropdown di bawah field.
 */
export function NotaSearchSelect({
  label,
  items,
  value,
  onChange,
  detailOf,
  placeholder = "Cari nota…",
  emptyHint = "Belum ada nota",
  searchKeys = DEFAULT_SEARCH_KEYS,
  maxVisible = 20,
}: NotaSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listId = useId();

  const selected = useMemo(() => items.find((t) => t.id === value) ?? null, [items, value]);
  const selectedLabel = selected ? labelFor(selected, detailOf) : "";

  /* Teks field selalu mencerminkan nota yang sedang terpilih. */
  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  /* Klik di luar menutup dropdown. */
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    /* Text field masih sama dengan nota terpilih = user belum mengetik keyword. */
    if (!q || q === selectedLabel.toLowerCase()) return items;
    return items.filter((t) =>
      searchKeys.some((k) => String(t[k] ?? "").toLowerCase().includes(q)),
    );
  }, [items, query, selectedLabel, searchKeys]);

  const visible = filtered.slice(0, maxVisible);
  const typingKeyword = query.trim().length > 0 && query.trim().toLowerCase() !== selectedLabel.toLowerCase();

  function pick(trx: TransaksiRow) {
    onChange(trx.id);
    setQuery(labelFor(trx, detailOf));
    setOpen(false);
    setActive(0);
  }

  function clearSelection() {
    onChange("");
    setQuery("");
    setActive(0);
    setOpen(true);
    inputRef.current?.focus();
  }

  function handleInput(next: string) {
    setQuery(next);
    setOpen(true);
    setActive(0);
    /* Teks berubah = pilihan lama tidak lagi valid, jadi dilepas. */
    if (value && next !== selectedLabel) onChange("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(visible.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      if (open && visible[active]) {
        e.preventDefault();
        pick(visible[active]);
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="relative" ref={wrapRef}>
      <span className="text-[11px] font-semibold uppercase text-slds-text-weak">{label}</span>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full pl-9 pr-9 py-2.5 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
        />
        {value && (
          <button
            type="button"
            data-no-toast
            onClick={clearSelection}
            aria-label="Hapus pilihan nota"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slds-text-weak"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slds-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-slds-text-weak text-center">
              {items.length === 0 ? emptyHint : `Tidak ada nota cocok dengan "${query.trim()}"`}
            </p>
          ) : (
            <ul id={listId} role="listbox">
              {visible.map((t, i) => (
                <li key={t.id} role="option" aria-selected={t.id === value}>
                  <button
                    type="button"
                    data-no-toast
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(t)}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2 ${i === active ? "bg-brand/5" : ""}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold font-mono text-slds-text truncate">{t.id}</span>
                      <span className="block text-[11px] text-slds-text-weak mt-0.5 truncate">
                        {[detailOf(t), t.mobil, t.status].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {t.id === value && <Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="sticky bottom-0 bg-white px-3 py-2 text-[10px] text-slds-text-weak border-t border-slds-border">
            {typingKeyword && filtered.length > visible.length
              ? `${visible.length} dari ${filtered.length} nota · ketik lebih spesifik`
              : `${filtered.length} nota`}
          </p>
        </div>
      )}
    </div>
  );
}

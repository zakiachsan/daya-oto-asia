"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { KOMISI_PIHAK, type KomisiPihakManual } from "@/lib/komisi-utils";
import { fieldClass, labelClass } from "@/components/ui/action-form-panel";

/** Input rupiah · tampil bertitik ribuan saat diketik ("1500000" → "1.500.000") */
export function NominalInput({
  value,
  onChange,
  disabled,
  placeholder = "0",
}: {
  value: number;
  onChange: (nominal: number) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [teks, setTeks] = useState(value ? value.toLocaleString("id-ID") : "");

  useEffect(() => {
    setTeks(value ? value.toLocaleString("id-ID") : "");
  }, [value]);

  return (
    <input
      value={teks}
      onChange={(e) => {
        const digit = e.target.value.replace(/[^\d]/g, "");
        const angka = digit ? Number(digit) : 0;
        setTeks(angka ? angka.toLocaleString("id-ID") : "");
        onChange(angka);
      }}
      disabled={disabled}
      placeholder={placeholder}
      inputMode="numeric"
      className={`${fieldClass} text-right tabular-nums disabled:bg-slds-bg disabled:text-slds-text-weak`}
    />
  );
}

export type KomisiManualDraft = Record<KomisiPihakManual, number>;

const DRAFT_KOSONG: KomisiManualDraft = { "gh-head-vendor": 0, "tukang-cat": 0, "admin-astra": 0 };

export function KomisiManualModal({
  cabang,
  periodeLabel,
  awal,
  onClose,
  onSave,
}: {
  cabang: string;
  periodeLabel: string;
  awal: KomisiManualDraft;
  onClose: () => void;
  onSave: (draft: KomisiManualDraft) => void;
}) {
  const [draft, setDraft] = useState<KomisiManualDraft>({ ...DRAFT_KOSONG, ...awal });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-slds-border">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slds-text">Komisi Manual</p>
            <p className="text-[11px] text-slds-text-weak truncate">
              {cabang} · {periodeLabel}
            </p>
          </div>
          <button
            type="button"
            data-no-toast
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md border border-slds-border hover:bg-slds-bg"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {KOMISI_PIHAK.map((pihak) => (
            <div key={pihak.id}>
              <label className={labelClass}>{pihak.label}</label>
              <NominalInput
                value={draft[pihak.id]}
                onChange={(nominal) => setDraft((prev) => ({ ...prev, [pihak.id]: nominal }))}
              />
            </div>
          ))}
          <p className="text-[11px] text-slds-text-weak">
            Nominal berbeda tiap bengkel dan tiap bulan · isi 0 kalau tidak ada komisi bulan ini.
          </p>
        </div>

        <div className="shrink-0 flex gap-2 px-4 py-3 border-t border-slds-border">
          <button
            type="button"
            data-no-toast
            onClick={() => onSave(draft)}
            className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            Simpan
          </button>
          <button
            type="button"
            data-no-toast
            onClick={onClose}
            className="px-4 py-2 border border-slds-border rounded-md text-[13px] hover:bg-slds-bg"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { TransaksiRow } from "@/lib/mock-data";
import { buildTransaksiCatatan } from "@/lib/transaksi-catatan-utils";
import { formatIDR } from "@/lib/mock-data";

type Props = {
  trx: Pick<
    TransaksiRow,
    | "produkKategori"
    | "produkLines"
    | "kodeWarna"
    | "warna"
    | "bahan"
    | "mixingVolume"
    | "total"
    | "kategori"
    | "mobil"
    | "platNomor"
    | "id"
  >;
  /** Di wizard step 3 · tanpa header DOA */
  compact?: boolean;
};

export function TransaksiCatatanPanel({ trx, compact }: Props) {
  const items = buildTransaksiCatatan(trx);
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slds-border bg-slds-bg/50 p-4 text-[12px] text-slds-text-weak text-center">
        Belum ada bahan tercatat
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slds-border bg-white overflow-hidden">
      <div className="px-4 py-3 bg-slds-bg border-b border-slds-border">
        <p className="text-[11px] font-bold uppercase text-slds-text-weak">Catatan DOA</p>
        {!compact && (
          <p className="text-[12px] text-slds-text mt-1 leading-snug">
            {trx.mobil}
            {trx.platNomor ? ` · ${trx.platNomor}` : ""}
          </p>
        )}
        <p className="text-[10px] font-mono text-slds-text-weak mt-0.5">{trx.id}</p>
      </div>
      <div className="divide-y divide-slds-border">
        {items.map((item) => (
          <div key={`${item.urut}-${item.kodeWarna}`} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-brand uppercase">
                  Bahan {item.urut} · {item.kategoriLabel}
                </p>
                <p className="text-[13px] font-bold text-slds-text truncate">{item.nama}</p>
                <p className="text-[11px] text-slds-text-weak font-mono">{item.kodeWarna}</p>
              </div>
              {item.mixingVolume != null && (
                <span className="text-[11px] font-bold text-slds-text-weak shrink-0 tabular-nums">
                  {item.mixingVolume}g
                </span>
              )}
            </div>
            <ul className="mt-2 space-y-1">
              {item.bahan.map((b) => (
                <li key={`${item.urut}-${b.kode}`} className="flex justify-between text-[12px] gap-2">
                  <span className="text-slds-text-weak truncate">
                    <span className="font-mono font-semibold text-slds-text">{b.kode}</span>
                    {b.nama && b.nama !== b.kode ? ` · ${b.nama.replace(/^AXT-\d+\s/, "")}` : ""}
                  </span>
                  <span className="font-bold tabular-nums shrink-0">{b.gram} g</span>
                </li>
              ))}
            </ul>
            {item.total != null && item.total > 0 && (
              <p className="text-[11px] text-right font-bold text-brand mt-2">{formatIDR(item.total)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

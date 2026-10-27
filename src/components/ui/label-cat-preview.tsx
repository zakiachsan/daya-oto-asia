"use client";

import type { TransaksiRow } from "@/lib/mock-data";
import { labelDefaultForTrx, labelWaktu, type LabelLine } from "@/lib/label-cat-utils";

type LabelCatPreviewProps = {
  trx: TransaksiRow;
  /** Baris bahan yang mau dicetak · default basecoat */
  line?: LabelLine;
  className?: string;
};

/** Stiker kaleng · satu label per batch bahan (basecoat default) */
export function LabelCatPreview({ trx, line, className = "" }: LabelCatPreviewProps) {
  const bahan = line ?? labelDefaultForTrx(trx);

  return (
    <div
      id="label-cat-print"
      className={`label-cat bg-white border-2 border-dashed border-gray-400 p-3 font-sans text-black ${className}`}
      style={{ width: "280px", minHeight: "120px" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">PT Daya Oto Asia</p>
      <p className="text-[13px] font-bold mt-1">{labelWaktu(trx)}</p>
      <p className="text-[12px] font-semibold mt-1 truncate">{trx.mobil}</p>
      <p className="text-[11px] font-mono font-bold text-brand mt-0.5">
        {bahan.kodeWarna} · {bahan.warna}
      </p>
      <p className="text-[10px] text-gray-700 mt-0.5">{bahan.kategoriLabel}</p>
      <p className="text-[10px] mt-2 text-gray-600">Tinter: {trx.tinter}</p>
      <p className="text-[9px] font-mono text-gray-400 mt-1">{trx.id}</p>
    </div>
  );
}

"use client";

import type { TransaksiRow } from "@/lib/mock-data";
import { resolveReceiptIdDisplay } from "@/lib/recipe-id-utils";

type LabelCatPreviewProps = {
  trx: Pick<
    TransaksiRow,
    "tanggal" | "mobil" | "kodeWarna" | "warna" | "tinter" | "receiptId" | "id" | "waktuCetakLabel" | "waktuCetakNota"
  >;
  className?: string;
};

export function LabelCatPreview({ trx, className = "" }: LabelCatPreviewProps) {
  const stamp = trx.waktuCetakLabel ?? trx.waktuCetakNota;
  const tanggal = stamp
    ? new Date(stamp).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date(trx.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  const receipt = resolveReceiptIdDisplay(trx);

  return (
    <div
      id="label-cat-print"
      className={`label-cat bg-white border-2 border-dashed border-gray-400 p-3 font-sans text-black ${className}`}
      style={{ width: "280px", minHeight: "120px" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">PT Daya Oto Asia</p>
      <p className="text-[13px] font-bold mt-1">{tanggal}</p>
      <p className="text-[12px] font-semibold mt-1 truncate">{trx.mobil}</p>
      <p className="text-[11px] font-mono font-bold text-brand mt-0.5">
        {trx.kodeWarna} · {trx.warna}
      </p>
      <p className="text-[10px] mt-2 text-gray-600">Tinter: {trx.tinter}</p>
      <p className="text-[9px] font-mono text-gray-400 mt-1">{receipt}</p>
    </div>
  );
}

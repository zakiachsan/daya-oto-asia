"use client";

import type { TransaksiRow } from "@/lib/mock-data";
import { printElementById } from "@/lib/print-doc-utils";

type LabelCatPreviewProps = {
  trx: Pick<TransaksiRow, "tanggal" | "mobil" | "kodeWarna" | "warna" | "tinter" | "receiptId" | "id">;
  className?: string;
};

export function LabelCatPreview({ trx, className = "" }: LabelCatPreviewProps) {
  const tanggal = new Date(trx.tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const receipt = trx.receiptId ?? trx.id;

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

export function printLabelCatPreview() {
  printElementById("label-cat-print", "Label Cat · Daya Oto Asia");
}

"use client";

import type { CetakNotaLogRow } from "@/lib/preview-store";
import { formatWaktu } from "@/lib/mock-data";

export function CetakNotaAudit({ logs }: { logs: CetakNotaLogRow[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-[12px] text-slds-text-weak italic">Belum ada riwayat cetak nota.</div>
    );
  }

  return (
    <div className="space-y-1.5">
      {logs.map((l) => (
        <div
          key={l.id}
          className={`flex justify-between items-center text-[12px] py-1.5 border-b border-slds-border last:border-0 ${
            l.isReprint ? "text-red-700" : "text-slds-text"
          }`}
        >
          <div>
            <span className="font-semibold">{formatWaktu(l.waktu)}</span>
            <span className="text-slds-text-weak ml-2">{l.oleh}</span>
            {l.isReprint && (
              <span className="ml-2 text-[10px] font-bold uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                Cetak Ulang
              </span>
            )}
          </div>
          <span className="text-[10px] text-slds-text-weak font-mono">{l.id}</span>
        </div>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Plus, PenLine } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { useTransaksiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";
import { MOBILE_USER } from "@/lib/mobile-app-utils";
import { resolveReceiptIdDisplay } from "@/lib/recipe-id-utils";

export default function AppTransaksiPage() {
  const { all, update } = useTransaksiList();
  const { toast } = useToast();
  const [tanggal, setTanggal] = useState("");
  const myTrx = useMemo(
    () => all.filter((t) => t.tinter === MOBILE_USER && (!tanggal || t.tanggal === tanggal)),
    [all, tanggal],
  );

  function handleSudahTtd(e: React.MouseEvent, trxId: string, durasiMixing: number | null) {
    e.preventDefault();
    e.stopPropagation();
    const now = new Date().toISOString();
    update(trxId, {
      status: "Menunggu OPB",
      waktuTTD: now,
      durasiTotalMenit: durasiMixing != null ? durasiMixing + 3 : null,
    });
    toast("Sudah ditandatangani · Menunggu OPB", "success");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-base font-bold text-slds-text">Transaksi Saya</h2>
        <div className="flex items-center gap-2">
          <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="px-2 py-1.5 border border-slds-border rounded-lg text-[12px]" />
          <Link href="/app/transaksi/baru" className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand text-white rounded-lg text-[12px] font-semibold">
            <Plus className="h-3.5 w-3.5" /> Baru
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {myTrx.map((t) => {
          const listTitle =
            [t.mobil?.trim(), t.platNomor?.trim()].filter(Boolean).join(" · ") || t.warna;
          return (
          <div key={t.id} className="relative">
            <Link
              href={`/app/transaksi/${encodeURIComponent(t.id)}`}
              className="block bg-white rounded-xl p-3.5 border border-slds-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-slds-text leading-snug">{listTitle}</p>
                  <p className="text-[11px] text-slds-text-weak mt-0.5">
                    {t.warna} · {resolveReceiptIdDisplay(t)} · {t.tanggal}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slds-border">
                <span className="text-[11px] text-slds-text-weak">{t.durasiMixingMenit ? `${t.durasiMixingMenit} menit` : "-"}</span>
                <span className="text-[13px] font-bold text-slds-text">{formatIDR(t.total)}</span>
              </div>
            </Link>
            {t.status === "Menunggu TTD" && (
              <button
                type="button"
                data-no-toast
                onClick={(e) => handleSudahTtd(e, t.id, t.durasiMixingMenit)}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand text-white rounded-lg text-[11px] font-bold shadow-sm"
              >
                <PenLine className="h-3 w-3" /> Sudah TTD
              </button>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

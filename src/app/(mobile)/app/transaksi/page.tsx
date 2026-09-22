"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { useTransaksiList } from "@/lib/preview-store";

export default function AppTransaksiPage() {
  const { all } = useTransaksiList();
  const [tanggal, setTanggal] = useState("");
  const myTrx = useMemo(
    () => all.filter((t) => t.tinter === "Andi Wijaya" && (!tanggal || t.tanggal === tanggal)),
    [all, tanggal],
  );

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
        {myTrx.map((t) => (
          <Link
            key={t.id}
            href={t.status === "Draft" ? `/app/transaksi/baru?draft=${encodeURIComponent(t.id)}` : `/app/transaksi/${t.id}`}
            className="block bg-white rounded-xl p-3.5 border border-slds-border"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-slds-text">{t.warna}</p>
                <p className="text-[11px] text-slds-text-weak">{t.id} · {t.tanggal}</p>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slds-border">
              <span className="text-[11px] text-slds-text-weak">{t.durasiMixingMenit ? `${t.durasiMixingMenit} menit` : "-"}</span>
              <span className="text-[13px] font-bold text-slds-text">{formatIDR(t.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

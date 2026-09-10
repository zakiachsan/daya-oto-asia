"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useIzinList } from "@/lib/preview-store";

export default function MobileIzinDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { items } = useIzinList();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-4 text-center">
        <p className="text-slds-text-weak text-[13px]">Pengajuan tidak ditemukan</p>
        <Link href="/app/izin" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  return (
    <div className="space-y-4">
      <Link href="/app/izin" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[12px] text-slds-text-weak">{row.id}</p>
              <p className="text-[15px] font-bold text-slds-text">{row.tipe}</p>
            </div>
          </div>
          <StatusBadge status={row.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div><span className="text-slds-text-weak block">Mulai</span><span className="font-semibold">{row.mulai}</span></div>
          <div><span className="text-slds-text-weak block">Selesai</span><span className="font-semibold">{row.selesai}</span></div>
        </div>

        <div>
          <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Alasan</p>
          <p className="text-[13px]">{row.alasan}</p>
        </div>

        {row.catatanApprover && (
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan HR</p>
            <p className="text-[13px]">{row.catatanApprover}</p>
          </div>
        )}
      </div>
    </div>
  );
}

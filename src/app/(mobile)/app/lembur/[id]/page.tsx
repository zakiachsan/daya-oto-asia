"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Camera } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLemburList } from "@/lib/preview-store";

export default function MobileLemburDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { items } = useLemburList();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-4 text-center">
        <p className="text-slds-text-weak text-[13px]">Pengajuan tidak ditemukan</p>
        <Link href="/app/lembur" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  return (
    <div className="space-y-4">
      <Link href="/app/lembur" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[12px] text-slds-text-weak">{row.id}</p>
            <p className="text-[15px] font-bold text-slds-text">{row.tanggal}</p>
            <p className="text-[12px] text-slds-text-weak">{row.jamMulai} — {row.jamSelesai} · {row.jam} jam</p>
          </div>
          <StatusBadge status={row.status} />
        </div>

        <div className="flex items-center gap-1 text-[12px] text-green-700 bg-green-50 rounded-lg p-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {row.gps}
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <Camera className="h-4 w-4 text-slds-text-weak" />
          <span>{row.fotoBukti ? "Foto bukti tersimpan" : "Foto belum diunggah"}</span>
        </div>

        {row.catatanApprover && (
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan supervisor</p>
            <p className="text-[13px]">{row.catatanApprover}</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Palette, Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { findKlaimMatches, klaimStatusBadge } from "@/lib/klaim-utils";
import { useKlaimWarna, useTransaksiList } from "@/lib/preview-store";

export default function MobileKlaimDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { items } = useKlaimWarna();
  const { all: transaksi } = useTransaksiList();
  const row = items.find((k) => k.id === id);

  if (!row) {
    return (
      <div className="p-4 text-center">
        <p className="text-slds-text-weak text-[13px]">Klaim tidak ditemukan</p>
        <Link href="/app/klaim-warna" className="text-brand text-[13px] font-semibold mt-2 inline-block">
          Kembali
        </Link>
      </div>
    );
  }

  const matches = findKlaimMatches(row, transaksi);

  return (
    <div className="space-y-4">
      <Link href="/app/klaim-warna" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Palette className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[12px] text-slds-text-weak">{row.id}</p>
              <p className="text-[15px] font-bold text-slds-text">{row.warna}</p>
              <p className="text-[12px] text-slds-text-weak font-mono">{row.kodeWarna}</p>
            </div>
          </div>
          <StatusBadge status={klaimStatusBadge(row.status)} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <span className="text-slds-text-weak block">Tanggal</span>
            <span className="font-semibold">{row.tanggal}</span>
          </div>
          <div>
            <span className="text-slds-text-weak block">No. Polisi</span>
            <span className="font-semibold">{row.platNomor}</span>
          </div>
          <div>
            <span className="text-slds-text-weak block">Cabang</span>
            <span className="font-semibold">{row.cabang}</span>
          </div>
          <div>
            <span className="text-slds-text-weak block">Klaim Oleh</span>
            <span className="font-semibold">{row.klaimOleh}</span>
          </div>
        </div>

        {row.catatan && row.status === "Menunggu Verifikasi" && (
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan Pengaju</p>
            <p className="text-[13px]">{row.catatan}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] font-bold text-slds-text mb-2 flex items-center gap-1">
          <Search className="h-4 w-4" /> Transaksi Cocok
        </p>
        <p className="text-[11px] text-slds-text-weak mb-3">
          Mencocokkan kode <strong>{row.kodeWarna}</strong> atau plat <strong>{row.platNomor}</strong>
        </p>
        {matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((t) => (
              <Link
                key={t.id}
                href={`/app/transaksi/${t.id}`}
                className="block rounded-lg border border-slds-border p-3 hover:border-brand/40"
              >
                <p className="text-[13px] font-bold text-brand font-mono">{t.id}</p>
                <p className="text-[11px] text-slds-text-weak">
                  {t.tanggal} · {t.warna} · {t.platNomor}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800">
            Belum ditemukan transaksi cocok — supervisor akan review manual.
          </div>
        )}
      </div>

      {row.status === "Ditolak" && row.catatan && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[12px] text-red-800">
          <p className="font-bold mb-1">Alasan Penolakan</p>
          <p>{row.catatan}</p>
        </div>
      )}

      {row.status === "Valid" && row.catatan && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800">
          <p className="font-bold mb-1">Hasil Verifikasi</p>
          <p>{row.catatan}</p>
        </div>
      )}
    </div>
  );
}

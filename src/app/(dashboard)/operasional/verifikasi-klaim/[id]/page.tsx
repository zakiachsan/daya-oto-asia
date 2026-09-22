"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { findKlaimMatches, klaimStatusBadge } from "@/lib/klaim-utils";
import { useKlaimWarna, useTransaksiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function KlaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, updateStatus } = useKlaimWarna();
  const { all: transaksi } = useTransaksiList();
  const klaim = items.find((k) => k.id === id);
  const [rejectReason, setRejectReason] = useState("");

  if (!klaim) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Klaim tidak ditemukan</p>
        <Link href="/operasional/verifikasi-klaim" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = klaim;
  const matches = findKlaimMatches(row, transaksi);
  const isPending = row.status === "Menunggu Verifikasi";

  function handleVerify() {
    if (matches.length === 0) {
      toast("Tidak ada transaksi cocok · klaim perlu ditolak atau investigasi", "error");
      return;
    }
    updateStatus(row.id, "Valid", `Cocok ${matches.map((m) => m.id).join(", ")}`);
    toast(`Klaim ${row.id} valid · ditemukan ${matches.length} transaksi`, "success");
    router.push("/operasional/verifikasi-klaim");
  }

  function handleReject() {
    if (!rejectReason.trim()) {
      toast("Alasan penolakan wajib diisi", "error");
      return;
    }
    updateStatus(row.id, "Ditolak", rejectReason.trim());
    toast(`Klaim ${row.id} ditolak`, "error");
    router.push("/operasional/verifikasi-klaim");
  }

  return (
    <div>
      <PageHeader
        title={row.warna}
        desc={`${row.id} · ${row.tanggal}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Verifikasi Klaim", href: "/operasional/verifikasi-klaim" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={klaimStatusBadge(row.status)} />}
      />

      <Link href="/operasional/verifikasi-klaim" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Data Klaim</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span className="font-semibold">{row.cabang}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Kode Warna</span><span className="font-mono font-bold">{row.kodeWarna}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Nama Warna</span><span className="font-semibold">{row.warna}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">No. Polisi</span><span>{row.platNomor}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Klaim Oleh</span><span>{row.klaimOleh}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal Klaim</span><span>{row.tanggal}</span></div>
          {row.catatan && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan</p>
              <p className="text-[12px]">{row.catatan}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[13px] font-bold text-slds-text mb-2 flex items-center gap-1">
            <Search className="h-4 w-4" /> Transaksi Cocok di Cabang
          </p>
          <p className="text-[11px] text-slds-text-weak mb-3">
            Mencocokkan kode warna <strong>{row.kodeWarna}</strong> atau plat <strong>{row.platNomor}</strong> di {row.cabang}
          </p>
          {matches.length > 0 ? (
            <table className="w-full text-[13px] mb-4">
              <thead>
                <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                  <th className="pb-2 font-semibold">No. Trx</th>
                  <th className="pb-2 font-semibold">Tanggal</th>
                  <th className="pb-2 font-semibold">Warna</th>
                  <th className="pb-2 font-semibold">Plat</th>
                  <th className="pb-2 font-semibold">Tinter</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((t) => (
                  <tr key={t.id} className="border-b border-slds-border last:border-0">
                    <td className="py-2">
                      <Link href={`/operasional/transaksi/${t.id}`} className="font-mono font-semibold text-brand hover:underline">{t.id}</Link>
                    </td>
                    <td className="py-2">{t.tanggal}</td>
                    <td className="py-2">{t.warna}</td>
                    <td className="py-2">{t.platNomor}</td>
                    <td className="py-2 text-slds-text-weak">{t.tinter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[12px] text-red-800 mb-4">
              Tidak ditemukan transaksi dengan kode warna/plat yang sama di cabang ini.
            </div>
          )}

          {isPending && (
            <div className="pt-3 border-t border-slds-border space-y-3">
              <p className="text-[12px] font-bold text-slds-text">Keputusan Supervisor</p>
              <div className="flex gap-2 flex-wrap">
                <button type="button" data-no-toast onClick={handleVerify} className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-[13px] font-semibold">
                  <Check className="h-4 w-4" /> Valid · Klaim Benar
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Alasan penolakan (wajib jika tolak)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slds-border rounded-md text-[13px]"
                />
                <button type="button" data-no-toast onClick={handleReject} className="inline-flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-md text-[13px] font-semibold shrink-0">
                  <X className="h-4 w-4" /> Tolak
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

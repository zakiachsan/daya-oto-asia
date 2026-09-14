"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { hutangSlug } from "@/lib/hutang-piutang-utils";
import { fakturSlug } from "@/lib/faktur-utils";
import { nameFromSlug } from "@/lib/preview-store";
import { useHutangPiutang } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function HutangPiutangDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const pihak = nameFromSlug(slug);
  const { toast } = useToast();
  const { items, update } = useHutangPiutang();
  const found = items.find((r) => hutangSlug(r.pihak) === slug || r.pihak.toLowerCase() === pihak.toLowerCase());

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Data hutang/piutang tidak ditemukan</p>
        <Link href="/finance/laporan/hutang-piutang" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  function handleLunas() {
    update(row.id, { sisa: 0, status: "Selesai" });
    toast(`${row.pihak} ditandai lunas`, "success");
  }

  function handleBayar() {
    update(row.id, { sisa: 0, status: "Selesai" });
    toast(`Pembayaran ke ${row.pihak} tercatat`, "success");
  }

  const fakturHref = row.refFaktur
    ? row.tipe === "Piutang"
      ? `/finance/penjualan/faktur-penjualan/${fakturSlug(row.refFaktur)}`
      : `/finance/pembelian/faktur-pembelian`
    : null;

  return (
    <div>
      <PageHeader
        title={row.pihak}
        desc={`${row.tipe} · Jatuh tempo ${row.jatuhTempo}`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Hutang / Piutang", href: "/finance/laporan/hutang-piutang" },
          { label: row.pihak },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/finance/laporan/hutang-piutang" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tipe</span><span className="font-semibold">{row.tipe}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Total Tagihan</span><span>{formatIDR(row.total)}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Sisa</span><span className={`font-bold ${row.sisa > 0 ? "text-red-600" : "text-green-600"}`}>{formatIDR(row.sisa)}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Jatuh Tempo</span><span>{row.jatuhTempo}</span></div>
          {row.refFaktur && fakturHref && (
            <div className="flex justify-between pt-2 border-t border-slds-border">
              <span className="text-slds-text-weak">Ref. Faktur</span>
              <Link href={fakturHref} className="font-mono font-semibold text-brand hover:underline">{row.refFaktur}</Link>
            </div>
          )}
          {row.sisa > 0 && row.status !== "Selesai" && (
            <button
              type="button"
              data-no-toast
              onClick={row.tipe === "Piutang" ? handleLunas : handleBayar}
              className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> {row.tipe === "Piutang" ? "Tandai Lunas" : "Catat Pembayaran"}
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Riwayat Tagihan & Pembayaran</h3>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                <th className="pb-2 font-semibold">Ref</th>
                <th className="pb-2 font-semibold">Tanggal</th>
                <th className="pb-2 font-semibold">Keterangan</th>
                <th className="pb-2 font-semibold text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {row.lines.map((l) => (
                <tr key={`${l.ref}-${l.tanggal}`} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{l.ref}</td>
                  <td className="py-2 text-slds-text-weak">{l.tanggal}</td>
                  <td className="py-2">{l.keterangan}</td>
                  <td className={`py-2 text-right font-semibold ${l.jumlah < 0 ? "text-green-600" : ""}`}>
                    {l.jumlah < 0 ? formatIDR(Math.abs(l.jumlah)) : formatIDR(l.jumlah)}
                    {l.jumlah < 0 && <span className="text-[10px] ml-1">(bayar)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

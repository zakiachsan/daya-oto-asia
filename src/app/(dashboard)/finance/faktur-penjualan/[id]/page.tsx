"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { RekapInvoicePreview, printRekapInvoicePreview } from "@/components/ui/rekap-invoice-preview";
import { formatIDR } from "@/lib/mock-data";
import { findOpbForFaktur, fakturFromSlug } from "@/lib/faktur-utils";
import { useFakturJual, useOpbList, useTransaksiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function FakturPenjualanDetailPage() {
  const params = useParams();
  const id = fakturFromSlug(String(params.id));
  const { toast } = useToast();
  const { all, updateStatus } = useFakturJual();
  const { items: opbList } = useOpbList();
  const { all: transaksi } = useTransaksiList();
  const faktur = all.find((f) => f.id.toLowerCase() === id.toLowerCase());

  if (!faktur) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Faktur tidak ditemukan</p>
        <Link href="/finance/faktur-penjualan" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = faktur;
  const opb = findOpbForFaktur(row, opbList);

  function handlePost() {
    updateStatus(row.id, "Posted");
    toast(`Faktur ${row.id} di-posting`, "success");
  }

  function handlePrint() {
    printRekapInvoicePreview();
    toast("Rekap lampiran invoice dicetak", "success");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.pelanggan} · ${row.periode}`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Faktur Penjualan", href: "/finance/faktur-penjualan" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/finance/faktur-penjualan" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan Faktur</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Pelanggan</span><span className="font-semibold">{row.pelanggan}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Periode OPB</span><span>{row.periode}</span></div>
          {opb && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ref. OPB</span>
              <Link href={`/operasional/opb/${opb.id}`} className="font-mono font-semibold text-brand hover:underline">{opb.id}</Link>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
            <span>Total Tagihan</span><span className="text-brand">{formatIDR(row.total)}</span>
          </div>

          <div className="pt-3 border-t border-slds-border space-y-2">
            {row.status === "Draft" && (
              <button type="button" data-no-toast onClick={handlePost} className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
                <Send className="h-3.5 w-3.5" /> Post Faktur
              </button>
            )}
            {opb && (
              <button type="button" data-no-toast onClick={handlePrint} className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg">
                <Printer className="h-3.5 w-3.5" /> Cetak Rekap Admin
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Timeline</h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Generate dari OPB</span>
              <span className="text-green-700 font-semibold">✓</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Rekap admin dilampirkan</span>
              <span>{opb ? "✓ Siap" : "—"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slds-text-weak">Posting ke AR</span>
              <span className={row.status === "Posted" ? "text-green-700 font-semibold" : "text-amber-700"}>
                {row.status === "Posted" ? "✓ Posted" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {opb && (
        <div className="overflow-x-auto">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Lampiran — Rekap Order Pembelian Bahan</h3>
          <RekapInvoicePreview opb={opb} transaksi={transaksi} invoiceId={row.id} />
        </div>
      )}
    </div>
  );
}

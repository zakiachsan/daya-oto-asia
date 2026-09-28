"use client";

import type { OpbRow, TransaksiRow } from "@/lib/mock-data";
import { REKAP_INVOICE_PRINT_CSS, RekapOrderPembelianBahan } from "@/components/ui/rekap-invoice-preview";
import { printElementById } from "@/lib/print-doc-utils";

type OpbPreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  className?: string;
};

/**
 * Dokumen di detail OPB · pakai format resmi Tim Finance yang sama dengan lampiran
 * rekap invoice ("REKAP ORDER PEMBELIAN BAHAN", 6 kolom, kop + nama pelanggan,
 * tanpa blok field & tanpa tanda tangan). Info operasional (No. PKB, warna,
 * pemakaian) tetap ada di layar, bukan di dokumen.
 */
export function OpbPreview({ opb, transaksi, className = "" }: OpbPreviewProps) {
  return <RekapOrderPembelianBahan opb={opb} transaksi={transaksi} domId="opb-preview" className={className} />;
}

export function printOpbPreview() {
  printElementById("opb-preview", "Rekap Order Pembelian Bahan", REKAP_INVOICE_PRINT_CSS);
}

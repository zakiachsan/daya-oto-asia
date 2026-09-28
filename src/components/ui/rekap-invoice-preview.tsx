"use client";

import type { OpbRow, TransaksiRow } from "@/lib/mock-data";
import {
  astraPelangganRekap,
  buildRekapInvoiceLines,
  formatRekapRpLabel,
  rekapInvoiceTotals,
} from "@/lib/rekap-invoice-utils";
import { downloadElementById, printElementById } from "@/lib/print-doc-utils";

type RekapInvoicePreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  invoiceId?: string;
  className?: string;
};

/**
 * Rekap Order Pembelian Bahan · lampiran invoice.
 * Tata letak disalin dari contoh resmi Tim Finance (WhatsApp 28 Sep 2026):
 * kop "PT DAYA OTO ASIA" di luar kotak, judul + nama pelanggan jadi baris pertama
 * kotak tabel, 6 kolom (No. | Tanggal | No. Polisi | No. SAP | Total Harga | Total Harga + PPN),
 * baris TOTAL di kolom kedua, tanpa logo/catatan kaki/ttd.
 */
/**
 * Markup dokumen dipakai dua tempat supaya formatnya tidak pernah beda:
 * - Finance: lampiran invoice (`RekapInvoicePreview`, id `rekap-invoice-preview`)
 * - Ops: dokumen di detail OPB (`OpbPreview`, id `opb-preview`)
 */
export function RekapOrderPembelianBahan({
  opb,
  transaksi,
  domId,
  className = "",
}: {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  domId: string;
  className?: string;
}) {
  const lines = buildRekapInvoiceLines(opb, transaksi);
  const totals = rekapInvoiceTotals(lines);
  const pelanggan = astraPelangganRekap(opb.cabang);

  return (
    <div className={`rekap-invoice ${className}`} id={domId}>
      <p className="rekap-invoice-kop">PT DAYA OTO ASIA</p>

      <table className="rekap-invoice-table">
        <thead>
          <tr>
            <th colSpan={6} className="rekap-judul">
              REKAP ORDER PEMBELIAN BAHAN
            </th>
          </tr>
          <tr>
            <th colSpan={6} className="rekap-judul-pelanggan">
              {pelanggan}
            </th>
          </tr>
          <tr>
            <th className="col-no">No.</th>
            <th className="col-tgl">Tanggal</th>
            <th className="col-pol">No. Polisi</th>
            <th className="col-sap">No. SAP</th>
            <th className="col-dpp">Total Harga</th>
            <th className="col-ppn">Total Harga + PPN</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((row) => (
            <tr key={row.no}>
              <td className="center">{row.no}</td>
              <td>{row.tanggal}</td>
              <td>{row.noPolisi}</td>
              <td>{row.noSap}</td>
              <td>{formatRekapRpLabel(row.totalHarga)}</td>
              <td>{formatRekapRpLabel(row.totalPpn)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="rekap-total-row">
            <td />
            <td className="center">TOTAL</td>
            <td />
            <td />
            <td>{formatRekapRpLabel(totals.totalHarga)}</td>
            <td>{formatRekapRpLabel(totals.totalPpn)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function RekapInvoicePreview({ opb, transaksi, className = "" }: RekapInvoicePreviewProps) {
  return <RekapOrderPembelianBahan opb={opb} transaksi={transaksi} domId="rekap-invoice-preview" className={className} />;
}

export const REKAP_INVOICE_PRINT_CSS = `
  .rekap-invoice { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #000; max-width: 190mm; margin: 0 auto; }
  .rekap-invoice-kop { text-align: center; font-weight: 700; font-size: 11pt; margin: 0 0 8px; }
  .rekap-invoice-table { width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 9pt; }
  .rekap-invoice-table th, .rekap-invoice-table td { border: 1px solid #000; padding: 2px 5px; vertical-align: middle; font-weight: 400; }
  .rekap-invoice-table thead th { text-align: center; background: #fff; }
  .rekap-invoice-table .rekap-judul { font-weight: 700; font-size: 10.5pt; border-bottom: none; padding-top: 4px; }
  .rekap-invoice-table .rekap-judul-pelanggan { font-weight: 700; font-size: 9.5pt; }
  .rekap-invoice-table .col-no { width: 8%; }
  .rekap-invoice-table .col-tgl { width: 14%; }
  .rekap-invoice-table .col-pol { width: 20%; }
  .rekap-invoice-table .col-sap { width: 20%; }
  .rekap-invoice-table .col-dpp, .rekap-invoice-table .col-ppn { width: 19%; }
  .rekap-invoice-table .center { text-align: center; }
`;

export function downloadRekapInvoicePreview(invoiceId: string) {
  return downloadElementById("rekap-invoice-preview", `${invoiceId}-rekap.html`, `Rekap Invoice ${invoiceId}`, REKAP_INVOICE_PRINT_CSS);
}

export function printRekapInvoicePreview() {
  printElementById("rekap-invoice-preview", "Rekap Order Pembelian Bahan", REKAP_INVOICE_PRINT_CSS);
}

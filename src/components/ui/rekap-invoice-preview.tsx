"use client";

import type { OpbRow, TransaksiRow } from "@/lib/mock-data";
import {
  astraPelangganRekap,
  buildRekapInvoiceLines,
  formatRekapRpLabel,
  rekapInvoiceTotals,
} from "@/lib/rekap-invoice-utils";
import { printElementById } from "@/lib/print-doc-utils";

type RekapInvoicePreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  invoiceId?: string;
  className?: string;
};

function DoaLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" aria-hidden>
      <path d="M4 4h14v28H4z" fill="#5b6a9e" />
      <path d="M18 4h14v14H18z" fill="#7b5ea8" />
      <path d="M18 18h14v14H18z" fill="#4a90c4" />
    </svg>
  );
}

/**
 * Rekap admin lampiran invoice · referensi scan `rekap admin untuk lampiran invoice.pdf`.
 * Tabel: No · Tanggal · No. Polisi · No. SAP · Total Harga · Total Harga + PPN
 */
export function RekapInvoicePreview({ opb, transaksi, invoiceId, className = "" }: RekapInvoicePreviewProps) {
  const lines = buildRekapInvoiceLines(opb, transaksi);
  const totals = rekapInvoiceTotals(lines);
  const pelanggan = astraPelangganRekap(opb.cabang);

  return (
    <div className={`rekap-invoice ${className}`} id="rekap-invoice-preview">
      <div className="rekap-invoice-brand">
        <DoaLogo />
        <div>
          <p className="rekap-invoice-company">PT. DAYA OTO ASIA</p>
          <p className="rekap-invoice-pelanggan">{pelanggan}</p>
          {invoiceId && <p className="rekap-invoice-ref">Ref. Invoice: {invoiceId} · OPB {opb.id} · {opb.periode}</p>}
        </div>
      </div>

      <h1 className="rekap-invoice-title">REKAP ORDER PEMBELIAN BAHAN</h1>

      <table className="rekap-invoice-table">
        <thead>
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
            <tr key={row.no} className={row.fromTrx ? "rekap-row-real" : ""}>
              <td className="center">{row.no}</td>
              <td className="center">{row.tanggal}</td>
              <td className="center mono">{row.noPolisi}</td>
              <td className="center mono">{row.noSap}</td>
              <td className="right">{formatRekapRpLabel(row.totalHarga)}</td>
              <td className="right">{formatRekapRpLabel(row.totalPpn)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="rekap-total-row">
            <td colSpan={4} className="right">TOTAL</td>
            <td className="right">{formatRekapRpLabel(totals.totalHarga)}</td>
            <td className="right">{formatRekapRpLabel(totals.totalPpn)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="rekap-invoice-note">
        Dokumen rekap admin dilampirkan pada faktur penjualan · verifikasi finance HO sebelum posting AR.
        {opb.sap ? ` No. SAP OPB: ${opb.sap}.` : ""}
      </p>
    </div>
  );
}

const REKAP_INVOICE_PRINT_CSS = `
  .rekap-invoice { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #000; max-width: 190mm; margin: 0 auto; }
  .rekap-invoice-brand { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
  .rekap-invoice-company { font-weight: 700; font-size: 11pt; margin: 0 0 2px; }
  .rekap-invoice-pelanggan { font-weight: 600; font-size: 9pt; margin: 0; }
  .rekap-invoice-ref { font-size: 8pt; margin: 4px 0 0; color: #333; }
  .rekap-invoice-title { text-align: center; font-weight: 700; font-size: 12pt; letter-spacing: 0.04em; margin: 0 0 12px; }
  .rekap-invoice-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 8.5pt; }
  .rekap-invoice-table th, .rekap-invoice-table td { border: 1px solid #000; padding: 3px 5px; vertical-align: middle; }
  .rekap-invoice-table thead th { font-weight: 700; text-align: center; background: #fff; }
  .rekap-invoice-table .center { text-align: center; }
  .rekap-invoice-table .right { text-align: right; }
  .rekap-invoice-table .mono { font-family: "Courier New", monospace; font-size: 8pt; }
  .rekap-row-real td { background: #fffde7; }
  .rekap-total-row td { font-weight: 700; }
  .rekap-invoice-note { font-size: 7.5pt; font-style: italic; margin-top: 8px; }
`;

export function printRekapInvoicePreview() {
  printElementById("rekap-invoice-preview", "Rekap Order Pembelian Bahan", REKAP_INVOICE_PRINT_CSS);
}

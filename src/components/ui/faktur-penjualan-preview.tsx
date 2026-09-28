"use client";

import type { OpbRow, TransaksiRow } from "@/lib/mock-data";
import type { FakturJualRow } from "@/lib/faktur-utils";
import {
  INVOICE_KETERANGAN,
  INVOICE_KOP,
  formatTglInvoice,
  invoiceCustomer,
  noInvoiceDoa,
} from "@/lib/invoice-doa-utils";
import { buildRekapInvoiceLines, formatRekapRpLabel, formatRekapTanggal } from "@/lib/rekap-invoice-utils";
import { downloadElementById, printElementById } from "@/lib/print-doc-utils";

type FakturPenjualanPreviewProps = {
  faktur: FakturJualRow;
  opb?: OpbRow;
  transaksi: TransaksiRow[];
  className?: string;
};

function DoaMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 36 36" aria-hidden>
      <path d="M4 4h14v28H4z" fill="#5b6a9e" />
      <path d="M18 4h14v14H18z" fill="#7b5ea8" />
      <path d="M18 18h14v14H18z" fill="#4a90c4" />
    </svg>
  );
}

const boxCell: React.CSSProperties = { border: "1px solid #000", padding: "3px 8px" };

/**
 * Dokumen INVOICE (format cetak #1) · layout disamain dengan contoh resmi Tim Finance:
 * kop PT Daya Oto Asia + tagline/alamat/kontak → judul INVOICE → Kepada (unit Astra Daihatsu)
 * + kotak Tgl/No Invoice → tabel No. | Tanggal | Nomor Polisi | No. SAP | Harga →
 * Total / PPN 11% / Grand Total + kotak Keterangan → blok tanda tangan perusahaan & pelanggan.
 */
export function FakturPenjualanPreview({ faktur, opb, transaksi, className = "" }: FakturPenjualanPreviewProps) {
  /* Baris & No. SAP persis sama dengan lampiran Rekap Order Pembelian Bahan */
  const lines = opb ? buildRekapInvoiceLines(opb, transaksi) : [];
  const baris = lines.length
    ? lines.map((l) => ({ no: l.no, tanggal: l.tanggal, noPolisi: l.noPolisi, noSap: l.noSap, harga: l.totalHarga }))
    : [{ no: 1, tanggal: formatRekapTanggal(faktur.tanggal), noPolisi: "-", noSap: "-", harga: faktur.total }];

  const total = baris.reduce((s, b) => s + b.harga, 0);
  const ppn = Math.round(total * 0.11);
  const grandTotal = total + ppn;
  const cust = invoiceCustomer(faktur.pelanggan);

  return (
    <div className={`doc bg-white text-black ${className}`} id="faktur-penjualan-preview">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <DoaMark />
          <div>
            <p className="doc-bold" style={{ fontSize: "12pt" }}>{INVOICE_KOP.nama}</p>
            <p style={{ fontSize: "9pt" }}>{INVOICE_KOP.tagline}</p>
            <p style={{ fontSize: "8pt" }}>{INVOICE_KOP.alamat}</p>
            <p style={{ fontSize: "8pt" }}>{INVOICE_KOP.kontak}</p>
          </div>
        </div>
        <p className="doc-bold doc-upper" style={{ fontSize: "20pt", letterSpacing: "2px" }}>Invoice</p>
      </div>

      <div style={{ borderTop: "2px solid #000", margin: "10px 0 12px" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 12 }}>
        <div style={{ fontSize: "9pt" }}>
          <p className="doc-bold">Kepada:</p>
          <p>{cust.nama}</p>
          <p>{cust.unit}</p>
          {cust.alamat.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <table style={{ fontSize: "9pt", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={boxCell}>Tgl Invoice</td>
              <td style={boxCell}>: {formatTglInvoice(faktur.tanggal)}</td>
            </tr>
            <tr>
              <td style={boxCell}>No. Invoice</td>
              <td style={boxCell}>: {noInvoiceDoa(faktur)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="doc-table" style={{ fontSize: "8.5pt" }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>No.</th>
            <th style={{ width: "16%" }}>Tanggal</th>
            <th style={{ width: "20%" }}>Nomor Polisi</th>
            <th style={{ width: "24%" }}>No. SAP</th>
            <th style={{ textAlign: "right" }}>Harga</th>
          </tr>
        </thead>
        <tbody>
          {baris.map((b) => (
            <tr key={b.no}>
              <td className="doc-center">{b.no}</td>
              <td>{b.tanggal}</td>
              <td style={{ fontFamily: "monospace" }}>{b.noPolisi}</td>
              <td style={{ fontFamily: "monospace" }}>{b.noSap || "-"}</td>
              <td style={{ textAlign: "right" }}>{formatRekapRpLabel(b.harga)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginTop: 12 }}>
        <div style={{ border: "1px solid #000", padding: "8px 10px", flex: "1 1 auto" }}>
          <p className="doc-bold" style={{ fontSize: "9pt", marginBottom: 4 }}>Keterangan</p>
          {INVOICE_KETERANGAN.map((k) => (
            <p key={k} style={{ fontSize: "8pt", marginBottom: 5 }}>{k}</p>
          ))}
        </div>

        <table style={{ fontSize: "9pt", borderCollapse: "collapse", flex: "0 0 34%" }}>
          <tbody>
            <tr>
              <td style={{ padding: "2px 6px" }}>Total</td>
              <td style={{ padding: "2px 6px", textAlign: "right" }}>{formatRekapRpLabel(total)}</td>
            </tr>
            <tr>
              <td style={{ padding: "2px 6px" }}>PPN 11%</td>
              <td style={{ padding: "2px 6px", textAlign: "right" }}>{formatRekapRpLabel(ppn)}</td>
            </tr>
            <tr className="doc-bold">
              <td style={{ padding: "4px 6px", borderTop: "1px solid #000" }}>Grand Total</td>
              <td style={{ padding: "4px 6px", borderTop: "1px solid #000", textAlign: "right" }}>{formatRekapRpLabel(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontSize: "9pt" }}>
        <div style={{ width: "38%", textAlign: "center" }}>
          <p>(Tanda tangan &amp; Stempel Perusahaan)</p>
          <div className="sig-line" style={{ margin: "34px 0 4px" }} />
          <p>PT Daya Oto Asia</p>
        </div>
        <div style={{ width: "38%", textAlign: "center" }}>
          <p>(Tanda tangan pelanggan)</p>
          <div className="sig-line" style={{ margin: "34px 0 4px" }} />
          <p>{cust.tandaTangan}</p>
        </div>
      </div>
    </div>
  );
}

export function printFakturPenjualanPreview(fakturId: string) {
  printElementById("faktur-penjualan-preview", `Invoice ${fakturId}`, "table.doc-table { font-size: 7.5pt; }");
}

export function downloadFakturPenjualanPreview(fakturId: string) {
  const ok = downloadElementById(
    "faktur-penjualan-preview",
    `${fakturId}.html`,
    `Invoice ${fakturId}`,
    "table.doc-table { font-size: 7.5pt; }",
  );
  return ok;
}

"use client";

import type { TransaksiRow } from "@/lib/mock-data";
import { notaNoFromTrxId } from "@/lib/nota-bogor-tarif";
import { printElementById } from "@/lib/print-doc-utils";
import {
  SAP_OPB_MATERIAL,
  astraIssuerForCabang,
  formatSapAmount,
  formatSapQty,
  sapInternalNoFromTrx,
  sapOpbNoFromTrx,
} from "@/lib/sap-opb-utils";

type SapOpbPreviewProps = {
  trx: Pick<
    TransaksiRow,
    "id" | "tanggal" | "cabang" | "mobil" | "platNomor" | "noPkb" | "warna" | "kodeWarna" | "total"
  >;
  className?: string;
};

function UnderlineField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`sap-opb-field ${wide ? "sap-opb-field-wide" : ""}`}>
      <span className="sap-opb-field-label">{label}</span>
      <span className="sap-opb-field-colon">:</span>
      <span className="sap-opb-field-value">{value}</span>
    </div>
  );
}

function AstraLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="sap-opb-logo">
      <rect x="2" y="2" width="36" height="36" rx="2" fill="#c8102e" />
      <text x="20" y="25" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Arial">
        AI
      </text>
    </svg>
  );
}

/**
 * Form OPB SAP Astra · ONE TIME MATERIAL per transaksi/PKB.
 * Referensi: contoh OPB.pdf (Daihatsu Sales Operation → vendor PT Daya Oto Asia).
 */
export function SapOpbPreview({ trx, className = "" }: SapOpbPreviewProps) {
  const issuer = astraIssuerForCabang(trx.cabang);
  const opbNo = sapOpbNoFromTrx(trx);
  const sapNo = sapInternalNoFromTrx(trx);
  const notaNo = notaNoFromTrxId(trx.id);
  const hargaTotal = trx.total;

  return (
    <div className={`sap-opb ${className}`} id="sap-opb-preview">
      <div className="sap-opb-header">
        <div className="sap-opb-header-left">
          <div className="sap-opb-brand-row">
            <AstraLogo />
            <div>
              <p className="sap-opb-brand-name">{issuer.nama}</p>
              <p className="sap-opb-brand-unit">{issuer.unit}</p>
            </div>
          </div>
          <p className="sap-opb-alamat">{issuer.alamat}</p>
        </div>
        <div className="sap-opb-header-right">
          <div className="sap-opb-no-row">
            <span className="sap-opb-no-label">NO. OPB</span>
            <span className="sap-opb-no-value">{opbNo}</span>
          </div>
          <UnderlineField label="Tanggal" value={trx.tanggal} />
        </div>
      </div>

      <p className="sap-opb-title">ORDER PEMBELIAN BAHAN</p>
      <p className="sap-opb-subtitle">ONE TIME MATERIAL</p>

      <div className="sap-opb-vendor-block">
        <p className="sap-opb-vendor-label">Vendor / Penyedia Jasa</p>
        <p className="sap-opb-vendor-name">PT. DAYA OTO ASIA</p>
        <p className="sap-opb-vendor-alamat">Body Repair · Cat Mixing &amp; Pengecatan</p>
      </div>

      <div className="sap-opb-meta">
        <UnderlineField label="No. PKB" value={trx.noPkb ?? "-"} />
        <UnderlineField label="No. Polisi" value={trx.platNomor} />
        <UnderlineField label="Type Mobil" value={trx.mobil} wide />
        <UnderlineField label="No. SAP" value={sapNo} />
        <UnderlineField label="No. Nota" value={notaNo} />
        <UnderlineField label="Cabang / Bengkel" value={trx.cabang} wide />
        <UnderlineField label="Warna" value={`${trx.warna} (${trx.kodeWarna})`} wide />
      </div>

      <table className="sap-opb-table">
        <thead>
          <tr>
            <th className="col-no">NO</th>
            <th className="col-kode">KODE BAHAN</th>
            <th className="col-nama">NAMA BAHAN</th>
            <th className="col-qty">QTY</th>
            <th className="col-harga">HARGA SATUAN</th>
            <th className="col-total">HARGA TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="center">1</td>
            <td className="center mono">{SAP_OPB_MATERIAL.kode}</td>
            <td>{SAP_OPB_MATERIAL.nama}</td>
            <td className="center">
              {formatSapQty(1)} {SAP_OPB_MATERIAL.satuan}
            </td>
            <td className="right">{formatSapAmount(hargaTotal)}</td>
            <td className="right">{formatSapAmount(hargaTotal)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="sap-opb-total-row">
            <td colSpan={5} className="right">TOTAL</td>
            <td className="right">{formatSapAmount(hargaTotal)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="sap-opb-footer">
        <div className="sap-opb-sig-block">
          <p className="sap-opb-sig-label">Petugas Gudang</p>
          <span className="sap-opb-sig-paren">( )</span>
        </div>
        <div className="sap-opb-sig-block">
          <p className="sap-opb-sig-label">Kepala Bengkel</p>
          <span className="sap-opb-sig-paren">( )</span>
        </div>
        <div className="sap-opb-sig-block">
          <p className="sap-opb-sig-label">Kepala Administrasi</p>
          <span className="sap-opb-sig-paren">( )</span>
        </div>
      </div>
    </div>
  );
}

const SAP_OPB_PRINT_CSS = `
  .sap-opb { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; max-width: 190mm; margin: 0 auto; }
  .sap-opb-header { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .sap-opb-header-left { flex: 1.2; } .sap-opb-header-right { flex: 0.8; min-width: 180px; }
  .sap-opb-brand-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .sap-opb-brand-name { font-weight: 700; font-size: 10pt; margin: 0; }
  .sap-opb-brand-unit { font-size: 9pt; font-weight: 600; margin: 0; }
  .sap-opb-alamat { font-size: 8pt; margin: 0; line-height: 1.35; }
  .sap-opb-no-row { display: flex; align-items: baseline; justify-content: flex-end; gap: 4px; margin-bottom: 8px; font-weight: 700; }
  .sap-opb-no-value { border-bottom: 1px solid #000; min-width: 90px; text-align: center; }
  .sap-opb-title { text-align: center; font-weight: 700; font-size: 12pt; margin: 10px 0 2px; }
  .sap-opb-subtitle { text-align: center; font-weight: 700; font-size: 10pt; margin: 0 0 12px; letter-spacing: 0.06em; }
  .sap-opb-vendor-block { border: 1px solid #000; padding: 6px 10px; margin-bottom: 10px; font-size: 9pt; }
  .sap-opb-vendor-label { font-size: 8pt; font-weight: 600; margin: 0 0 2px; text-transform: uppercase; }
  .sap-opb-vendor-name { font-weight: 700; font-size: 10pt; margin: 0; }
  .sap-opb-vendor-alamat { font-size: 8.5pt; margin: 2px 0 0; }
  .sap-opb-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; margin-bottom: 10px; }
  .sap-opb-field { display: flex; align-items: baseline; margin-bottom: 4px; font-size: 9pt; }
  .sap-opb-field-wide { grid-column: 1 / -1; }
  .sap-opb-field-label { min-width: 88px; font-weight: 600; }
  .sap-opb-field-colon { width: 10px; }
  .sap-opb-field-value { flex: 1; border-bottom: 1px solid #000; min-height: 14px; }
  .sap-opb-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 9pt; margin-bottom: 24px; }
  .sap-opb-table th, .sap-opb-table td { border: 1px solid #000; padding: 3px 5px; }
  .sap-opb-table thead th { font-weight: 700; text-align: center; }
  .sap-opb-table .center { text-align: center; }
  .sap-opb-table .right { text-align: right; }
  .sap-opb-table .mono { font-family: "Courier New", monospace; font-size: 8.5pt; }
  .sap-opb-total-row td { font-weight: 700; }
  .sap-opb-footer { display: flex; justify-content: space-between; gap: 8px; font-size: 9pt; }
  .sap-opb-sig-block { flex: 1; text-align: center; }
  .sap-opb-sig-label { font-weight: 600; margin: 0; }
  .sap-opb-sig-paren { display: block; margin-top: 36px; }
`;

export function printSapOpbPreview() {
  printElementById("sap-opb-preview", "OPB SAP", SAP_OPB_PRINT_CSS);
}

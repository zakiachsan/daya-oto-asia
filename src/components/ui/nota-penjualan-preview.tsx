"use client";

import { Fragment } from "react";
import type { TransaksiRow } from "@/lib/mock-data";
import {
  NOTA_PENJUALAN_GRUP,
  formatNotaPenjualanHarga,
  formatNotaPenjualanTanggal,
  notaPenjualanNoFromTrxId,
} from "@/lib/nota-penjualan-tarif";
import {
  astraPelangganForCabang,
  buildNotaPenjualanLinesForTrx,
  notaPenjualanGrandTotal,
} from "@/lib/nota-penjualan-utils";
import { printElementById } from "@/lib/print-doc-utils";

type NotaPenjualanPreviewProps = {
  trx: Pick<
    TransaksiRow,
    | "id"
    | "tanggal"
    | "cabang"
    | "warna"
    | "mobil"
    | "platNomor"
    | "noPkb"
    | "jumlahPanel"
    | "kategori"
    | "tinter"
    | "total"
    | "bahan"
    | "produkKategori"
    | "kodeWarna"
    | "lainLainLabel"
    | "produkLines"
  >;
  className?: string;
};

function DoaLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden className="nota-logo-svg">
      <path d="M4 4h14v28H4z" fill="#5b6a9e" />
      <path d="M18 4h14v14H18z" fill="#7b5ea8" />
      <path d="M18 18h14v14H18z" fill="#4a90c4" />
    </svg>
  );
}

function UnderlineField({ label, value }: { label: string; value: string }) {
  return (
    <div className="np-field">
      <span className="np-field-label">{label}</span>
      <span className="np-field-colon">:</span>
      <span className="np-field-value">{value}</span>
    </div>
  );
}

/**
 * Nota penjualan terisi · referensi scan `nota penjualan.pdf`.
 * Berbeda dari nota pemakaian (pre-print tarif DOA Bogor hal. 1).
 */
export function NotaPenjualanPreview({ trx, className = "" }: NotaPenjualanPreviewProps) {
  const pelanggan = astraPelangganForCabang(trx.cabang);
  const notaNo = notaPenjualanNoFromTrxId(trx.id);
  const tanggal = formatNotaPenjualanTanggal(trx.tanggal);
  const filledLines = buildNotaPenjualanLinesForTrx(trx);
  const fillById = new Map(filledLines.map((l) => [l.barisId, l]));
  const grandTotal = notaPenjualanGrandTotal(filledLines);

  return (
    <div className={`nota-penjualan ${className}`} id="nota-penjualan-preview">
      <div className="np-header">
        <div className="np-header-left">
          <div className="np-brand-row">
            <DoaLogo />
            <span className="np-brand-name">PT. DAYA OTO ASIA</span>
          </div>
          <UnderlineField label="Kepada" value={pelanggan.nama} />
          <p className="np-alamat">{pelanggan.alamat}</p>
          <UnderlineField label="Lokasi" value={pelanggan.lokasi} />
          <UnderlineField label="Type Mobil" value={trx.mobil} />
          <UnderlineField label="Warna" value={trx.warna} />
        </div>

        <div className="np-header-right">
          <div className="np-no-row">
            <span className="np-no-label">NOTA NO.</span>
            <span>:</span>
            <span className="np-no-value">{notaNo}</span>
          </div>
          <UnderlineField label="Tanggal" value={tanggal} />
          <UnderlineField label="No. PKB" value={trx.noPkb ?? ""} />
          <UnderlineField label="No. Polisi" value={trx.platNomor} />
          <UnderlineField label="Jumlah Panel" value={trx.jumlahPanel != null ? String(trx.jumlahPanel) : ""} />
        </div>
      </div>

      <table className="np-table">
        <thead>
          <tr>
            <th className="col-no">NO</th>
            <th className="col-nama">NAMA BAHAN</th>
            <th className="col-ml">JUMLAH PEMAKAIAN (ml)</th>
            <th className="col-harga">HARGA</th>
            <th className="col-jumlah">JUMLAH (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {NOTA_PENJUALAN_GRUP.map((grup) => {
            const activeBaris = grup.baris.filter((b) => fillById.has(b.id));
            if (activeBaris.length === 0) return null;
            return (
              <Fragment key={grup.judul}>
                <tr className="np-grup-row">
                  <td colSpan={5}>{grup.judul}</td>
                </tr>
                {activeBaris.map((b) => {
                  const fill = fillById.get(b.id)!;
                  const label = fill.labelOverride ?? b.label;
                  return (
                    <tr key={b.id} className="np-row-active">
                      <td className="col-no center" />
                      <td className="col-nama indent">{label}</td>
                      <td className="col-ml center">{fill.pemakaianMl}</td>
                      <td className="col-harga center">{formatNotaPenjualanHarga(fill.harga)}</td>
                      <td className="col-jumlah right">{formatNotaPenjualanHarga(fill.jumlahRp)}</td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
          <tr className="np-total-row">
            <td colSpan={4} className="right">TOTAL</td>
            <td className="col-jumlah right">{formatNotaPenjualanHarga(grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div className="np-footer">
        <div className="np-sig-block">
          <span className="np-sig-label">Yang Menyerahkan,</span>
          <span className="np-sig-paren">( {trx.tinter} )</span>
        </div>
        <div className="np-sig-block">
          <span className="np-sig-label">Yang Menerima,</span>
          <span className="np-sig-paren">(                             )</span>
        </div>
      </div>
    </div>
  );
}

const NOTA_PENJUALAN_PRINT_CSS = `
  .nota-penjualan { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; max-width: 190mm; margin: 0 auto; }
  .np-header { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
  .np-header-left { flex: 1.1; } .np-header-right { flex: 0.9; min-width: 200px; }
  .np-brand-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .np-brand-name { font-weight: 700; font-size: 12pt; }
  .np-alamat { font-size: 8.5pt; margin: 2px 0 8px; line-height: 1.35; }
  .np-field { display: flex; align-items: baseline; margin-bottom: 4px; font-size: 10pt; }
  .np-field-label { min-width: 88px; } .np-field-colon { width: 10px; }
  .np-field-value { flex: 1; border-bottom: 1px solid #000; min-height: 14px; }
  .np-no-row { display: flex; align-items: baseline; justify-content: flex-end; gap: 4px; margin-bottom: 8px; font-weight: 700; font-size: 11pt; }
  .np-no-value { border-bottom: 1px solid #000; min-width: 72px; text-align: center; }
  .np-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 9pt; margin-bottom: 20px; }
  .np-table th, .np-table td { border: 1px solid #000; padding: 3px 5px; vertical-align: middle; }
  .np-table thead th { font-weight: 700; text-align: center; }
  .np-grup-row td { font-weight: 700; background: #fff; padding-top: 4px; }
  .np-row-active td { background: #fffde7; }
  .np-total-row td { font-weight: 700; }
  .np-table .center { text-align: center; } .np-table .right { text-align: right; }
  .np-footer { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10pt; }
  .np-sig-block { width: 42%; } .np-sig-label { font-weight: 600; }
  .np-sig-paren { display: block; margin-top: 32px; text-align: center; }
`;

export function printNotaPenjualanPreview() {
  printElementById("nota-penjualan-preview", "Nota Penjualan", NOTA_PENJUALAN_PRINT_CSS);
}

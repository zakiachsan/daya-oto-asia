"use client";

import type { SlipDetail } from "@/lib/slip-gaji-utils";
import { formatIDR } from "@/lib/mock-data";
import { printElementById } from "@/lib/print-doc-utils";

type SlipGajiPreviewProps = {
  slip: SlipDetail;
  className?: string;
};

/** Slip gaji karyawan · layout cetak selaras HRIS detail */
export function SlipGajiPreview({ slip, className = "" }: SlipGajiPreviewProps) {
  return (
    <div className={`slip-gaji-doc ${className}`} id="slip-gaji-preview">
      <div className="slip-gaji-header">
        <p className="slip-gaji-company">PT. DAYA OTO ASIA</p>
        <p className="slip-gaji-title">SLIP GAJI · {slip.bulan}</p>
        <p className="slip-gaji-meta">{slip.nama} · {slip.cabangFull}</p>
      </div>

      <table className="slip-gaji-table">
        <tbody>
          <tr>
            <td>Gaji Pokok</td>
            <td className="right">{formatIDR(slip.gajiPokok)}</td>
          </tr>
          <tr>
            <td>Tunjangan</td>
            <td className="right">{formatIDR(slip.tunjangan)}</td>
          </tr>
          <tr>
            <td>Upah Lembur ({slip.jamLembur} jam)</td>
            <td className="right">{formatIDR(slip.lembur)}</td>
          </tr>
          <tr className="slip-gaji-subtotal">
            <td>Bruto</td>
            <td className="right">{formatIDR(slip.bruto)}</td>
          </tr>
          <tr className="slip-gaji-deduct">
            <td>Potongan Telat ({slip.telat}x) + Alpha ({slip.alpha} hari)</td>
            <td className="right">-{formatIDR(slip.potongan)}</td>
          </tr>
          <tr className="slip-gaji-deduct">
            <td>PPh 21</td>
            <td className="right">-{formatIDR(slip.pph21)}</td>
          </tr>
          <tr className="slip-gaji-total">
            <td>Gaji Bersih</td>
            <td className="right">{formatIDR(slip.bersih)}</td>
          </tr>
        </tbody>
      </table>

      <p className="slip-gaji-footer">Dokumen generated preview · {slip.status}</p>
    </div>
  );
}

const SLIP_GAJI_PRINT_CSS = `
  .slip-gaji-doc { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; max-width: 180mm; margin: 0 auto; }
  .slip-gaji-header { text-align: center; margin-bottom: 12px; }
  .slip-gaji-company { font-weight: 700; font-size: 11pt; margin: 0 0 4px; }
  .slip-gaji-title { font-weight: 700; font-size: 12pt; margin: 0 0 2px; }
  .slip-gaji-meta { font-size: 9pt; margin: 0; }
  .slip-gaji-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  .slip-gaji-table td { padding: 4px 6px; border-bottom: 1px solid #ccc; vertical-align: top; }
  .slip-gaji-table .right { text-align: right; font-weight: 600; }
  .slip-gaji-subtotal td { font-weight: 700; border-top: 1px solid #000; }
  .slip-gaji-deduct td { color: #b00020; }
  .slip-gaji-total td { font-weight: 700; font-size: 11pt; border-top: 2px solid #000; padding-top: 6px; }
  .slip-gaji-footer { font-size: 8pt; color: #666; margin-top: 8px; text-align: center; }
`;

export function printSlipGajiPreview() {
  printElementById("slip-gaji-preview", `Slip Gaji`, SLIP_GAJI_PRINT_CSS);
}

"use client";

import type { LaporanPemakaianRow } from "@/lib/laporan-pemakaian";
import {
  buildLaporanGrid,
  formatBulanLaporan,
  formatPolisiLaporan,
  formatTanggalCetakLaporan,
  padLaporanGrid,
  rowGramTotal,
  totalGramByDay,
  totalGramLaporan,
} from "@/lib/laporan-pemakaian";
import { printElementById } from "@/lib/print-doc-utils";

type LaporanPemakaianPreviewProps = {
  bengkel: string;
  tinter: string;
  bulan: string;
  rows: LaporanPemakaianRow[];
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

function UnderlineField({ label, value }: { label: string; value: string }) {
  return (
    <div className="lp-field">
      <span className="lp-field-label">{label}</span>
      <span className="lp-field-colon">:</span>
      <span className="lp-field-value">{value}</span>
    </div>
  );
}

function DayBlock({
  label,
  days,
  grid,
  allRows,
}: {
  label: string;
  days: number[];
  grid: ReturnType<typeof padLaporanGrid>;
  allRows: LaporanPemakaianRow[];
}) {
  return (
    <div className="lp-block">
      <p className="lp-block-label">{label}</p>
      <table className="lp-table">
        <thead>
          <tr>
            <th rowSpan={2} className="col-no">No.</th>
            <th rowSpan={2} className="col-kode">KODE BARANG</th>
            <th rowSpan={2} className="col-nama">NAMA BARANG</th>
            <th rowSpan={2} className="col-pol">NO POLISI</th>
            <th colSpan={days.length} className="lp-tgl-header">TGL</th>
            <th rowSpan={2} className="col-sum">TOTAL (gr)</th>
          </tr>
          <tr>
            {days.map((d) => (
              <th key={d} className="col-day">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((r, idx) => {
            const hasData = r.kodeBarang || r.namaBarang || Object.keys(r.byDay).length > 0;
            return (
              <tr key={`${r.no}-${idx}`} className={hasData ? "lp-row-data" : ""}>
                <td className="center">{r.no}</td>
                <td className="mono">{r.kodeBarang}</td>
                <td className="nama">{r.namaBarang}</td>
                <td className="pol">{formatPolisiLaporan(r.noPolisi)}</td>
                {days.map((d) => (
                  <td key={d} className="center day-val">{r.byDay[d] ? r.byDay[d] : ""}</td>
                ))}
                <td className="center sum-val">{rowGramTotal(r) || ""}</td>
              </tr>
            );
          })}
          <tr className="lp-total-row">
            <td colSpan={4} className="right">TOTAL (gr)</td>
            {days.map((d) => (
              <td key={d} className="center">{totalGramByDay(allRows, d) || ""}</td>
            ))}
            <td className="center">
              {days.reduce((s, d) => s + totalGramByDay(allRows, d), 0) || ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * Laporan pemakaian base — referensi DOA Cabang Bogor hal. 2.
 * Dua grid side-by-side: TGL 1–15 | TGL 16–31.
 */
export function LaporanPemakaianPreview({ bengkel, tinter, bulan, rows, className = "" }: LaporanPemakaianPreviewProps) {
  const daysInMonth = new Date(Number(bulan.slice(0, 4)), Number(bulan.slice(5, 7)), 0).getDate();
  const days1 = Array.from({ length: Math.min(15, daysInMonth) }, (_, i) => i + 1);
  const days2 = Array.from({ length: Math.max(0, daysInMonth - 15) }, (_, i) => i + 16);
  const grid = padLaporanGrid(buildLaporanGrid(rows));

  return (
    <div className={`laporan-pemakaian ${className}`} id="laporan-pemakaian-preview">
      <div className="lp-header">
        <div className="lp-header-left">
          <DoaLogo />
          <span className="lp-company">PT. DAYA OTO ASIA</span>
        </div>
      </div>

      <h1 className="lp-title">LAPORAN PEMAKAIAN BASE (GRAM)</h1>

      <div className="lp-meta">
        <div className="lp-meta-col">
          <UnderlineField label="NAMA BENGKEL" value={bengkel} />
          <UnderlineField label="NAMA TINTER" value={tinter} />
        </div>
        <div className="lp-meta-col">
          <UnderlineField label="BULAN" value={formatBulanLaporan(bulan)} />
          <UnderlineField label="TANGGAL" value={formatTanggalCetakLaporan()} />
        </div>
      </div>

      <div className="lp-split">
        <DayBlock label="TGL 1 – 15" days={days1} grid={grid} allRows={rows} />
        {days2.length > 0 && (
          <DayBlock label="TGL 16 – 31" days={days2} grid={grid} allRows={rows} />
        )}
      </div>

      <div className="lp-grand-total">
        TOTAL BULAN INI &nbsp; {totalGramLaporan(rows)} gr
      </div>

      <div className="lp-footer">
        <div className="lp-sig">
          <div className="lp-sig-line" />
          <p>Tinter</p>
        </div>
        <div className="lp-sig">
          <div className="lp-sig-line" />
          <p>Supervisor / Admin Cabang</p>
        </div>
      </div>
    </div>
  );
}

const LAPORAN_PRINT_CSS = `
  .laporan-pemakaian { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #000; max-width: 280mm; margin: 0 auto; }
  .lp-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .lp-header-left { display: flex; align-items: center; gap: 8px; }
  .lp-company { font-weight: 700; font-size: 10pt; }
  .lp-title { text-align: center; font-weight: 700; font-size: 11pt; letter-spacing: 0.03em; margin: 0 0 10px; }
  .lp-meta { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 10px; font-size: 9pt; }
  .lp-meta-col { flex: 1; }
  .lp-field { display: flex; align-items: baseline; margin-bottom: 3px; }
  .lp-field-label { font-weight: 700; min-width: 96px; }
  .lp-field-colon { width: 10px; }
  .lp-field-value { flex: 1; border-bottom: 1px solid #000; min-height: 14px; }
  .lp-split { display: flex; gap: 8px; align-items: flex-start; }
  .lp-block { flex: 1; min-width: 0; }
  .lp-block-label { font-weight: 700; font-size: 8pt; text-align: center; margin: 0 0 3px; }
  .lp-table { width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 6.5pt; table-layout: fixed; }
  .lp-table th, .lp-table td { border: 1px solid #000; padding: 1px 2px; vertical-align: middle; }
  .lp-table thead th { font-weight: 700; text-align: center; background: #fff; }
  .lp-tgl-header { font-weight: 700; }
  .lp-table .col-no { width: 6%; }
  .lp-table .col-kode { width: 11%; }
  .lp-table .col-nama { width: 22%; }
  .lp-table .col-pol { width: 12%; }
  .lp-table .col-day { width: 4%; font-size: 6pt; padding: 1px; }
  .lp-table .col-sum { width: 7%; }
  .lp-table .center { text-align: center; }
  .lp-table .right { text-align: right; }
  .lp-table .mono { font-family: "Courier New", monospace; font-size: 6pt; }
  .lp-table .nama { font-size: 5.5pt; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lp-table .pol { font-size: 6pt; }
  .lp-row-data .day-val { font-weight: 700; background: #fffde7; }
  .lp-total-row td { font-weight: 700; background: #f5f5f5; }
  .lp-grand-total { border: 2px solid #000; padding: 5px 8px; text-align: right; font-weight: 700; font-size: 9pt; margin-top: 8px; }
  .lp-footer { display: flex; justify-content: space-between; margin-top: 20px; font-size: 8pt; }
  .lp-sig { width: 38%; text-align: center; }
  .lp-sig-line { border-bottom: 1px solid #000; height: 40px; margin-bottom: 4px; }
  @media print { .lp-split { page-break-inside: avoid; } }
`;

export function printLaporanPemakaianPreview() {
  printElementById("laporan-pemakaian-preview", "Laporan Pemakaian Base", LAPORAN_PRINT_CSS);
}

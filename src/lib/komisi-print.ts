/** Cetak dokumen Rekap Komisi Bengkel (gaya dokumen DOA · A4 serif) */

import { printHtmlDocument, PRINT_DOC_CSS } from "./print-doc-utils";
import {
  KOMISI_KEPALA_RATE,
  KOMISI_PIHAK,
  KOMISI_TINTER_PER_NOTA,
  type KomisiCabangRow,
  type KomisiTinterRow,
} from "./komisi-utils";

function rp(n: number) {
  return `Rp ${Math.round(Number(n) || 0).toLocaleString("id-ID")}`;
}

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function cetakRekapKomisi(params: {
  row: KomisiCabangRow;
  tinter: KomisiTinterRow[];
  periodeLabel: string;
  selisihNota: number;
}) {
  const { row, tinter, periodeLabel, selisihNota } = params;

  const barisKomponen = [
    { label: `Kepala Bengkel (${Math.round(KOMISI_KEPALA_RATE * 100)}% × ${rp(row.dpp)})`, nilai: row.komisiKepala },
    { label: `Tinter (${rp(KOMISI_TINTER_PER_NOTA)} × ${row.jumlahNota} nota)`, nilai: row.komisiTinter },
    ...KOMISI_PIHAK.map((p) => ({
      label: row.pihakNama[p.id] ? `${p.label} (${row.pihakNama[p.id]})` : p.label,
      nilai: row.manual[p.id],
    })),
  ];

  const html = `
  <div class="doc">
    <p class="doc-center doc-bold" style="font-size:12pt">PT DAYA OTO ASIA</p>
    <p class="doc-center" style="font-size:9pt">Rekap Komisi Bengkel</p>
    <p class="doc-center doc-bold doc-upper" style="font-size:11pt;margin:6px 0 10px">REKAP KOMISI BENGKEL</p>

    <div class="field-row"><span class="field-label">Bengkel</span><span class="field-colon">:</span><span class="field-value">${esc(row.cabang)}</span></div>
    <div class="field-row"><span class="field-label">Kode Bengkel</span><span class="field-colon">:</span><span class="field-value">${esc(row.kodeCabang)}</span></div>
    <div class="field-row"><span class="field-label">Kepala Bengkel</span><span class="field-colon">:</span><span class="field-value">${esc(row.kepalaBengkel || "-")}</span></div>
    <div class="field-row"><span class="field-label">Periode</span><span class="field-colon">:</span><span class="field-value">${esc(periodeLabel)}</span></div>
    <div class="field-row"><span class="field-label">OPB</span><span class="field-colon">:</span><span class="field-value">${esc(row.opbId)} (${esc(row.opbStatus)})</span></div>
    <div class="field-row"><span class="field-label">DPP sebelum PPN</span><span class="field-colon">:</span><span class="field-value">${rp(row.dpp)}</span></div>

    <table class="doc-table" style="margin-top:10px">
      <thead>
        <tr><th style="width:70%">Komponen Komisi</th><th>Nilai</th></tr>
      </thead>
      <tbody>
        ${barisKomponen
          .map((b) => `<tr><td>${esc(b.label)}</td><td style="text-align:right">${rp(b.nilai)}</td></tr>`)
          .join("")}
        <tr><td class="doc-bold">TOTAL KOMISI</td><td class="doc-bold" style="text-align:right">${rp(row.total)}</td></tr>
      </tbody>
    </table>

    ${
      tinter.length
        ? `<p class="doc-bold" style="margin:12px 0 4px">Rincian nota per tinter</p>
      <table class="doc-table">
        <thead><tr><th style="width:55%">Tinter</th><th>Jumlah Nota</th><th>Nilai Komisi</th></tr></thead>
        <tbody>
          ${tinter
            .map(
              (t) =>
                `<tr><td>${esc(t.tinter)}</td><td style="text-align:right">${t.jumlahNota}</td><td style="text-align:right">${rp(
                  t.nilai,
                )}</td></tr>`,
            )
            .join("")}
          <tr><td class="doc-bold">Total nota tercatat</td><td class="doc-bold" style="text-align:right">${tinter.reduce(
            (s, t) => s + t.jumlahNota,
            0,
          )}</td><td class="doc-bold" style="text-align:right">${rp(
            tinter.reduce((s, t) => s + t.nilai, 0),
          )}</td></tr>
        </tbody>
      </table>
      <p style="font-size:8.5pt;margin-top:4px">Nota OPB: ${row.jumlahNota} · selisih nota tidak teratribusi: ${selisihNota}</p>`
        : ""
    }

    <table class="doc-table" style="margin-top:24px;border:none">
      <tbody>
        <tr>
          <td style="border:none;text-align:center;width:50%">( Kepala Bengkel )<div class="sig-line" style="border:none;height:40px"></div>${esc(
            row.kepalaBengkel || "…………………………",
          )}</td>
          <td style="border:none;text-align:center;width:50%">( Finance )<div class="sig-line" style="border:none;height:40px"></div>…………………………</td>
        </tr>
      </tbody>
    </table>

    <p class="footer-alamat">JL. Kaliandra II No. 89c, RT.4/RW.9, Cengkareng, Jakarta Barat · mail: Dayaotoasia@gmail.com · Telp: 08231518721</p>
  </div>`;

  printHtmlDocument(`Rekap Komisi ${row.cabang} ${periodeLabel}`, html, PRINT_DOC_CSS);
}

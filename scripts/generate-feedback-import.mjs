import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(
  fs.readFileSync(path.join(__dirname, "feedback-word-doc-rows.json"), "utf8"),
);

const DOC =
  "https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI";

function csvCell(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const header = [
  "No",
  "Link",
  "Feedback",
  "Harapan",
  "Keterangan",
  "Detail Fitur",
  "",
  "Status Pekerjaan",
  "Komentar",
];

const dataLines = rows.map((r) =>
  [
    r.no,
    r.link,
    r.feedback,
    r.harapan,
    `${r.keterangan} · Sumber: ${DOC}`,
    r.detail,
    "",
    "",
    "",
  ]
    .map(csvCell)
    .join(","),
);

const csv = `${dataLines.join("\n")}\n`;
const outCsv = path.join(__dirname, "feedback-import-append.csv");
fs.writeFileSync(outCsv, csv, "utf8");

const gsRows = rows.map((r) => [
  r.no,
  r.link,
  r.feedback,
  r.harapan,
  `${r.keterangan} · Sumber: ${DOC}`,
  r.detail,
  "",
  "",
  "",
]);

const gs = `/**
 * Paste di Google Sheet: Extensions > Apps Script
 * Jalankan appendFeedbackFromWordDoc (authorize sekali).
 */
function appendFeedbackFromWordDoc() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const rows = ${JSON.stringify(gsRows, null, 2)};

  const last = sheet.getLastRow();
  if (last >= 3) {
    const maybeSection = sheet.getRange(last, 1, 1, 3).getValues()[0];
    if (!maybeSection[0] && maybeSection[1] === "Aplikasi" && maybeSection[2] === "Aplikasi") {
      sheet.deleteRow(last);
    }
  }

  const start = sheet.getLastRow() + 1;
  sheet.getRange(start, 1, rows.length, rows[0].length).setValues(rows);
  SpreadsheetApp.getUi().alert("Berhasil menambahkan " + rows.length + " baris feedback (No 21–60).");
}
`;

fs.writeFileSync(path.join(__dirname, "append-feedback-to-sheet.gs"), gs, "utf8");
console.log(`Wrote ${outCsv} (${rows.length} rows)`);
console.log(`Wrote ${path.join(__dirname, "append-feedback-to-sheet.gs")}`);

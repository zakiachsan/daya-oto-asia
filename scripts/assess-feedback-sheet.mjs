import fs from "node:fs";

const text = fs.readFileSync("scripts/_feedback-latest.csv", "utf8");
const rows = [];
let row = [];
let cell = "";
let inQ = false;
for (let i = 0; i < text.length; i++) {
  const c = text[i];
  const n = text[i + 1];
  if (inQ) {
    if (c === '"' && n === '"') {
      cell += '"';
      i++;
      continue;
    }
    if (c === '"') {
      inQ = false;
      continue;
    }
    cell += c;
    continue;
  }
  if (c === '"') {
    inQ = true;
    continue;
  }
  if (c === ",") {
    row.push(cell);
    cell = "";
    continue;
  }
  if (c === "\n" || c === "\r") {
    if (c === "\r" && n === "\n") i++;
    row.push(cell);
    cell = "";
    if (row.some((x) => x.length)) rows.push(row);
    row = [];
    continue;
  }
  cell += c;
}
if (cell || row.length) {
  row.push(cell);
  if (row.some((x) => x.length)) rows.push(row);
}

const hdr = rows.findIndex((r) => r[0] === "No" && r[1] === "Link");
const data = rows.slice(hdr + 1);

console.log("=== Sheet summary ===");
console.log("Total data rows:", data.length);
const done = data.filter((r) => (r[7] || "").trim().toLowerCase() === "done");
console.log("Marked Done:", done.length, "(No 1–20 typically)");

console.log("\n=== Batch terbaru (No kosong / row 53+, logical 21–60) ===");
let n = 0;
for (let i = 0; i < data.length; i++) {
  const r = data[i];
  const noCol = (r[0] || "").trim();
  const link = r[1] || "";
  const fb = (r[2] || "").replace(/\s+/g, " ").trim();
  if (!fb) continue;
  if (noCol && !isNaN(Number(noCol))) continue; // skip numbered done rows? actually row 53+ has empty no
  const logical = 21 + n;
  n++;
  const status = (r[7] || "").trim() || "(belum)";
  console.log(`${logical}\t${status}\t${link.slice(0, 45)}\t${fb.slice(0, 65)}…`);
}
console.log("\nLogical count:", n);

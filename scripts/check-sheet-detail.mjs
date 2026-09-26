import fs from "node:fs";

function parseCsv(text) {
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
  return rows;
}

const rows = parseCsv(fs.readFileSync("scripts/_sheet-check4.csv", "utf8"));
const expected = JSON.parse(
  fs.readFileSync("scripts/feedback-word-doc-rows.json", "utf8"),
);

console.log("--- Rows 20-22 (context) ---");
for (const sr of [20, 21, 22]) {
  const r = rows[sr - 1];
  console.log(sr, r?.slice(0, 4).map((x) => x.replace(/\n/g, " ").slice(0, 50)));
}

let mismatch = 0;
for (let sr = 23; sr <= 62; sr++) {
  const r = rows[sr - 1];
  const exp = expected[sr - 23];
  const fb = (r[2] || "").trim();
  const expFb = exp.feedback.trim();
  if (!fb.startsWith(expFb.slice(0, 40)) && !expFb.startsWith(fb.slice(0, 40))) {
    mismatch++;
    console.log("Content drift row", sr, ":", fb.slice(0, 60));
  }
}
console.log("\nContent mismatches vs prepared import:", mismatch);

const missingHarapan = [];
for (let sr = 23; sr <= 62; sr++) {
  const r = rows[sr - 1];
  const exp = expected[sr - 23];
  if (exp.harapan && !(r[3] || "").trim()) missingHarapan.push(sr);
}
console.log("Rows with expected Harapan but empty in sheet:", missingHarapan.join(", ") || "none");

const hasKet = rows.slice(22, 62).filter((r) => (r[4] || "").includes("Doc ")).length;
console.log("Rows 23-62 with Doc # in Keterangan:", hasKet, "/ 40");

let h = 0;
let k = 0;
let f = 0;
for (let sr = 23; sr <= 62; sr++) {
  const r = rows[sr - 1];
  if ((r[3] || "").trim()) h++;
  if ((r[4] || "").trim()) k++;
  if ((r[5] || "").trim()) f++;
}
console.log("Harapan filled:", h, "| Keterangan:", k, "| Detail Fitur:", f);

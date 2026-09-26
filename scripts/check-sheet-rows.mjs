import fs from "node:fs";

const text = fs.readFileSync("scripts/_sheet-check4.csv", "utf8");
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

console.log("Total parsed CSV rows:", rows.length);

const expected = JSON.parse(
  fs.readFileSync("scripts/feedback-word-doc-rows.json", "utf8"),
);

for (let sr = 23; sr <= 62; sr++) {
  const idx = sr - 1;
  const r = rows[idx];
  if (!r) {
    console.log(`Row ${sr}: MISSING`);
    continue;
  }
  const [no, link, feedback, harapan, ket, detail, , status] = r;
  const exp = expected[sr - 23]; // row 23 -> index 0 (no 21)
  const noOk = exp ? String(no).trim() === String(exp.no) : "?";
  const linkOk = exp && link && link.includes(exp.link.split(" · ")[0]);
  console.log(
    `${sr}\tNo=${no}\t${noOk === true ? "ok" : noOk}\t${(link || "").slice(0, 40)}\t${(feedback || "").replace(/\s+/g, " ").slice(0, 55)}…\t${status || "-"}`,
  );
}

let filled = 0;
let emptyNo = 0;
for (let sr = 23; sr <= 62; sr++) {
  const r = rows[sr - 1];
  if (!r || !r[2]?.trim()) continue;
  filled++;
  if (!r[0]?.trim()) emptyNo++;
}
console.log(`\nRows 23-62 with Feedback: ${filled}/40, empty No column: ${emptyNo}`);

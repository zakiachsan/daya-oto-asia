/**
 * QA smoke · feedback batch 21–60 (HTTP + teks kunci)
 * Jalankan: node scripts/qa-feedback-check.mjs (server di :3300)
 */
const BASE = process.env.QA_BASE ?? "http://localhost:3300";

const checks = [
  { no: 21, path: "/app/transaksi/baru", must: ["Receipt ID", "Mulai Mixing"] },
  { no: 24, path: "/app/transaksi/baru", must: ["Clear Coat"] },
  { no: 32, path: "/app/transaksi", must: ["Transaksi"] },
  { no: 37, path: "/app", mustNot: ["Buka Kaleng"] },
  { no: 40, path: "/app", must: ["Admin"] },
  { no: 42, path: "/app/tukar-nota", must: ["Tukar-Tambah Nota"] },
  { no: 43, path: "/app/terima-barang", must: ["Terima Barang"] },
  { no: 46, path: "/operasional/transaksi", must: ["Plat"] },
  { no: 48, path: "/operasional/opb", must: ["Proses Invoice"] },
  { no: 51, path: "/modules", mustNot: ["verifikasi-klaim"] },
  { no: 54, path: "/operasional/surat-jalan", must: ["Surat Jalan"] },
  { no: 59, path: "/finance/surat-jalan", must: ["View Only"] },
  { no: 60, path: "/finance/laporan/rekap-pemakaian-cabang", must: ["Rekap Pemakaian Cabang"] },
];

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  return { ok: res.ok, status: res.status, html };
}

let pass = 0;
let fail = 0;

for (const c of checks) {
  try {
    const { ok, status, html } = await fetchText(c.path);
    const misses = (c.must ?? []).filter((t) => !html.includes(t));
    const bad = (c.mustNot ?? []).filter((t) => html.includes(t));
    if (ok && misses.length === 0 && bad.length === 0) {
      console.log(`✓ #${c.no} ${c.path}`);
      pass++;
    } else {
      console.log(`✗ #${c.no} ${c.path} status=${status} miss=${misses.join(",")} forbid=${bad.join(",")}`);
      fail++;
    }
  } catch (e) {
    console.log(`✗ #${c.no} ${c.path} error: ${e.message}`);
    fail++;
  }
}

console.log(`\nQA: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);

import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const reps = [
  ["/finance/coa", "/finance/buku-besar/akun-perkiraan"],
  ["/finance/jurnal", "/finance/buku-besar/jurnal-umum"],
  ["/finance/faktur-penjualan", "/finance/penjualan/faktur-penjualan"],
  ["/finance/faktur-pembelian", "/finance/pembelian/faktur-pembelian"],
  ["/finance/hutang-piutang", "/finance/laporan/hutang-piutang"],
  ["/finance/penyesuaian-stok", "/finance/persediaan/penyesuaian-persediaan"],
  ["/finance/neraca", "/finance/laporan/neraca"],
  ["/finance/laba-rugi", "/finance/laporan/laba-rugi"],
  ["/finance/arus-kas", "/finance/laporan/arus-kas"],
  ["/finance/perpajakan", "/finance/laporan/perpajakan"],
  ['"/finance/kas-bank"', '"/finance/kas-bank/pembayaran"'],
];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(f)) {
      let c = fs.readFileSync(p, "utf8");
      let n = c;
      for (const [a, b] of reps) n = n.split(a).join(b);
      if (n !== c) {
        fs.writeFileSync(p, n);
        console.log("updated", p);
      }
    }
  }
}

walk(root);

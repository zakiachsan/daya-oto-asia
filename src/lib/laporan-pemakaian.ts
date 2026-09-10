import type { TransaksiRow } from "./mock-data";

export type LaporanPemakaianRow = {
  tanggal: number;
  tanggalIso: string;
  namaBarang: string;
  kodeBarang: string;
  noPolisi: string;
  totalGram: number;
  trxId: string;
};

export type LaporanPemakaianFilters = {
  bulan: string; // YYYY-MM
  cabang: string;
  tinter: string;
};

export function buildLaporanPemakaian(
  transaksi: TransaksiRow[],
  filters: LaporanPemakaianFilters
): LaporanPemakaianRow[] {
  const rows: LaporanPemakaianRow[] = [];

  for (const trx of transaksi) {
    if (filters.cabang !== "Semua Cabang" && !trx.cabang.includes(filters.cabang)) continue;
    if (filters.tinter !== "Semua Tinter" && trx.tinter !== filters.tinter) continue;
    if (!trx.tanggal.startsWith(filters.bulan)) continue;
    if (!trx.waktuCetakNota && trx.status === "Draft") continue;

    const day = Number(trx.tanggal.slice(8, 10));
    for (const b of trx.bahan) {
      rows.push({
        tanggal: day,
        tanggalIso: trx.tanggal,
        namaBarang: b.nama,
        kodeBarang: b.kode,
        noPolisi: trx.platNomor,
        totalGram: b.gram,
        trxId: trx.id,
      });
    }
  }

  return rows.sort((a, b) => a.tanggal - b.tanggal || a.trxId.localeCompare(b.trxId));
}

export function totalGramLaporan(rows: LaporanPemakaianRow[]) {
  return Math.round(rows.reduce((s, r) => s + r.totalGram, 0) * 10) / 10;
}

export function uniqueTinters(transaksi: TransaksiRow[]) {
  return ["Semua Tinter", ...Array.from(new Set(transaksi.map((t) => t.tinter))).sort()];
}

export function uniqueCabangShort(transaksi: TransaksiRow[]) {
  const shorts = transaksi.map((t) => {
    if (t.cabang.includes("Surabaya")) return "Surabaya";
    if (t.cabang.includes("Malang")) return "Malang";
    if (t.cabang.includes("Jember")) return "Jember";
    if (t.cabang.includes("Kediri")) return "Kediri";
    return t.cabang;
  });
  return ["Semua Cabang", ...Array.from(new Set(shorts)).sort()];
}

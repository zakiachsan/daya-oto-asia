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
  filters: LaporanPemakaianFilters,
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

/** Baris grid · kolom = tanggal, referensi DOA Bogor hal. 2 */
export type LaporanGridRow = {
  no: number;
  namaBarang: string;
  kodeBarang: string;
  noPolisi: string;
  byDay: Record<number, number>;
};

export function buildLaporanGrid(rows: LaporanPemakaianRow[]): LaporanGridRow[] {
  const grid: LaporanGridRow[] = [];
  for (const r of rows) {
    const existing = grid.find(
      (g) => g.namaBarang === r.namaBarang && g.kodeBarang === r.kodeBarang && g.noPolisi === r.noPolisi,
    );
    if (existing) {
      existing.byDay[r.tanggal] = (existing.byDay[r.tanggal] ?? 0) + r.totalGram;
    } else {
      grid.push({
        no: grid.length + 1,
        namaBarang: r.namaBarang,
        kodeBarang: r.kodeBarang,
        noPolisi: r.noPolisi,
        byDay: { [r.tanggal]: r.totalGram },
      });
    }
  }
  return grid;
}

/** Pad baris kosong supaya form print mirip blanko (min 12 baris per blok) */
export function padLaporanGrid(grid: LaporanGridRow[], minRows = 12): LaporanGridRow[] {
  if (grid.length >= minRows) return grid;
  const padded = [...grid];
  while (padded.length < minRows) {
    padded.push({
      no: padded.length + 1,
      namaBarang: "",
      kodeBarang: "",
      noPolisi: "",
      byDay: {},
    });
  }
  return padded;
}

export function totalGramByDay(rows: LaporanPemakaianRow[], day: number) {
  const sum = rows.filter((r) => r.tanggal === day).reduce((s, r) => s + r.totalGram, 0);
  return sum > 0 ? Math.round(sum * 10) / 10 : 0;
}

export function rowGramTotal(row: LaporanGridRow) {
  const sum = Object.values(row.byDay).reduce((s, v) => s + v, 0);
  return sum > 0 ? Math.round(sum * 10) / 10 : 0;
}

export function formatBulanLaporan(bulan: string) {
  return new Date(`${bulan}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export function formatTanggalCetakLaporan() {
  const d = new Date();
  return `${d.getDate()}-${d.toLocaleDateString("id-ID", { month: "short" })}-${String(d.getFullYear()).slice(-2)}`;
}

export function formatPolisiLaporan(plat: string) {
  return plat.replace(/\s+/g, " ").trim();
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

import { MOCK_PRODUK } from "./mock-data";

/** Stok per produk & lokasi · kaleng utuh + gram terbuka (Sheet #11) */

export type InventoriStokRow = {
  id: string;
  kodeProduk: string;
  produk: string;
  cabang: string;
  kalengUtuh: number;
  gramTerbuka: number;
  status: "Aman" | "Menipis" | "Kritis" | "Habis";
};

export type InventoriStokAdjust = {
  id: string;
  tanggal: string;
  kodeProduk: string;
  cabang: string;
  kalengDelta: number;
  gramDelta: number;
  keterangan: string;
  oleh: string;
};

function stokId(kode: string, cabang: string) {
  return `${kode}|${cabang}`;
}

export function produkNamaForKode(kode: string) {
  return MOCK_PRODUK.find((p) => p.kode === kode)?.nama ?? kode;
}

export function listProdukAktif() {
  return MOCK_PRODUK.filter((p) => p.status === "Aktif").sort((a, b) => a.kode.localeCompare(b.kode));
}

export function formatProdukOptionLabel(kode: string, nama: string) {
  if (!nama.toUpperCase().startsWith(kode.toUpperCase())) return `${kode} · ${nama}`;
  const stripped = nama.slice(kode.length).replace(/^[\s\-·]+/, "").trim();
  return `${kode} · ${stripped || nama}`;
}

function deriveStatus(kaleng: number, gram: number): InventoriStokRow["status"] {
  if (kaleng <= 0 && gram <= 0) return "Habis";
  if (kaleng <= 1 && gram < 200) return "Kritis";
  if (kaleng <= 3 && gram < 500) return "Menipis";
  return "Aman";
}

export function buildInventoriRow(
  kode: string,
  produk: string,
  cabang: string,
  kalengUtuh: number,
  gramTerbuka: number,
): InventoriStokRow {
  return {
    id: stokId(kode, cabang),
    kodeProduk: kode,
    produk,
    cabang,
    kalengUtuh,
    gramTerbuka,
    status: deriveStatus(kalengUtuh, gramTerbuka),
  };
}

/** Data awal · gabungan kaleng + gram per produk/lokasi */
export const INITIAL_INVENTORI: InventoriStokRow[] = [
  buildInventoriRow("AXT-207", produkNamaForKode("AXT-207"), "Pusat", 45, 0),
  buildInventoriRow("AXT-207", produkNamaForKode("AXT-207"), "Surabaya", 2, 850),
  buildInventoriRow("AXT-814", produkNamaForKode("AXT-814"), "Surabaya", 5, 850),
  buildInventoriRow("AXT-814", produkNamaForKode("AXT-814"), "Malang", 3, 420),
  buildInventoriRow("AXT-910", produkNamaForKode("AXT-910"), "Malang", 1, 120),
  buildInventoriRow("AXT-910", produkNamaForKode("AXT-910"), "Jember", 0, 0),
  buildInventoriRow("AXT-101", produkNamaForKode("AXT-101"), "Surabaya", 8, 320),
  buildInventoriRow("AXT-501", produkNamaForKode("AXT-501"), "Jember", 4, 180),
  buildInventoriRow("AXT-203", produkNamaForKode("AXT-203"), "Pusat", 12, 0),
  buildInventoriRow("AXT-60", produkNamaForKode("AXT-60"), "Surabaya", 0, 95),
];

export function mergeInventoriRows(
  base: InventoriStokRow[],
  adjustments: InventoriStokAdjust[],
): InventoriStokRow[] {
  const map = new Map(base.map((r) => [r.id, { ...r }]));

  for (const adj of adjustments) {
    const id = stokId(adj.kodeProduk, adj.cabang);
    const existing = map.get(id);
    if (existing) {
      const kalengUtuh = Math.max(0, existing.kalengUtuh + adj.kalengDelta);
      const gramTerbuka = Math.max(0, existing.gramTerbuka + adj.gramDelta);
      map.set(id, buildInventoriRow(existing.kodeProduk, existing.produk, existing.cabang, kalengUtuh, gramTerbuka));
    } else {
      map.set(
        id,
        buildInventoriRow(
          adj.kodeProduk,
          produkNamaForKode(adj.kodeProduk),
          adj.cabang,
          Math.max(0, adj.kalengDelta),
          Math.max(0, adj.gramDelta),
        ),
      );
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.cabang.localeCompare(b.cabang) || a.produk.localeCompare(b.produk),
  );
}

export function formatStokBreakdown(row: InventoriStokRow) {
  const parts: string[] = [];
  if (row.kalengUtuh > 0) parts.push(`${row.kalengUtuh} kaleng utuh`);
  if (row.gramTerbuka > 0) parts.push(`${row.gramTerbuka.toLocaleString("id-ID")} gr terbuka`);
  return parts.length > 0 ? parts.join(" + ") : "Kosong";
}

import { clearCoatMixingLines } from "./clear-coat-mixing-chart";
import type { ProdukKategoriId } from "./transaksi-status-utils";

/** Master mixing ratio · sinkron Operasional → auto-fill app (#31) */
export type MixingRatioRow = {
  kode: string;
  nama: string;
  kategori: ProdukKategoriId;
  /** parts product : hardener/thinner */
  ratioLabel: string;
  productPart: number;
  hardenerPart: number;
  /** Pakai tabel berat AXT (clear coat) */
  useWeightChart?: boolean;
};

export const MIXING_RATIO_MASTER: MixingRatioRow[] = [
  {
    kode: "HS360",
    nama: "AXT 360 HS",
    kategori: "clearcoat",
    ratioLabel: "AXT chart · Base (A) + Hardener (B) + Thinner (T)",
    productPart: 585,
    hardenerPart: 287,
    useWeightChart: true,
  },
  {
    kode: "MS280",
    nama: "AXT 280 MS",
    kategori: "clearcoat",
    ratioLabel: "AXT chart · Base (A) + Hardener (B) + Thinner (T)",
    productPart: 588,
    hardenerPart: 147,
    useWeightChart: true,
  },
  { kode: "PU-2K-GREY", nama: "PU 2K Grey", kategori: "surfacer", ratioLabel: "4:1", productPart: 4, hardenerPart: 1 },
  { kode: "EP-2K", nama: "EP 2K", kategori: "surfacer", ratioLabel: "4:1", productPart: 4, hardenerPart: 1 },
  { kode: "PP-PRIMER", nama: "PP Primer", kategori: "primer", ratioLabel: "1:1", productPart: 1, hardenerPart: 1 },
  { kode: "DEMPUL-H", nama: "Dempul + Hardener", kategori: "dempul", ratioLabel: "100:3", productPart: 100, hardenerPart: 3 },
  { kode: "PU", nama: "Thinner PU", kategori: "thinner", ratioLabel: "—", productPart: 1, hardenerPart: 0 },
];

export function findMixingRatio(kode: string) {
  return MIXING_RATIO_MASTER.find((r) => r.kode === kode);
}

/** Gram bahan otomatis dari volume target (gram total) · non-basecoat */
export function gramsFromMixingRatio(totalGram: number, row: MixingRatioRow): { kode: string; gram: number; nama?: string }[] {
  if (row.useWeightChart && row.kategori === "clearcoat") {
    return clearCoatMixingLines(row.kode as "HS360" | "MS280", totalGram);
  }
  if (row.hardenerPart <= 0) {
    return [{ kode: row.kode, gram: totalGram, nama: row.nama }];
  }
  const parts = row.productPart + row.hardenerPart;
  const productGram = Math.round((totalGram * row.productPart) / parts);
  const hardenerGram = Math.max(0, totalGram - productGram);
  return [
    { kode: row.kode, gram: productGram, nama: row.nama },
    { kode: `${row.kode}-H`, gram: hardenerGram, nama: `Hardener ${row.ratioLabel}` },
  ];
}

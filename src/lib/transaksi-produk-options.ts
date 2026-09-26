import type { ProdukKategoriId } from "./transaksi-status-utils";

export type ProdukKodeOption = { kode: string; nama: string; kategori?: string; harga?: number };

/** Dropdown fase 1 · base coat = tarif nota (bukan list toner penuh) */
const BASECOAT: ProdukKodeOption[] = [
  { kode: "BC-STANDARD", nama: "Standard", kategori: "Standard", harga: 190000 },
  { kode: "BC-RED-SPECIAL", nama: "Red/Special", kategori: "Red", harga: 210000 },
  { kode: "BC-PEARL", nama: "Pearl", kategori: "Pearl", harga: 230000 },
  { kode: "BC-XYRALIC", nama: "Xyralic", kategori: "Xyralic", harga: 320000 },
];

const CLEAR_COAT: ProdukKodeOption[] = [
  { kode: "HS360", nama: "HS (360) (set)", kategori: "Clear Coat", harga: 147000 },
  { kode: "MS280", nama: "MS (280) (set)", kategori: "Clear Coat", harga: 115000 },
];

const SURFACER: ProdukKodeOption[] = [
  { kode: "PU-2K-GREY", nama: "PU 2K Grey", kategori: "Surfacers", harga: 110000 },
];

const PRIMER: ProdukKodeOption[] = [{ kode: "EP-2K", nama: "EP 2K", kategori: "Surfacers", harga: 110000 }];

const THINNER: ProdukKodeOption[] = [{ kode: "PU", nama: "PU", kategori: "Thinner", harga: 60000 }];

const DEMPUL: ProdukKodeOption[] = [
  { kode: "DEMPUL-H", nama: "Putty", kategori: "Putty", harga: 90000 },
];

const LAIN_LAIN: ProdukKodeOption[] = [
  { kode: "WB-CLEANER", nama: "Degreaser", kategori: "Lain-lain", harga: 53000 },
  { kode: "PP-PRIMER", nama: "PP Primer", kategori: "Lain-lain", harga: 115000 },
];

export type ExtraKodeForOptions = {
  kode: string;
  nama: string;
  subKategori?: string;
  harga?: number;
  produkKategori?: string;
};

export function extraKodeOptionsForProdukKategori(
  produkKategori: ProdukKategoriId,
  extra: ExtraKodeForOptions[] = [],
): ProdukKodeOption[] {
  return extra
    .filter((k) => !k.produkKategori || k.produkKategori === produkKategori)
    .map((k) => ({
      kode: k.kode,
      nama: k.nama,
      kategori: k.subKategori,
      harga: k.harga,
    }));
}

function mergeUniqueOptions(preset: ProdukKodeOption[], extra: ProdukKodeOption[]): ProdukKodeOption[] {
  const seen = new Set(preset.map((p) => p.kode));
  const added = extra.filter((e) => !seen.has(e.kode));
  return [...preset, ...added];
}

export function kodeOptionsForProdukKategori(
  produkKategori: ProdukKategoriId,
  extra: ProdukKodeOption[] = [],
): ProdukKodeOption[] {
  switch (produkKategori) {
    case "basecoat":
      return mergeUniqueOptions(BASECOAT, extra);
    case "clearcoat":
      return mergeUniqueOptions(CLEAR_COAT, extra);
    case "thinner":
      return mergeUniqueOptions(THINNER, extra);
    case "dempul":
      return mergeUniqueOptions(DEMPUL, extra);
    case "surfacer":
      return mergeUniqueOptions(SURFACER, extra);
    case "primer":
      return mergeUniqueOptions(PRIMER, extra);
    case "lain":
      return mergeUniqueOptions(LAIN_LAIN, extra);
    default:
      return extra;
  }
}

export function hargaForProdukOption(opt: ProdukKodeOption) {
  return opt.harga ?? 190000;
}

/** Satu baris di dropdown · hindari "PU · PU" / kode + nama dobel */
export function labelForKodeWarnaOption(opt: ProdukKodeOption): string {
  const nama = opt.nama.trim();
  const kode = opt.kode.trim();
  if (nama && nama.toLowerCase() !== kode.toLowerCase()) return nama;
  return kode || nama;
}

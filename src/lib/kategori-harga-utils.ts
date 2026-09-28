import { MOCK_KATEGORI_HARGA, MOCK_PRODUK } from "./mock-data";

/** Master tarif jual per liter · dipakai pricing transaksi mobile & hitung nilai barang kirim ke cabang */
export type KategoriHargaRow = {
  kategori: string;
  harga: number;
  satuan: string;
  contoh: string;
};

/**
 * Tarif awal dari MOCK_KATEGORI_HARGA + kategori tarif yang dipakai master produk
 * tapi belum punya tarif (biar produk AXT-60/AXT-1530 dll. nggak jatuh ke default diam-diam).
 */
export const INITIAL_KATEGORI_HARGA: KategoriHargaRow[] = [
  ...MOCK_KATEGORI_HARGA.map((k) => ({ ...k })),
  { kategori: "Lainnya", harga: 190000, satuan: "liter", contoh: "Binder/controller & produk non-warna (AXT-60, AXT-1530)" },
  { kategori: "Degreaser", harga: 95000, satuan: "liter", contoh: "Degreaser / pembersih permukaan" },
];

export const HARGA_KATEGORI_DEFAULT = 190000;

export function hargaKategori(items: KategoriHargaRow[], kategori: string) {
  const key = (kategori ?? "").trim().toLowerCase();
  if (!key) return HARGA_KATEGORI_DEFAULT;
  return items.find((k) => k.kategori.toLowerCase() === key)?.harga ?? HARGA_KATEGORI_DEFAULT;
}

export function produkByKode(kode: string) {
  return MOCK_PRODUK.find((p) => p.kode === kode);
}

/** Liter per 1 unit (kaleng) produk · beratKaleng gram → liter */
export function literPerUnit(kode: string) {
  const p = produkByKode(kode);
  if (!p) return 0;
  const gram = p.beratKaleng || 0;
  if (gram) return gram / 1000;
  return p.satuan === "liter" ? 1 : 0;
}

/** Harga jual 1 unit produk = tarif per liter (kategori tarif produk) × liter per unit */
export function hargaUnitProduk(kode: string, kategoriHarga: KategoriHargaRow[]) {
  const p = produkByKode(kode);
  if (!p) return 0;
  return Math.round(hargaKategori(kategoriHarga, p.kategoriTarif) * literPerUnit(kode));
}

/** Harga jual per liter produk (dipakai kolom Master Produk) */
export function hargaPerLiterProduk(kode: string, kategoriHarga: KategoriHargaRow[]) {
  const p = produkByKode(kode);
  if (!p) return 0;
  return hargaKategori(kategoriHarga, p.kategoriTarif);
}

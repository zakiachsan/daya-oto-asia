import type { TransaksiProdukLine, TransaksiRow } from "./mock-data";
import { PRODUK_KATEGORI, type ProdukKategoriId } from "./transaksi-status-utils";

export type TransaksiCatatanItem = {
  urut: number;
  kategoriLabel: string;
  kodeWarna: string;
  nama: string;
  mixingVolume?: number;
  bahan: { kode: string; nama: string; gram: number }[];
  total?: number;
};

function kategoriLabel(id?: ProdukKategoriId) {
  const pk = id ?? "basecoat";
  return PRODUK_KATEGORI.find((k) => k.id === pk)?.label ?? pk;
}

function lineToCatatan(urut: number, line: TransaksiProdukLine): TransaksiCatatanItem {
  return {
    urut,
    kategoriLabel: kategoriLabel(line.produkKategori),
    kodeWarna: line.kodeWarna,
    nama: line.warna,
    mixingVolume: line.mixingVolume,
    bahan: line.bahan.map((b) => ({ kode: b.kode, nama: b.nama, gram: b.gram })),
    total: line.total,
  };
}

/** Catatan read-only · semua bahan yang sudah masuk receipt */
export function buildTransaksiCatatan(
  trx: Pick<
    TransaksiRow,
    | "produkKategori"
    | "produkLines"
    | "kodeWarna"
    | "warna"
    | "bahan"
    | "mixingVolume"
    | "total"
    | "kategori"
  >,
): TransaksiCatatanItem[] {
  const items: TransaksiCatatanItem[] = [];
  let urut = 1;
  for (const line of trx.produkLines ?? []) {
    items.push(lineToCatatan(urut++, line));
  }
  if (trx.bahan.length > 0) {
    items.push({
      urut,
      kategoriLabel: kategoriLabel(trx.produkKategori),
      kodeWarna: trx.kodeWarna,
      nama: trx.warna,
      mixingVolume: trx.mixingVolume,
      bahan: trx.bahan.map((b) => ({ kode: b.kode, nama: b.nama, gram: b.gram })),
      total: trx.total,
    });
  }
  return items;
}

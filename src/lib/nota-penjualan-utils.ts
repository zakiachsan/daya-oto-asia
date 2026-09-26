import type { TransaksiRow } from "./mock-data";
import type { ProdukKategoriId } from "./transaksi-status-utils";
import {
  NOTA_PENJUALAN_GRUP,
  type NotaPenjualanBaris,
  formatNotaPenjualanHarga,
} from "./nota-penjualan-tarif";

export type NotaPenjualanLineFill = {
  barisId: string;
  pemakaianMl: number;
  harga: number;
  jumlahRp: number;
  labelOverride?: string;
};

const ALAMAT_ASTRA_BOGOR =
  "Jl. KH. R. Abdullah Bin Nuh Jl. Yasmin Raya No.16, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113";

export function astraPelangganForCabang(cabang: string) {
  const lower = cabang.toLowerCase();
  if (lower.includes("surabaya")) {
    return {
      nama: "PT. Astra Daihatsu Tbk - Cabang Surabaya",
      alamat: "Jl. Raya Darmo Permai III No.36, Surabaya",
      lokasi: "Astra Surabaya",
    };
  }
  if (lower.includes("malang")) {
    return {
      nama: "PT. Astra Daihatsu Tbk - Cabang Malang",
      alamat: "Jl. Letjen S. Parman No.67, Malang",
      lokasi: "Astra Malang",
    };
  }
  if (lower.includes("jember")) {
    return {
      nama: "PT. Astra Daihatsu Tbk - Cabang Jember",
      alamat: "Jl. Mastrip No.1, Jember",
      lokasi: "Astra Jember",
    };
  }
  if (lower.includes("kediri")) {
    return {
      nama: "PT. Astra Daihatsu Tbk - Cabang Kediri",
      alamat: "Jl. Ahmad Yani No.88, Kediri",
      lokasi: "Astra Kediri",
    };
  }
  return {
    nama: "PT. Astra Daihatsu Tbk - Cabang Bogor",
    alamat: ALAMAT_ASTRA_BOGOR,
    lokasi: "Astra Bogor",
  };
}

function findBaseCoatBaris(kategori: string): NotaPenjualanBaris {
  const base = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "BASE COAT");
  const match =
    base?.baris.find((b) => b.kategoriKeys?.includes(kategori)) ??
    base?.baris.find((b) => b.kategoriKeys?.includes("Standard")) ??
    base!.baris[0];
  return match;
}

function pemakaianMlForLine(totalGram: number, harga: number, jumlahRp: number) {
  const fromGram = totalGram;
  const fromTotal = harga > 0 ? Math.round((jumlahRp / harga) * 1000) : fromGram;
  return Math.max(fromGram, fromTotal);
}

function barisById(id: string) {
  for (const g of NOTA_PENJUALAN_GRUP) {
    const b = g.baris.find((x) => x.id === id);
    if (b) return b;
  }
  return null;
}

function lineFromBaris(baris: NotaPenjualanBaris, totalGram: number, jumlahRp: number, labelOverride?: string): NotaPenjualanLineFill {
  return {
    barisId: baris.id,
    pemakaianMl: pemakaianMlForLine(totalGram, baris.harga, jumlahRp),
    harga: baris.harga,
    jumlahRp,
    labelOverride,
  };
}

type NotaLineInput = Pick<
  TransaksiRow,
  "kategori" | "bahan" | "total" | "produkKategori" | "kodeWarna" | "warna" | "lainLainLabel"
>;

/** Baris nota dinamis dari kategori produk transaksi (#33) */
export function buildNotaPenjualanLines(trx: NotaLineInput): NotaPenjualanLineFill[] {
  const totalGram = trx.bahan.reduce((s, b) => s + b.gram, 0);
  const pk = (trx.produkKategori ?? "basecoat") as ProdukKategoriId;
  const lines: NotaPenjualanLineFill[] = [];

  if (pk === "clearcoat") {
    const cc = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "CLEAR COAT")!;
    const baris = trx.kodeWarna === "MS280" ? cc.baris[1] : cc.baris[0];
    lines.push(lineFromBaris(baris, totalGram, trx.total));
    return lines;
  }

  if (pk === "surfacer" || pk === "primer") {
    const sf = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "PRIMER / SURFACER")!;
    let baris = sf.baris[0];
    if (pk === "primer" || trx.kodeWarna === "EP-2K") {
      baris = sf.baris.find((b) => b.id === "sf-filler") ?? sf.baris[1];
    } else if (pk === "surfacer" || trx.kodeWarna === "PU-2K-GREY") {
      baris = sf.baris[0];
    }
    lines.push(lineFromBaris(baris, totalGram, trx.total));
    return lines;
  }

  if (pk === "dempul") {
    const pt = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "PUTTY / DEMPUL")!.baris[0];
    lines.push(lineFromBaris(pt, totalGram, trx.total));
    return lines;
  }

  if (pk === "thinner") {
    const th = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "THINNER")!.baris[0];
    lines.push(lineFromBaris(th, totalGram, trx.total));
    return lines;
  }

  if (pk === "lain") {
    if (trx.kodeWarna === "PP-PRIMER") {
      const sf = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "PRIMER / SURFACER")!.baris[2];
      lines.push(lineFromBaris(sf, totalGram, trx.total));
      return lines;
    }
    const ll = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "LAIN-LAIN")!.baris[0];
    const label = trx.lainLainLabel ?? trx.warna;
    lines.push(lineFromBaris(ll, totalGram, trx.total, label));
    return lines;
  }

  const baseBaris = findBaseCoatBaris(trx.kategori);
  lines.push(lineFromBaris(baseBaris, totalGram, trx.total));
  return lines;
}

function produkLineToNotaInput(line: NonNullable<TransaksiRow["produkLines"]>[number]): NotaLineInput {
  return {
    kategori: line.kategori,
    bahan: line.bahan,
    total: line.total,
    produkKategori: line.produkKategori,
    kodeWarna: line.kodeWarna,
    warna: line.warna,
    lainLainLabel: line.lainLainLabel,
  };
}

/** Semua kategori dalam satu receipt (tambah bahan) */
export function buildNotaPenjualanLinesForTrx(
  trx: Pick<
    TransaksiRow,
    | "kategori"
    | "bahan"
    | "total"
    | "produkKategori"
    | "kodeWarna"
    | "warna"
    | "lainLainLabel"
    | "produkLines"
  >,
): NotaPenjualanLineFill[] {
  const rounds: NotaLineInput[] = [
    ...(trx.produkLines ?? []).map(produkLineToNotaInput),
    {
      kategori: trx.kategori,
      bahan: trx.bahan,
      total: trx.total,
      produkKategori: trx.produkKategori,
      kodeWarna: trx.kodeWarna,
      warna: trx.warna,
      lainLainLabel: trx.lainLainLabel,
    },
  ];
  if (trx.produkLines?.length) {
    return rounds.flatMap((r) => buildNotaPenjualanLines(r));
  }
  return buildNotaPenjualanLines(trx);
}

export function notaPenjualanGrandTotal(lines: NotaPenjualanLineFill[]) {
  return lines.reduce((s, l) => s + l.jumlahRp, 0);
}

export function formatNotaPenjualanJumlah(n: number) {
  return formatNotaPenjualanHarga(n);
}

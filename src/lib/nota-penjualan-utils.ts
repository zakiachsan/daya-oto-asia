import type { TransaksiRow } from "./mock-data";
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

/** Derive pemakaian ml from gram bahan; back-calc if total tagihan lebih besar dari per-ml */
function pemakaianMlForLine(totalGram: number, harga: number, jumlahRp: number) {
  const fromGram = totalGram;
  const fromTotal = harga > 0 ? Math.round((jumlahRp / harga) * 1000) : fromGram;
  return Math.max(fromGram, fromTotal);
}

/**
 * Baris terisi untuk nota penjualan · base coat dari kategori transaksi.
 * Untuk demo job besar (total > base), tambah clear coat + surfacer seperti scan referensi.
 */
export function buildNotaPenjualanLines(trx: Pick<TransaksiRow, "kategori" | "bahan" | "total">): NotaPenjualanLineFill[] {
  const totalGram = trx.bahan.reduce((s, b) => s + b.gram, 0);
  const baseBaris = findBaseCoatBaris(trx.kategori);
  const lines: NotaPenjualanLineFill[] = [];

  if (trx.total >= 300000) {
    const cc = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "CLEAR COAT")!.baris[1];
    const sf = NOTA_PENJUALAN_GRUP.find((g) => g.judul === "PRIMER / SURFACER")!.baris[0];
    const baseShare = Math.round(trx.total * 0.59);
    const clearShare = Math.round(trx.total * 0.35);
    const surfShare = trx.total - baseShare - clearShare;

    lines.push({
      barisId: baseBaris.id,
      pemakaianMl: pemakaianMlForLine(totalGram, baseBaris.harga, baseShare),
      harga: baseBaris.harga,
      jumlahRp: baseShare,
    });
    lines.push({
      barisId: cc.id,
      pemakaianMl: pemakaianMlForLine(0, cc.harga, clearShare),
      harga: cc.harga,
      jumlahRp: clearShare,
    });
    lines.push({
      barisId: sf.id,
      pemakaianMl: pemakaianMlForLine(0, sf.harga, surfShare),
      harga: sf.harga,
      jumlahRp: surfShare,
    });
    return lines;
  }

  lines.push({
    barisId: baseBaris.id,
    pemakaianMl: pemakaianMlForLine(totalGram, baseBaris.harga, trx.total),
    harga: baseBaris.harga,
    jumlahRp: trx.total,
  });
  return lines;
}

export function notaPenjualanGrandTotal(lines: NotaPenjualanLineFill[]) {
  return lines.reduce((s, l) => s + l.jumlahRp, 0);
}

export function formatNotaPenjualanJumlah(n: number) {
  return formatNotaPenjualanHarga(n);
}

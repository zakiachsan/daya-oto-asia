import { MOCK_DISTRIBUSI, MOCK_PRODUK } from "./mock-data";

export type DistLine = { kode: string; nama: string; qty: number };

/** Hasil konfirmasi terima barang dari mobile */
export type TerimaLine = {
  kode: string;
  nama: string;
  /** Unit yang dikirim sesuai surat jalan */
  qtyKirim: number;
  /** Unit yang benar-benar diterima */
  qtyTerima: number;
  /** Unit yang kurang = qtyKirim - qtyTerima */
  kurangUnit: number;
  /** Selisih bocor dalam gram */
  bocorGram: number;
};

export type TerimaRecord = {
  oleh: string;
  waktu: string;
  lines: TerimaLine[];
};

export type DistribusiStatus = "Draft" | "Dalam Perjalanan" | "Selesai";

/** Urutan status untuk filter & stat */
export const DISTRIBUSI_STATUS: DistribusiStatus[] = ["Draft", "Dalam Perjalanan", "Selesai"];

/**
 * Status diturunkan dari data, bukan diketik manual:
 * Draft = belum dikirim · Dalam Perjalanan = sudah dikirim, belum diterima · Selesai = diterima cabang.
 */
export function distribusiStatus(d: DistribusiDetail): DistribusiStatus {
  if (d.waktuTerima || d.terima) return "Selesai";
  if (d.waktuKirim) return "Dalam Perjalanan";
  return "Draft";
}

/** Nomor distribusi berikutnya = nomor terbesar + 1 */
export function nextDistribusiId(items: DistribusiDetail[]) {
  const max = items.reduce((m, d) => {
    const n = Number(d.id.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `DIST-2026-${String(max + 1).padStart(3, "0")}`;
}

/** Surat jalan hanya ada setelah distribusi dikirim */
export function suratJalanId(distId: string) {
  return `SJ-${distId.replace("DIST-", "")}`;
}

export function suratJalanTerbit(d: DistribusiDetail) {
  return distribusiStatus(d) !== "Draft";
}

export type DistribusiDetail = {
  id: string;
  tanggal: string;
  dari: string;
  ke: string;
  items: number;
  status: string;
  driver?: string;
  waktuKirim?: string;
  waktuTerima?: string;
  /** Catatan hasil terima barang (diisi saat konfirmasi di mobile) */
  terima?: TerimaRecord;
  /** Ajuan stok yang memicu distribusi ini (kalau dibuat dari approval ajuan) */
  refAjuan?: string;
  lines: DistLine[];
};

function distLine(kode: string, qty: number): DistLine {
  const p = MOCK_PRODUK.find((x) => x.kode === kode);
  return { kode, nama: p?.nama ?? kode, qty };
}

/** Bahan contoh surat jalan: qty kirim + hasil terima (kalau sudah diterima) */
type SeedLine = { kode: string; qty: number; terima?: number; bocor?: number };
type SeedKirim = {
  driver?: string;
  waktuKirim?: string;
  /** Ada isinya = surat jalan sudah diterima cabang (dipakai mengisi riwayat) */
  terimaWaktu?: string;
  terimaOleh?: string;
  lines: SeedLine[];
};

const SEED_KIRIM: Record<string, SeedKirim> = {
  "DIST-2026-018": {
    driver: "Budi Kurir",
    waktuKirim: "2026-09-07T08:00:00",
    terimaWaktu: "2026-09-07T14:30:00",
    terimaOleh: "Rina Admin Cabang",
    lines: [
      { kode: "AXT-207", qty: 10 },
      { kode: "AXT-814", qty: 8 },
      { kode: "AXT-910", qty: 6 },
    ],
  },
  "DIST-2026-019": {
    driver: "Agus Logistik",
    waktuKirim: "2026-09-08T07:30:00",
    terimaWaktu: "2026-09-08T16:00:00",
    terimaOleh: "Dedi Admin Malang",
    lines: [
      { kode: "AXT-207", qty: 6 },
      { kode: "AXT-101", qty: 4 },
      { kode: "AXT-814", qty: 2 },
    ],
  },
  /* Contoh yang masih Draft: belum ada waktu kirim & driver */
  "DIST-2026-020": {
    lines: [
      { kode: "AXT-207", qty: 8 },
      { kode: "AXT-910", qty: 10 },
    ],
  },
  "DIST-2026-021": {
    driver: "Joko Kurir",
    waktuKirim: "2026-09-26T07:00:00",
    lines: [
      { kode: "AXT-207", qty: 8 },
      { kode: "AXT-814", qty: 6 },
      { kode: "AXT-101", qty: 12 },
    ],
  },
  "DIST-2026-022": {
    driver: "Rudi Kurir",
    waktuKirim: "2026-09-25T08:00:00",
    lines: [
      { kode: "AXT-814", qty: 4 },
      { kode: "AXT-910", qty: 6 },
    ],
  },
  "DIST-2026-023": {
    driver: "Samsul Kurir",
    waktuKirim: "2026-09-24T07:30:00",
    lines: [
      { kode: "AXT-207", qty: 5 },
      { kode: "AXT-101", qty: 7 },
      { kode: "AXT-501", qty: 3 },
    ],
  },
  "DIST-2026-024": {
    driver: "-",
    waktuKirim: "2026-09-23T09:00:00",
    lines: [
      { kode: "AXT-203", qty: 10 },
      { kode: "AXT-60", qty: 4 },
    ],
  },
  "DIST-2026-025": {
    driver: "Agus Logistik",
    waktuKirim: "2026-09-22T07:00:00",
    terimaWaktu: "2026-09-22T15:20:00",
    terimaOleh: "Dedi Admin Malang",
    lines: [
      { kode: "AXT-207", qty: 9, terima: 7, bocor: 300 },
      { kode: "AXT-814", qty: 5 },
    ],
  },
  "DIST-2026-026": {
    driver: "Budi Kurir",
    waktuKirim: "2026-09-20T08:00:00",
    terimaWaktu: "2026-09-20T13:45:00",
    terimaOleh: "Rina Admin Cabang",
    lines: [
      { kode: "AXT-101", qty: 6 },
      { kode: "AXT-207", qty: 4 },
    ],
  },
  /* Draft juga — biar tiga status kelihatan di daftar */
  "DIST-2026-027": {
    lines: [
      { kode: "AXT-910", qty: 8 },
      { kode: "AXT-814", qty: 2 },
    ],
  },
  "DIST-2026-028": {
    driver: "Joko Kurir",
    waktuKirim: "2026-09-15T08:00:00",
    terimaWaktu: "2026-09-15T14:10:00",
    terimaOleh: "Rina Admin Cabang",
    lines: [
      { kode: "AXT-203", qty: 6, terima: 5 },
      { kode: "AXT-501", qty: 3 },
    ],
  },
  "DIST-2026-029": {
    driver: "Rudi Kurir",
    waktuKirim: "2026-09-12T07:30:00",
    lines: [
      { kode: "AXT-60", qty: 12 },
      { kode: "AXT-203", qty: 3 },
    ],
  },
  "DIST-2026-030": {
    driver: "Budi Kurir",
    waktuKirim: "2026-09-10T08:00:00",
    lines: [
      { kode: "AXT-101", qty: 15 },
      { kode: "AXT-814", qty: 8 },
      { kode: "AXT-910", qty: 4 },
    ],
  },
};

function terimaDariSeed(rows: SeedLine[], oleh: string, waktu: string): TerimaRecord {
  return {
    oleh,
    waktu,
    lines: rows.map((l) => {
      const terima = Math.min(Math.max(0, l.terima ?? l.qty), l.qty);
      return {
        kode: l.kode,
        nama: MOCK_PRODUK.find((p) => p.kode === l.kode)?.nama ?? l.kode,
        qtyKirim: l.qty,
        qtyTerima: terima,
        kurangUnit: l.qty - terima,
        bocorGram: Math.max(0, l.bocor ?? 0),
      };
    }),
  };
}

export const INITIAL_DISTRIBUSI: DistribusiDetail[] = MOCK_DISTRIBUSI.map((d) => {
  const seed = SEED_KIRIM[d.id];
  const lines = (seed?.lines ?? []).map((l) => distLine(l.kode, l.qty));
  const terima =
    seed?.terimaWaktu && seed?.terimaOleh
      ? terimaDariSeed(seed.lines, seed.terimaOleh, seed.terimaWaktu)
      : undefined;
  return {
    ...d,
    driver: seed?.driver,
    waktuKirim: seed?.waktuKirim,
    waktuTerima: seed?.terimaWaktu,
    terima,
    lines,
  };
});

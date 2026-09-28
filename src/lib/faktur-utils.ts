import type { OpbRow } from "./mock-data";
import type { HutangPiutangDetail } from "./hutang-piutang-utils";

/** Status tersimpan · Draft → Posted (AR) → Terkirim (invoice dikirim ke pelanggan) */
export type FakturStatus = "Draft" | "Posted" | "Terkirim";

export type KirimInvoiceInfo = {
  tanggal: string;
  /** Email · WhatsApp · Kurir · Cetak/Manual */
  metode: string;
  catatan?: string;
  oleh: string;
};

/** Hasil rekonsiliasi Finance: invoice dicocokkan dengan OPB yang sudah terbit */
export type RekonsiliasiInvoiceInfo = {
  oleh: string;
  waktu: string;
  totalInvoice: number;
  totalOpb: number;
  jumlahNota: number;
  selisih: number;
  catatan?: string;
};

export type FakturJualRow = {
  id: string;
  tanggal: string;
  pelanggan: string;
  periode: string;
  total: number;
  status: FakturStatus | string;
  opbId?: string;
  jurnalId?: string;
  /** Format cetak (#57): Faktur Penjualan vs Rekap Invoice */
  jenis?: string;
  kirim?: KirimInvoiceInfo;
  rekonsiliasi?: RekonsiliasiInvoiceInfo;
};

/** Tampilan status di layar: Lunas / Bayar Sebagian diturunkan dari piutang, bukan disimpan */
export type FakturStatusView = "Draft" | "Posted" | "Terkirim" | "Bayar Sebagian" | "Lunas";

export function fakturStatusView(faktur: FakturJualRow, piutang?: HutangPiutangDetail): FakturStatusView {
  if (piutang) {
    if (piutang.sisa <= 0) return "Lunas";
    if (piutang.sisa < piutang.total) return "Bayar Sebagian";
  }
  if (faktur.status === "Terkirim") return "Terkirim";
  if (faktur.status === "Posted") return "Posted";
  return "Draft";
}

export function fakturTerekonsiliasi(faktur: FakturJualRow) {
  return !!faktur.rekonsiliasi;
}

/** Invoice boleh dikirim setelah direkonsiliasi dengan OPB */
export function fakturSiapKirim(faktur: FakturJualRow) {
  return fakturTerekonsiliasi(faktur) && faktur.status !== "Terkirim" && faktur.status !== "Draft";
}

export function findOpbForFaktur(faktur: FakturJualRow, opbList: OpbRow[]): OpbRow | undefined {
  if (faktur.opbId) return opbList.find((o) => o.id === faktur.opbId);
  return opbList.find((o) => o.cabang.includes(faktur.pelanggan.split(" ")[0]) && o.periode === faktur.periode)
    ?? opbList.find((o) => o.cabang === faktur.pelanggan || o.cabang.includes(faktur.pelanggan));
}

export function fakturSlug(id: string) {
  return id.toLowerCase();
}

export function fakturFromSlug(slug: string) {
  return slug.toUpperCase();
}

/** Nomor faktur penjualan berikutnya · INV-2026-0xxx */
export function nextFakturJualId(items: FakturJualRow[]) {
  const max = items.reduce((m, f) => {
    const n = Number(f.id.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `INV-2026-${String(max + 1).padStart(4, "0")}`;
}

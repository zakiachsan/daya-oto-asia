/**
 * ID transaksi internal · format DOA-<KODE CABANG>-<ddMMyy>-<urut harian>
 *
 * Contoh DOA-STR-020326-001:
 *   STR    = kode 3 huruf cabang (Master Cabang → field Kode)
 *   020326 = tanggal transaksi 2 Mar 2026 (ddMMyy)
 *   001    = nomor urut transaksi cabang itu pada tanggal tersebut, reset tiap hari
 *
 * ID nota (Receipt ID) tetap RCP-DOA-… dan tidak ikut format ini.
 */

import { normalizeKodeCabang } from "./cabang-utils";

export const DOA_TRX_ID_PATTERN = /^DOA-([A-Z]{3})-(\d{6})-(\d{3})$/;

/** ddMMyy · 2 Mar 2026 → "020326" */
export function tanggalTransaksiToken(tanggal: Date = new Date()) {
  const dd = String(tanggal.getDate()).padStart(2, "0");
  const mm = String(tanggal.getMonth() + 1).padStart(2, "0");
  const yy = String(tanggal.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

/** Nomor urut berikutnya, dihitung dari ID yang sudah ada (cabang + tanggal sama) */
export function nextDoaTransaksiUrut(ids: string[], kodeCabang: string, tanggal: Date = new Date()) {
  const kode = normalizeKodeCabang(kodeCabang, "");
  const token = tanggalTransaksiToken(tanggal);
  let maks = 0;
  for (const id of ids) {
    const m = /^DOA-([A-Z]{3})-(\d{6})-(\d{3,})$/.exec(String(id ?? "").trim().toUpperCase());
    if (!m) continue;
    if (m[1] !== kode || m[2] !== token) continue;
    maks = Math.max(maks, Number(m[3]));
  }
  return maks + 1;
}

export function formatDoaTransaksiId(params: { kodeCabang: string; urut: number; tanggal?: Date }) {
  const kode = normalizeKodeCabang(params.kodeCabang, "");
  const token = tanggalTransaksiToken(params.tanggal);
  const urut = String(Math.max(1, Math.floor(params.urut))).padStart(3, "0");
  return `DOA-${kode}-${token}-${urut}`;
}

/** ID baru untuk transaksi cabang tertentu · urut harian dihitung dari ID yang sudah ada */
export function createDoaTransaksiId(params: {
  kodeCabang: string;
  existingIds?: string[];
  tanggal?: Date;
}) {
  const urut = nextDoaTransaksiUrut(params.existingIds ?? [], params.kodeCabang, params.tanggal);
  return formatDoaTransaksiId({ kodeCabang: params.kodeCabang, urut, tanggal: params.tanggal });
}

export function isDoaTransaksiId(id: string) {
  const raw = String(id ?? "").trim().toUpperCase();
  return DOA_TRX_ID_PATTERN.test(raw) || /^DOA-\d{4}-\d{4}$/.test(raw) || /^DOA-\d{2}\d{2}-\d{4}$/.test(raw);
}

/**
 * Normalisasi ID lama ke bentuk yang berlaku sekarang.
 * ID format baru diteruskan apa adanya; ID legacy (TRX-…, DOA-2026-…, DOA-ddyy-…) tetap valid
 * supaya data localStorage yang sudah tersimpan tidak putus.
 */
export function normalizeTransaksiId(id: string) {
  const raw = String(id ?? "").trim();
  if (raw.startsWith("TRX-")) return raw.replace(/^TRX-/, "DOA-");
  if (DOA_TRX_ID_PATTERN.test(raw.toUpperCase())) return raw.toUpperCase();
  if (/^DOA-\d{4}-\d{4}$/.test(raw)) return raw;
  if (/^DOA-2026-/.test(raw)) {
    const tail = raw.replace(/^DOA-2026-/, "");
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    return `DOA-${dd}${yy}-${tail.padStart(4, "0").slice(-4)}`;
  }
  return raw;
}

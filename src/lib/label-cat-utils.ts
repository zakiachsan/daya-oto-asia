/**
 * Label cat · satu label per batch pembuatan bahan (basecoat, clear coat, thinner, putty, dst).
 *
 * Aturan yang dipakai sekarang (feedback klien 26 Okt 2026):
 * - Semua bahan boleh dicetak label, tapi DEFAULT-nya basecoat karena itu yang dipakai di lapangan.
 * - Data label WAJIB diambil dari baris bahan itu sendiri (kode warna, warna, kategori), bukan dari
 *   field level transaksi yang ikut berubah jadi bahan terakhir yang ditambahkan.
 */

import type { TransaksiRow } from "./mock-data";
import { PRODUK_KATEGORI, type ProdukKategoriId } from "./transaksi-status-utils";
import { printHtmlDocument } from "./print-doc-utils";

export type LabelLine = {
  key: string;
  produkKategori: ProdukKategoriId;
  kodeWarna: string;
  warna: string;
  /** Teks kategori yang tampil di label, mis. "Base coat" / "Clear Coat" */
  kategoriLabel: string;
  isBasecoat: boolean;
};

function kategoriLabel(produkKategori: ProdukKategoriId | undefined, fallback?: string | null) {
  const ketemu = PRODUK_KATEGORI.find((p) => p.id === produkKategori);
  return ketemu?.label ?? (fallback || "Bahan");
}

/** Daftar bahan yang punya label · basecoat selalu di urutan pertama (default) */
export function labelLinesForTrx(trx: TransaksiRow): LabelLine[] {
  const lines = trx.produkLines ?? [];

  if (lines.length > 0) {
    const hasil: LabelLine[] = lines.map((line, idx) => {
      const produk = line.produkKategori ?? "basecoat";
      return {
        key: `${produk}-${idx}-${line.kodeWarna}`,
        produkKategori: produk,
        kodeWarna: line.kodeWarna || "-",
        warna: line.warna || "-",
        kategoriLabel: kategoriLabel(produk, line.kategori),
        isBasecoat: produk === "basecoat",
      };
    });
    /* basecoat dulu · sisanya ikut urutan input */
    return [...hasil.filter((l) => l.isBasecoat), ...hasil.filter((l) => !l.isBasecoat)];
  }

  /* Transaksi lama satu bahan · anggap basecoat (yang biasa dicetak) */
  const produk = trx.produkKategori ?? "basecoat";
  return [
    {
      key: `single-${produk}`,
      produkKategori: produk,
      kodeWarna: trx.kodeWarna || "-",
      warna: trx.warna || "-",
      kategoriLabel: kategoriLabel(produk, trx.kategori),
      isBasecoat: produk === "basecoat",
    },
  ];
}

/** Label default yang dipakai saat pertama dibuka · basecoat kalau ada */
export function labelDefaultForTrx(trx: TransaksiRow): LabelLine {
  const lines = labelLinesForTrx(trx);
  return lines.find((l) => l.isBasecoat) ?? lines[0];
}

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function labelWaktu(trx: TransaksiRow) {
  const stamp = trx.waktuCetakLabel ?? trx.waktuMulai ?? trx.waktuCetakNota;
  if (!stamp) return trx.tanggal;
  const d = new Date(stamp);
  if (Number.isNaN(d.getTime())) return trx.tanggal;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** HTML label siap cetak · ukuran stiker 280px, sama dengan preview di app */
export function labelHtmlForLine(trx: TransaksiRow, line: LabelLine) {
  return `<div style="width:280px;padding:12px;border:2px dashed #9ca3af;font-family:system-ui,Arial,sans-serif;color:#000">
  <p style="font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#6b7280;margin:0">PT Daya Oto Asia</p>
  <p style="font-size:13px;font-weight:700;margin:4px 0 0">${esc(labelWaktu(trx))}</p>
  <p style="font-size:12px;font-weight:600;margin:4px 0 0">${esc(trx.mobil || "-")}</p>
  <p style="font-size:11px;font-family:ui-monospace,Consolas,monospace;font-weight:700;color:#0b7fb0;margin:2px 0 0">${esc(
    line.kodeWarna,
  )} &middot; ${esc(line.warna)}</p>
  <p style="font-size:10px;color:#374151;margin:2px 0 0">${esc(line.kategoriLabel)}</p>
  <p style="font-size:10px;color:#6b7280;margin:8px 0 0">Tinter: ${esc(trx.tinter || "-")}</p>
  <p style="font-size:9px;font-family:ui-monospace,Consolas,monospace;color:#9ca3af;margin:4px 0 0">${esc(trx.id)}</p>
</div>`;
}

export function printLabelCat(trx: TransaksiRow, line: LabelLine) {
  printHtmlDocument(
    `Label ${line.kategoriLabel} ${line.kodeWarna} · ${trx.id}`,
    labelHtmlForLine(trx, line),
    `body{margin:8mm;font-family:system-ui,Arial,sans-serif}`,
  );
}

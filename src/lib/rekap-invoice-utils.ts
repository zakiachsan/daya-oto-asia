import type { OpbRow, TransaksiRow } from "./mock-data";
import { formatRpJumlah } from "./nota-bogor-tarif";

/** PPN 11% · dari perbandingan kolom scan referensi */
export const REKAP_PPN_RATE = 0.11;

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export type RekapInvoiceLine = {
  no: number;
  tanggal: string;
  noPolisi: string;
  noSap: string;
  totalHarga: number;
  totalPpn: number;
  fromTrx?: boolean;
};

export function formatRekapTanggal(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  const bulan = BULAN_SINGKAT[Number(m) - 1] ?? m;
  return `${Number(d)}-${bulan}-${y.slice(-2)}`;
}

export function formatRekapRp(n: number) {
  return formatRpJumlah(n);
}

export function formatRekapRpLabel(n: number) {
  return `Rp ${formatRekapRp(n)}`;
}

export function calcTotalWithPpn(dpp: number) {
  return Math.round(dpp * (1 + REKAP_PPN_RATE));
}

/** No. SAP 10 digit · pola scan 5502529599 */
export function rekapSapNoFromTrx(trx: Pick<TransaksiRow, "id">) {
  const tail = trx.id.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `55025${tail}`;
}

export function rekapSapNoSynthetic(seed: number) {
  return String(5502500000 + seed * 137).slice(0, 10);
}

export function formatPlatRekap(plat: string) {
  return plat.replace(/\s+/g, "").toUpperCase();
}

/**
 * Nama pelanggan di baris judul rekap · persis contoh resmi Tim Finance
 * ("PT. ASTRA DAIHATSU INTERNATIONAL SURABAYA WARU", WhatsApp 28 Sep 2026).
 * Kota lain belum ada contohnya — pakai "… <KOTA>" sampai Tim Finance kirim daftar resmi.
 */
export const ASTRA_REKAP_NAMA: Record<string, string> = {
  Surabaya: "PT. ASTRA DAIHATSU INTERNATIONAL SURABAYA WARU",
  Malang: "PT. ASTRA DAIHATSU INTERNATIONAL MALANG",
  Jember: "PT. ASTRA DAIHATSU INTERNATIONAL JEMBER",
  Kediri: "PT. ASTRA DAIHATSU INTERNATIONAL KEDIRI",
};

export function astraPelangganRekap(cabang: string) {
  const kota = Object.keys(ASTRA_REKAP_NAMA).find((k) => cabang.toLowerCase().includes(k.toLowerCase()));
  return kota ? ASTRA_REKAP_NAMA[kota] : "PT. ASTRA DAIHATSU INTERNATIONAL SURABAYA WARU";
}

function cabangMatches(opbCabang: string, trxCabang: string) {
  const parts = opbCabang.split(/\s+/).filter((w) => w.length > 3);
  return parts.some((p) => trxCabang.toLowerCase().includes(p.toLowerCase()));
}

/** "Agustus 2026" → { bulan: 8, tahun: 2026 } · dipakai rekap & nomor invoice DOA */
export function parsePeriodeMonth(periode: string) {
  const map: Record<string, number> = {
    Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6,
    Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12,
  };
  const bulanNama = periode.split(" ")[0];
  const tahun = Number(periode.split(" ")[1]) || 2026;
  return { bulan: map[bulanNama] ?? 8, tahun };
}

const SYNTH_PLAT = [
  "B1446PDL", "B1591QWE", "B1154ZMJ", "B2110UIC", "B1098RZG",
  "L1234ABC", "L3456DEF", "N5678XY", "P9012JK", "B1823KLM",
];

/**
 * Nota (transaksi Selesai) milik satu OPB · dipakai rekap, invoice & rekonsiliasi Finance.
 * Sengaja TIDAK difilter per bulan: OPB dibuat dari seluruh transaksi Selesai cabang
 * (lihat handleGenerate di /operasional/opb), jadi periode cuma label — invoice harus
 * memakai kumpulan nota yang sama dengan OPB-nya.
 */
export function notaForOpb(opb: OpbRow, transaksi: TransaksiRow[]) {
  return transaksi
    .filter((t) => t.status === "Selesai" && cabangMatches(opb.cabang, t.cabang))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

/** Baris rekap · transaksi real + synthetic pad sampai jumlahTrx OPB */
export function buildRekapInvoiceLines(opb: OpbRow, transaksi: TransaksiRow[]): RekapInvoiceLine[] {
  const real = notaForOpb(opb, transaksi);

  const { bulan, tahun } = parsePeriodeMonth(opb.periode);
  const targetCount = Math.max(opb.jumlahTrx, real.length, 1);
  const avgDpp = Math.round(opb.total / targetCount);

  const lines: RekapInvoiceLine[] = [];
  let dppSum = 0;

  for (let i = 0; i < targetCount; i++) {
    const trx = real[i];
    if (trx) {
      const dpp = trx.total;
      dppSum += dpp;
      lines.push({
        no: i + 1,
        tanggal: formatRekapTanggal(trx.tanggal),
        noPolisi: formatPlatRekap(trx.platNomor),
        noSap: rekapSapNoFromTrx(trx),
        totalHarga: dpp,
        totalPpn: calcTotalWithPpn(dpp),
        fromTrx: true,
      });
      continue;
    }

    const day = ((i * 3) % 28) + 1;
    const iso = `${tahun}-${String(bulan).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const variance = ((i * 17) % 5) - 2;
    let dpp = Math.max(85000, avgDpp + variance * 12000);
    if (i === targetCount - 1) {
      dpp = Math.max(85000, opb.total - dppSum);
    }
    dppSum += dpp;

    lines.push({
      no: i + 1,
      tanggal: formatRekapTanggal(iso),
      noPolisi: SYNTH_PLAT[i % SYNTH_PLAT.length],
      noSap: rekapSapNoSynthetic(i + 1),
      totalHarga: dpp,
      totalPpn: calcTotalWithPpn(dpp),
    });
  }

  return lines;
}

/**
 * Total baris bawah rekap.
 * Kolom "+ PPN" DIHITUNG dari total harga (bukan jumlah PPN per baris): di contoh
 * resmi Tim Finance total 13.389.700 → 14.862.567 = total × 1,11 (jumlah PPN per baris
 * menghasilkan 14.862.571, beda 4 rupiah). Sekalian bikin Grand Total rekap sama
 * dengan Grand Total invoice.
 */
export function rekapInvoiceTotals(lines: RekapInvoiceLine[]) {
  const totalHarga = lines.reduce((s, l) => s + l.totalHarga, 0);
  return { totalHarga, totalPpn: calcTotalWithPpn(totalHarga) };
}

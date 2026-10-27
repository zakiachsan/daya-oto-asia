/**
 * Komisi bengkel · aturan klien (docs/PLAN-komisi-bengkel.md)
 *
 * - Kepala Bengkel = 5% dari DPP/OPB sebelum PPN, hanya OPB yang sudah masuk faktur.
 * - Tinter         = Rp 1.000 × jumlah nota di dalam OPB (angka OPB, per cabang).
 * - GH Head Vendor / Tukang Cat / Admin Astra = nominal manual per cabang per bulan.
 *
 * Semua angka dihitung dari data yang sudah ada (OPB + faktur + transaksi); tidak ada
 * nilai komisi yang disimpan kecuali input manual dan snapshot saat periode ditutup.
 */

import { cabangShort, normalizeKodeCabang, type CabangRow } from "./cabang-utils";
import type { OpbRow, TransaksiRow } from "./mock-data";
import { accountName, type JurnalDetail } from "./jurnal-utils";

export const KOMISI_KEPALA_RATE = 0.05;
export const KOMISI_TINTER_PER_NOTA = 1000;

export type KomisiPihakManual = "gh-head-vendor" | "tukang-cat" | "admin-astra";

/** Tiga pihak yang nominalnya diisi manual tiap bulan (urutan tampil di tabel & form) */
export const KOMISI_PIHAK: { id: KomisiPihakManual; label: string }[] = [
  { id: "gh-head-vendor", label: "GH Head Vendor" },
  { id: "tukang-cat", label: "Tukang Cat" },
  { id: "admin-astra", label: "Admin Astra" },
];

export function labelKomisiPihak(pihak: KomisiPihakManual) {
  return KOMISI_PIHAK.find((p) => p.id === pihak)?.label ?? pihak;
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** "2026-08" → "Agustus 2026" (format yang dipakai OpbRow.periode) */
export function periodeLabelFromKey(key: string) {
  const [tahun, bulan] = String(key ?? "").split("-");
  const idx = Number(bulan) - 1;
  if (!tahun || idx < 0 || idx > 11) return String(key ?? "");
  return `${BULAN[idx]} ${tahun}`;
}

/** "Agustus 2026" → "2026-08" */
export function periodeKeyFromLabel(label: string) {
  const parts = String(label ?? "").trim().split(/\s+/);
  const idx = BULAN.findIndex((b) => b.toLowerCase() === (parts[0] ?? "").toLowerCase());
  const tahun = parts[1] ?? "";
  if (idx < 0 || !tahun) return "";
  return `${tahun}-${String(idx + 1).padStart(2, "0")}`;
}

/** "2026-09-26" / Date → "2026-09" */
export function periodeKeyFromDate(tanggal: string | Date = new Date()) {
  if (tanggal instanceof Date) {
    return `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, "0")}`;
  }
  return String(tanggal).slice(0, 7);
}

/** Bulan berjalan (dipakai sebagai default filter) */
export function periodeBerjalan() {
  return periodeKeyFromDate(new Date());
}

function normCabang(value: string) {
  return cabangShort(String(value ?? "")).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Nama cabang OPB/transaksi ("Auto 2000 Surabaya") vs master ("Bengkel Auto 2000 Surabaya") */
export function samaCabangSatu(a: string, b: string) {
  return normCabang(a) === normCabang(b);
}

/**
 * OPB yang dihitung komisinya = OPB berstatus `Ditagihkan`.
 * Status ini yang menandai OPB sudah difakturkan (Generate Invoice di Finance juga menaikkannya ke Ditagihkan),
 * jadi tidak dipakai lagi cek faktur terpisah: faktur draft bisa ada tanpa OPB-nya benar-benar ditagihkan.
 */
export function opbDihitungKomisi(opb: OpbRow) {
  return opb.status === "Ditagihkan";
}

export type KomisiManualInput = {
  cabang: string;
  periode: string;
  pihak: KomisiPihakManual;
  nominal: number;
};

export type KomisiCabangRow = {
  cabang: string;
  kodeCabang: string;
  kepalaBengkel: string;
  /** OPB yang dihitung (id dipisah koma kalau lebih dari satu) */
  opbId: string;
  opbStatus: string;
  /** true = OPB sudah masuk faktur, komisi dihitung */
  dihitung: boolean;
  jumlahNota: number;
  dpp: number;
  komisiKepala: number;
  komisiTinter: number;
  manual: Record<KomisiPihakManual, number>;
  /** Nama penerima tiap pihak manual · dari Master Cabang (bisa kosong) */
  pihakNama: Record<KomisiPihakManual, string>;
  total: number;
  /** Keterangan untuk cabang yang belum punya OPB / belum difakturkan */
  info: string;
};

export type KomisiBulanTotals = {
  jumlahNota: number;
  dpp: number;
  komisiKepala: number;
  komisiTinter: number;
  manual: Record<KomisiPihakManual, number>;
  total: number;
  jumlahCabang: number;
};

function manualMap(manual: KomisiManualInput[], cabang: string, periode: string) {
  const out: Record<KomisiPihakManual, number> = { "gh-head-vendor": 0, "tukang-cat": 0, "admin-astra": 0 };
  for (const row of manual) {
    if (row.periode !== periode) continue;
    if (!samaCabangSatu(row.cabang, cabang)) continue;
    out[row.pihak] = Number(row.nominal) || 0;
  }
  return out;
}

function statusLabel(status: string) {
  return status === "Menunggu TTD" ? "Proses Invoice" : status;
}

/** Komisi satu cabang untuk satu periode */
export function hitungKomisiCabang(params: {
  cabang: CabangRow;
  periodeKey: string;
  opb: OpbRow[];
  manual: KomisiManualInput[];
}): KomisiCabangRow {
  const { cabang, periodeKey, opb, manual } = params;
  const periodeLabel = periodeLabelFromKey(periodeKey);

  const opbCabang = opb.filter(
    (o) => samaCabangSatu(o.cabang, cabang.nama) && periodeKeyFromLabel(o.periode) === periodeKey,
  );
  const opbDihitung = opbCabang.filter(opbDihitungKomisi);

  const dpp = opbDihitung.reduce((s, o) => s + Number(o.total || 0), 0);
  const jumlahNota = opbDihitung.reduce((s, o) => s + Number(o.jumlahTrx || 0), 0);
  const nomorOpb = (opbDihitung.length ? opbDihitung : opbCabang).map((o) => o.id).join(", ");
  const statusOpb = opbCabang.length
    ? [...new Set(opbCabang.map((o) => statusLabel(String(o.status))))].join(" · ")
    : "-";

  const manualNominal = manualMap(manual, cabang.nama, periodeKey);
  const pihakNama: Record<KomisiPihakManual, string> = {
    "gh-head-vendor": (cabang.ghHeadVendor ?? "").trim(),
    "tukang-cat": (cabang.tukangCat ?? "").trim(),
    "admin-astra": (cabang.adminAstra ?? "").trim(),
  };
  const komisiKepala = Math.round(dpp * KOMISI_KEPALA_RATE);
  const komisiTinter = jumlahNota * KOMISI_TINTER_PER_NOTA;
  const totalManual = Object.values(manualNominal).reduce((s, n) => s + n, 0);

  let info = "";
  if (!opbCabang.length) info = `Belum ada OPB periode ${periodeLabel}`;
  else if (!opbDihitung.length) info = `Belum difakturkan · ${statusOpb}`;

  return {
    cabang: cabang.nama,
    kodeCabang: normalizeKodeCabang(cabang.kode, cabang.nama),
    kepalaBengkel: (cabang.kepalaBengkel ?? "").trim(),
    opbId: nomorOpb || "-",
    opbStatus: statusOpb,
    dihitung: opbDihitung.length > 0,
    jumlahNota,
    dpp,
    komisiKepala,
    komisiTinter,
    manual: manualNominal,
    pihakNama,
    total: komisiKepala + komisiTinter + totalManual,
    info,
  };
}

/** Semua cabang untuk satu periode + total keseluruhan */
export function hitungKomisiBulan(params: {
  periodeKey: string;
  cabang: CabangRow[];
  opb: OpbRow[];
  manual: KomisiManualInput[];
}) {
  const rows = params.cabang.map((c) =>
    hitungKomisiCabang({
      cabang: c,
      periodeKey: params.periodeKey,
      opb: params.opb,
      manual: params.manual,
    }),
  );

  const totals: KomisiBulanTotals = rows.reduce<KomisiBulanTotals>(
    (acc, row) => ({
      jumlahNota: acc.jumlahNota + row.jumlahNota,
      dpp: acc.dpp + row.dpp,
      komisiKepala: acc.komisiKepala + row.komisiKepala,
      komisiTinter: acc.komisiTinter + row.komisiTinter,
      manual: {
        "gh-head-vendor": acc.manual["gh-head-vendor"] + row.manual["gh-head-vendor"],
        "tukang-cat": acc.manual["tukang-cat"] + row.manual["tukang-cat"],
        "admin-astra": acc.manual["admin-astra"] + row.manual["admin-astra"],
      },
      total: acc.total + row.total,
      jumlahCabang: acc.jumlahCabang + (row.dihitung ? 1 : 0),
    }),
    {
      jumlahNota: 0,
      dpp: 0,
      komisiKepala: 0,
      komisiTinter: 0,
      manual: { "gh-head-vendor": 0, "tukang-cat": 0, "admin-astra": 0 },
      total: 0,
      jumlahCabang: 0,
    },
  );

  return { rows, totals };
}

export type KomisiTinterRow = { tinter: string; jumlahNota: number; nilai: number };

/**
 * Rincian komisi per tinter dari nota nyata (bukan baris sintetis OPB).
 * Dipakai di halaman detail; jumlahnya bisa beda dengan OPB.jumlahTrx dan selisihnya
 * ditampilkan apa adanya, bukan dipaksa sama.
 */
export function rincianKomisiTinter(params: {
  cabang: string;
  periodeKey: string;
  transaksi: TransaksiRow[];
}): { rows: KomisiTinterRow[]; totalNota: number } {
  const perTinter = new Map<string, number>();
  for (const t of params.transaksi) {
    if (!String(t.tanggal ?? "").startsWith(params.periodeKey)) continue;
    if (!samaCabangSatu(String(t.cabang ?? ""), params.cabang)) continue;
    if (t.status === "Draft" || t.status === "Dibatalkan") continue;
    const nama = (t.tinter ?? "").trim() || "Tanpa tinter";
    perTinter.set(nama, (perTinter.get(nama) ?? 0) + 1);
  }

  const rows: KomisiTinterRow[] = [...perTinter.entries()]
    .map(([tinter, jumlahNota]) => ({ tinter, jumlahNota, nilai: jumlahNota * KOMISI_TINTER_PER_NOTA }))
    .sort((a, b) => b.jumlahNota - a.jumlahNota || a.tinter.localeCompare(b.tinter));

  return { rows, totalNota: rows.reduce((s, r) => s + r.jumlahNota, 0) };
}

/** Daftar periode yang sudah ada OPB-nya (terbaru dulu) untuk default filter */
export function periodeTersedia(opb: OpbRow[]) {
  const keys = new Set<string>();
  for (const o of opb) {
    const key = periodeKeyFromLabel(o.periode);
    if (key) keys.add(key);
  }
  return [...keys].sort((a, b) => b.localeCompare(a));
}

/* ------------------------------------------------------------------------------------------------
 * Jurnal komisi (diposting manual setelah periode ditutup)
 * Dr Beban Komisi Bengkel / Cr Hutang Komisi · satu jurnal per periode.
 * ---------------------------------------------------------------------------------------------- */

export const COA_KOMISI = {
  BEBAN: "510201",
  HUTANG: "210201",
} as const;

/** JU/<tahun>/<bulan>/<urut> · nomor urut per bulan, tidak menabrak jurnal lain */
function nextJurnalIdForPeriode(jurnalList: JurnalDetail[], periodeKey: string) {
  const [tahun, bulan] = String(periodeKey).split("-");
  const prefix = `JU/${tahun}/${bulan}/`;
  const maks = jurnalList.reduce((m, j) => {
    if (!String(j.id).startsWith(prefix)) return m;
    const n = Number(String(j.id).slice(prefix.length));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}${String(maks + 1).padStart(3, "0")}`;
}

/** Jurnal beban komisi untuk satu periode · null kalau total komisi 0 */
export function buildKomisiJurnal(params: {
  periodeKey: string;
  rows: KomisiCabangRow[];
  jurnalList: JurnalDetail[];
  tanggal?: string;
}): JurnalDetail | null {
  const total = params.rows.reduce((s, r) => s + Number(r.total || 0), 0);
  if (total <= 0) return null;

  const bengkel = params.rows.filter((r) => r.total > 0);
  const periodeLabel = periodeLabelFromKey(params.periodeKey);
  const tanggal = params.tanggal ?? new Date().toISOString().slice(0, 10);
  const kodeList = bengkel.map((r) => r.kodeCabang).join(", ");

  return {
    id: nextJurnalIdForPeriode(params.jurnalList, params.periodeKey),
    tanggal,
    keterangan: `Komisi bengkel ${periodeLabel} · ${bengkel.length} bengkel${kodeList ? ` (${kodeList})` : ""}`,
    debit: total,
    kredit: total,
    status: "Posted",
    sourceType: "komisi-bengkel",
    refKomisi: params.periodeKey,
    lines: [
      { accountKode: COA_KOMISI.BEBAN, accountNama: accountName(COA_KOMISI.BEBAN), debit: total, credit: 0 },
      { accountKode: COA_KOMISI.HUTANG, accountNama: accountName(COA_KOMISI.HUTANG), debit: 0, credit: total },
    ],
  };
}

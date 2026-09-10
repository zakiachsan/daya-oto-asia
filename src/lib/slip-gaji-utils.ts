import { MOCK_KARYAWAN, MOCK_LEMBUR } from "./mock-data";
import { calcPotonganAbsensi, calcSlipTotals, WORKDAYS_IN_MONTH } from "./hr-payroll";
import { slugify } from "./preview-store";

export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const TELAT_MAP: Record<string, number> = { "Andi Wijaya": 1, "Rudi Hartono": 0, "Eko Prasetyo": 2 };
const ALPHA_MAP: Record<string, number> = { "Andi Wijaya": 0, "Rudi Hartono": 0, "Eko Prasetyo": 1 };

export type SlipDetail = {
  nama: string;
  cabang: string;
  cabangFull: string;
  bulan: string;
  gajiPokok: number;
  tunjangan: number;
  lembur: number;
  jamLembur: number;
  potongan: number;
  telat: number;
  alpha: number;
  pph21: number;
  bruto: number;
  bersih: number;
  status: string;
  lemburEntries: typeof MOCK_LEMBUR;
};

export function buildSlipForKaryawan(nama: string, monthIndex: number, finalized = false): SlipDetail | undefined {
  const k = MOCK_KARYAWAN.find((x) => x.nama === nama && x.jabatan === "Tinter");
  if (!k) return undefined;

  const gajiPokok = 4_500_000;
  const tunjangan = 500_000;
  const telat = TELAT_MAP[k.nama] ?? 0;
  const alpha = ALPHA_MAP[k.nama] ?? 0;
  const lemburEntries = MOCK_LEMBUR.filter((l) => l.nama === k.nama && l.status === "Selesai");
  const jamLembur = lemburEntries.reduce((s, l) => s + l.jam, 0);
  const potongan = calcPotonganAbsensi({ telat, alpha, gajiPokok, workdaysInMonth: WORKDAYS_IN_MONTH });
  const totals = calcSlipTotals({ gajiPokok, tunjangan, jamLembur, potongan });
  const cabangShort = k.cabang.replace(/^(Bengkel )?(Auto 2000 |Cakrawala |Prima )?/, "").split(" ")[0] || k.cabang;

  return {
    nama: k.nama,
    cabang: cabangShort,
    cabangFull: k.cabang,
    bulan: `${MONTHS[monthIndex]} 2026`,
    gajiPokok,
    tunjangan,
    lembur: totals.upahLembur,
    jamLembur,
    potongan,
    telat,
    alpha,
    pph21: totals.pph21,
    bruto: totals.bruto,
    bersih: totals.gajiBersih,
    status: finalized ? "Posted" : "Draft",
    lemburEntries,
  };
}

export function buildAllSlips(monthIndex: number, finalized = false): SlipDetail[] {
  return MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter")
    .map((k) => buildSlipForKaryawan(k.nama, monthIndex, finalized))
    .filter((s): s is SlipDetail => !!s);
}

export function slipSlug(nama: string) {
  return slugify(nama);
}

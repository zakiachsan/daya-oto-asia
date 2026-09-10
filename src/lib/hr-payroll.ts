/** Ported from pt-gis — payroll calc for tinter workforce */

export const LEMBUR_HOURS_DIVISOR = 173;
export const LEMBUR_MULTIPLIER = 1.5;
export const TELAT_DENDA = 50_000;
export const WORKDAYS_IN_MONTH = 22;

export function calcTarifLemburPerJam(gajiPokok: number): number {
  if (!gajiPokok) return 0;
  return Math.round((gajiPokok / LEMBUR_HOURS_DIVISOR) * LEMBUR_MULTIPLIER);
}

export function calcUpahLembur(gajiPokok: number, jamLembur: number): number {
  if (!jamLembur) return 0;
  return Math.round(calcTarifLemburPerJam(gajiPokok) * jamLembur);
}

export function calcPotonganAbsensi(params: {
  telat: number;
  alpha: number;
  gajiPokok: number;
  workdaysInMonth?: number;
}): number {
  const workdays = params.workdaysInMonth ?? WORKDAYS_IN_MONTH;
  const dendaTelat = params.telat * TELAT_DENDA;
  const dendaAlpha =
    workdays > 0 && params.alpha > 0
      ? Math.round((params.gajiPokok / workdays) * params.alpha)
      : 0;
  return dendaTelat + dendaAlpha;
}

export function calcPPh21(brutoSebulan: number, ptkp = 4_500_000): number {
  const brutoSetahun = brutoSebulan * 12;
  const biayaJabatan = Math.min(brutoSetahun * 0.05, 6_000_000);
  const netoSetahun = brutoSetahun - biayaJabatan - ptkp * 12;
  if (netoSetahun <= 0) return 0;

  let pph = 0;
  const tiers = [
    { upto: 60_000_000, rate: 0.05 },
    { upto: 250_000_000, rate: 0.15 },
    { upto: 500_000_000, rate: 0.25 },
    { upto: Infinity, rate: 0.3 },
  ];
  let prev = 0;
  for (const t of tiers) {
    if (netoSetahun > prev) {
      const slab = Math.min(netoSetahun, t.upto) - prev;
      pph += slab * t.rate;
      prev = Math.min(netoSetahun, t.upto);
      if (netoSetahun <= t.upto) break;
    }
  }
  return Math.round(pph / 12);
}

export function calcSlipTotals(params: {
  gajiPokok: number;
  tunjangan: number;
  jamLembur: number;
  potongan: number;
  ptkp?: number;
}) {
  const upahLembur = calcUpahLembur(params.gajiPokok, params.jamLembur);
  const bruto = params.gajiPokok + params.tunjangan + upahLembur;
  const totalGaji = bruto - params.potongan;
  const pph21 = calcPPh21(bruto, params.ptkp);
  const gajiBersih = totalGaji - pph21;
  return { upahLembur, bruto, totalGaji, pph21, gajiBersih };
}

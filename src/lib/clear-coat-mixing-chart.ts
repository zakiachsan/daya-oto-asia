/**
 * AXT Clear Coat · mixing ratio by weight (Pak Ricky / label chart).
 * Sumber: AXT MIXING RATIO — Base (A), Hardener (B), Thinner (T).
 */

export type ClearCoatWeightRow = {
  total: number;
  base: number;
  hardener: number;
  thinner: number;
};

export type ClearCoatChartKode = "HS360" | "MS280";

/** AXT 360 HS — tabel gram dari chart resmi */
export const AXT_360_HS_WEIGHT_CHART: ClearCoatWeightRow[] = [
  { total: 50, base: 29.2, hardener: 14.3, thinner: 6.4 },
  { total: 100, base: 58.5, hardener: 28.7, thinner: 12.9 },
  { total: 150, base: 87.7, hardener: 43.0, thinner: 19.3 },
  { total: 200, base: 116.9, hardener: 57.3, thinner: 25.8 },
  { total: 250, base: 146.1, hardener: 71.7, thinner: 32.2 },
  { total: 300, base: 175.4, hardener: 86.0, thinner: 38.7 },
  { total: 350, base: 204.6, hardener: 100.3, thinner: 45.1 },
  { total: 400, base: 233.8, hardener: 114.6, thinner: 51.6 },
  { total: 450, base: 263.0, hardener: 128.9, thinner: 58.0 },
  { total: 500, base: 292.3, hardener: 143.3, thinner: 64.5 },
  { total: 550, base: 321.5, hardener: 157.6, thinner: 70.9 },
  { total: 600, base: 350.7, hardener: 171.9, thinner: 77.4 },
  { total: 650, base: 379.9, hardener: 186.2, thinner: 83.8 },
  { total: 700, base: 409.2, hardener: 200.6, thinner: 90.3 },
  { total: 750, base: 438.4, hardener: 214.9, thinner: 96.7 },
  { total: 800, base: 467.6, hardener: 229.2, thinner: 103.2 },
  { total: 850, base: 496.8, hardener: 243.6, thinner: 109.6 },
  { total: 900, base: 526.1, hardener: 257.9, thinner: 116.0 },
  { total: 950, base: 555.3, hardener: 272.2, thinner: 122.5 },
  { total: 1000, base: 584.5, hardener: 286.5, thinner: 128.9 },
  { total: 1500, base: 876.8, hardener: 429.8, thinner: 193.4 },
];

/** AXT 280 MS — tabel gram dari chart resmi */
export const AXT_280_MS_WEIGHT_CHART: ClearCoatWeightRow[] = [
  { total: 50, base: 29.4, hardener: 7.4, thinner: 13.2 },
  { total: 100, base: 58.8, hardener: 14.7, thinner: 26.5 },
  { total: 150, base: 88.2, hardener: 22.1, thinner: 39.7 },
  { total: 200, base: 117.6, hardener: 29.4, thinner: 52.9 },
  { total: 250, base: 147.1, hardener: 36.8, thinner: 66.2 },
  { total: 300, base: 176.5, hardener: 44.1, thinner: 79.4 },
  { total: 350, base: 205.9, hardener: 51.5, thinner: 92.6 },
  { total: 400, base: 235.3, hardener: 58.8, thinner: 105.9 },
  { total: 450, base: 264.7, hardener: 66.2, thinner: 119.1 },
  { total: 500, base: 294.1, hardener: 73.5, thinner: 132.4 },
  { total: 550, base: 323.5, hardener: 80.9, thinner: 145.6 },
  { total: 600, base: 352.9, hardener: 88.2, thinner: 158.8 },
  { total: 650, base: 382.4, hardener: 95.6, thinner: 172.1 },
  { total: 700, base: 411.8, hardener: 102.9, thinner: 185.3 },
  { total: 750, base: 441.2, hardener: 110.3, thinner: 198.5 },
  { total: 800, base: 470.6, hardener: 117.6, thinner: 211.8 },
  { total: 850, base: 500.0, hardener: 125.0, thinner: 225.0 },
  { total: 900, base: 529.4, hardener: 132.4, thinner: 238.2 },
  { total: 950, base: 558.8, hardener: 139.7, thinner: 251.5 },
  { total: 1000, base: 588.2, hardener: 147.1, thinner: 264.7 },
  { total: 1500, base: 882.4, hardener: 220.6, thinner: 397.1 },
];

export function clearCoatDisplayName(kode: ClearCoatChartKode): string {
  return kode === "HS360" ? "AXT 360 HS" : "AXT 280 MS";
}

export function chartForClearCoat(kode: ClearCoatChartKode): ClearCoatWeightRow[] {
  return kode === "HS360" ? AXT_360_HS_WEIGHT_CHART : AXT_280_MS_WEIGHT_CHART;
}

function scaleRow(row: ClearCoatWeightRow, targetTotal: number): ClearCoatWeightRow {
  const f = targetTotal / row.total;
  return {
    total: targetTotal,
    base: Math.round(row.base * f * 10) / 10,
    hardener: Math.round(row.hardener * f * 10) / 10,
    thinner: Math.round(row.thinner * f * 10) / 10,
  };
}

function lookupFromChart(chart: ClearCoatWeightRow[], totalGram: number): ClearCoatWeightRow {
  const exact = chart.find((r) => r.total === totalGram);
  if (exact) return exact;

  const sorted = [...chart].sort((a, b) => a.total - b.total);
  if (totalGram <= sorted[0].total) return scaleRow(sorted[0], totalGram);
  const last = sorted[sorted.length - 1];
  if (totalGram >= last.total) return scaleRow(last, totalGram);

  for (let i = 0; i < sorted.length - 1; i++) {
    const lo = sorted[i];
    const hi = sorted[i + 1];
    if (totalGram >= lo.total && totalGram <= hi.total) {
      const t = (totalGram - lo.total) / (hi.total - lo.total);
      return {
        total: totalGram,
        base: Math.round((lo.base + t * (hi.base - lo.base)) * 10) / 10,
        hardener: Math.round((lo.hardener + t * (hi.hardener - lo.hardener)) * 10) / 10,
        thinner: Math.round((lo.thinner + t * (hi.thinner - lo.thinner)) * 10) / 10,
      };
    }
  }
  return scaleRow(sorted.find((r) => r.total === 100)!, totalGram);
}

export function lookupClearCoatGrams(kode: ClearCoatChartKode, totalGram: number): ClearCoatWeightRow {
  return lookupFromChart(chartForClearCoat(kode), totalGram);
}

export function clearCoatMixingLines(
  kode: ClearCoatChartKode,
  totalGram: number,
): { kode: string; gram: number; nama: string }[] {
  const row = lookupClearCoatGrams(kode, totalGram);
  const product = clearCoatDisplayName(kode);
  const prefix = kode === "HS360" ? "HS360" : "MS280";
  return [
    { kode: prefix, gram: row.base, nama: `Base (A) · ${product}` },
    { kode: `${prefix}-H`, gram: row.hardener, nama: "Hardener (B)" },
    { kode: `${prefix}-T`, gram: row.thinner, nama: "Thinner (T)" },
  ];
}

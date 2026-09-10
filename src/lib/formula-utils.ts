import { AXT_PRODUK } from "./axt-products";

export type FormulaLine = {
  kode: string;
  nama: string;
  gram: number;
  acum: number;
};

export function findAxtProduct(kode: string) {
  return AXT_PRODUK.find((p) => p.kode === kode);
}

export function resolveFormulaNames(items: { kode: string; gram: number }[]): { kode: string; nama: string; gram: number }[] {
  return items.map((item) => ({
    ...item,
    nama: findAxtProduct(item.kode)?.nama ?? item.kode,
  }));
}

/** Scale formula gram values from base volume (e.g. 50G) to target mixing volume */
export function scaleFormulaGrams(
  items: { kode: string; gram: number }[],
  baseVolume: number,
  targetVolume: number
): { kode: string; gram: number }[] {
  if (baseVolume <= 0) return items;
  const factor = targetVolume / baseVolume;
  return items.map((item) => ({
    kode: item.kode,
    gram: Math.round(item.gram * factor * 10) / 10,
  }));
}

/** Add cumulative ACUM column for scale-friendly mixing (YATU-style) */
export function withAcum(items: { kode: string; nama: string; gram: number }[]): FormulaLine[] {
  let running = 0;
  return items.map((item) => {
    running += item.gram;
    return {
      ...item,
      acum: Math.round(running * 10) / 10,
    };
  });
}

export function totalGram(items: { gram: number }[]) {
  return Math.round(items.reduce((s, i) => s + i.gram, 0) * 10) / 10;
}

/** Convert gram usage to liter equivalent for nota pemakaian (density ~1g/ml) */
export function gramToLiter(gram: number) {
  return Math.round((gram / 1000) * 1000) / 1000;
}

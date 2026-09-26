import { gramsFromMixingRatio, findMixingRatio } from "./mixing-ratio-master";

/** Default gramasi non-basecoat · clear coat: chart AXT 360 HS (Pak Ricky) (#26/#31) */
export function defaultFormulaItemsForKode(kode: string, volumeGram: number) {
  const ratio = findMixingRatio(kode);
  if (ratio) return gramsFromMixingRatio(volumeGram, ratio);
  return [{ kode, gram: volumeGram }];
}

export function defaultVolumeForKategori(kode: string) {
  if (kode === "HS360" || kode === "MS280") return 100;
  if (kode === "PU") return 500;
  return 50;
}

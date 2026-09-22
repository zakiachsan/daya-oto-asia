import { findAxtProduct, resolveFormulaNames, scaleFormulaGrams } from "./formula-utils";

export type FormulaItem = { kode: string; nama: string; gram: number };

export type SavedFormulaLayer = {
  layer: number;
  items: FormulaItem[];
};

export type SavedFormulaRow = {
  id: string;
  kodeWarna: string;
  namaWarna: string;
  kategori: string;
  /** Label bebas tinter, mis. "1G3 + extra silver" */
  label: string;
  baseVolume: number;
  layerCount: number;
  layers: SavedFormulaLayer[];
  tinter: string;
  disimpan: string;
  catatan?: string;
};

export type LayerFormulaItem = { kode: string; gram: number; nama?: string };

export function captureFormulaForSave(params: {
  layerCount: number;
  mixingVolume: number;
  formulaBaseVolume: number;
  layerFormulas: Record<number, LayerFormulaItem[]>;
  gramOverrides: Record<string, number>;
}): Pick<SavedFormulaRow, "layerCount" | "baseVolume" | "layers"> {
  const { layerCount, mixingVolume, formulaBaseVolume, layerFormulas, gramOverrides } = params;
  const baseVolume = formulaBaseVolume;
  const layers: SavedFormulaLayer[] = [];

  for (let layer = 1; layer <= layerCount; layer += 1) {
    const base = layerFormulas[layer] ?? [];
    const scaled = scaleFormulaGrams(base, formulaBaseVolume, mixingVolume);
    const withOverrides = scaled.map((item) => ({
      kode: item.kode,
      gram: gramOverrides[`${layer}-${item.kode}`] ?? item.gram,
    }));
    const normalized = scaleFormulaGrams(withOverrides, mixingVolume, baseVolume);
    const customNames = Object.fromEntries(base.filter((b) => b.nama).map((b) => [b.kode, b.nama!]));
    const items = resolveFormulaNames(normalized).map((item) => ({
      ...item,
      nama: customNames[item.kode] ?? item.nama,
    }));
    layers.push({ layer, items });
  }

  return { layerCount, baseVolume, layers };
}

export function applySavedFormula(saved: SavedFormulaRow) {
  const layerFormulas: Record<number, LayerFormulaItem[]> = {};
  saved.layers.forEach((l) => {
    layerFormulas[l.layer] = l.items.map((i) => ({
      kode: i.kode,
      gram: i.gram,
      nama: i.nama,
    }));
  });
  for (let layer = saved.layerCount + 1; layer <= 3; layer += 1) {
    layerFormulas[layer] = layerFormulas[1] ?? [];
  }

  return {
    kodeWarna: saved.kodeWarna,
    namaWarna: saved.namaWarna,
    kategori: saved.kategori,
    layerCount: saved.layerCount,
    mixingVolume: saved.baseVolume,
    layerFormulas,
    gramOverrides: {} as Record<string, number>,
    recipeId: `RCP-${saved.kodeWarna}-${saved.baseVolume}G-SAV`,
    extraKodes: saved.layers
      .flatMap((l) => l.items)
      .filter((i) => !findAxtProduct(i.kode))
      .map((i) => ({ kode: i.kode, nama: i.nama.replace(/^Toner tambahan$/i, i.kode) }))
      .filter((v, idx, arr) => arr.findIndex((x) => x.kode === v.kode) === idx),
  };
}

export function defaultFormulaLabel(kodeWarna: string, namaWarna: string) {
  return `${kodeWarna} · ${namaWarna} (custom)`;
}

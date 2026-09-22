import type { TransaksiRow } from "./mock-data";
import type { LayerFormulaItem } from "./saved-formula-utils";
import type { ProdukKategoriId } from "./transaksi-status-utils";

export type TransaksiDraftWizard = {
  step: number;
  layerCount: number;
  activeLayer: number;
  layerFormulas: Record<string, LayerFormulaItem[]>;
  gramOverrides: Record<string, number>;
  mfr: string;
  modelYear: string;
  mobil: string;
  produkKategori: ProdukKategoriId;
  mixingVolume: number;
  fotoSample: boolean;
  waktuMulai: string | null;
  waktuSelesaiMixing: string | null;
};

export type DraftWizardHydration = {
  step: number;
  mfr: string;
  modelYear: string;
  mobil: string;
  produkKategori: ProdukKategoriId;
  mixingVolume: number;
  layerCount: number;
  activeLayer: number;
  layerFormulas: Record<number, LayerFormulaItem[]>;
  gramOverrides: Record<string, number>;
  fotoSample: boolean;
  waktuMulai: number | null;
  waktuSelesaiMixing: number | null;
  mixingActive: boolean;
  elapsedSec: number;
};

function parseLayerFormulas(raw: Record<string, LayerFormulaItem[]>) {
  const out: Record<number, LayerFormulaItem[]> = {};
  Object.entries(raw).forEach(([key, items]) => {
    out[Number(key)] = items;
  });
  return out;
}

function fallbackLayerFormulas(trx: TransaksiRow): Record<number, LayerFormulaItem[]> {
  if (trx.layers?.length) {
    const out: Record<number, LayerFormulaItem[]> = {};
    trx.layers.forEach((l) => {
      out[l.layer] = l.bahan.map((b) => ({ kode: b.kode, gram: b.gram, nama: b.nama }));
    });
    return out;
  }
  return {
    1: trx.bahan.map((b) => ({ kode: b.kode, gram: b.gram, nama: b.nama })),
    2: [],
    3: [],
  };
}

export function buildDraftWizardSnapshot(params: {
  step: number;
  layerCount: number;
  activeLayer: number;
  layerFormulas: Record<number, LayerFormulaItem[]>;
  gramOverrides: Record<string, number>;
  mfr: string;
  modelYear: string;
  mobil: string;
  produkKategori: ProdukKategoriId;
  mixingVolume: number;
  fotoSample: boolean;
  waktuMulai: number | null;
  waktuSelesaiMixing: number | null;
}): TransaksiDraftWizard {
  const layerFormulas: Record<string, LayerFormulaItem[]> = {};
  Object.entries(params.layerFormulas).forEach(([key, items]) => {
    layerFormulas[key] = items;
  });
  return {
    step: params.step,
    layerCount: params.layerCount,
    activeLayer: params.activeLayer,
    layerFormulas,
    gramOverrides: params.gramOverrides,
    mfr: params.mfr,
    modelYear: params.modelYear,
    mobil: params.mobil,
    produkKategori: params.produkKategori,
    mixingVolume: params.mixingVolume,
    fotoSample: params.fotoSample,
    waktuMulai: params.waktuMulai ? new Date(params.waktuMulai).toISOString() : null,
    waktuSelesaiMixing: params.waktuSelesaiMixing ? new Date(params.waktuSelesaiMixing).toISOString() : null,
  };
}

export function hydrateDraftWizard(trx: TransaksiRow): DraftWizardHydration {
  const w = trx.draftWizard;
  const layerFormulas = parseLayerFormulas(w?.layerFormulas ?? {});
  const hasLayers = Object.keys(layerFormulas).length > 0;
  const resolvedLayers = hasLayers ? layerFormulas : fallbackLayerFormulas(trx);

  const waktuMulai = w?.waktuMulai
    ? new Date(w.waktuMulai).getTime()
    : trx.waktuMulai
      ? new Date(trx.waktuMulai).getTime()
      : null;
  const waktuSelesaiMixing = w?.waktuSelesaiMixing
    ? new Date(w.waktuSelesaiMixing).getTime()
    : trx.waktuSelesaiMixing
      ? new Date(trx.waktuSelesaiMixing).getTime()
      : null;

  const step = w?.step ?? (waktuSelesaiMixing ? 2 : waktuMulai ? 1 : 0);
  const elapsedSec =
    waktuMulai && !waktuSelesaiMixing
      ? Math.floor((Date.now() - waktuMulai) / 1000)
      : waktuMulai && waktuSelesaiMixing
        ? Math.floor((waktuSelesaiMixing - waktuMulai) / 1000)
        : 0;

  return {
    step,
    mfr: w?.mfr ?? "Toyota",
    modelYear: w?.modelYear ?? "",
    mobil:
      w?.mobil ??
      (trx.mobil.replace(/^Toyota\s?/i, "").replace(/\s+\d{4}$/, "").trim() || trx.mobil),
    produkKategori: w?.produkKategori ?? trx.produkKategori ?? "basecoat",
    mixingVolume: w?.mixingVolume ?? trx.mixingVolume ?? 50,
    layerCount: w?.layerCount ?? trx.layers?.length ?? 1,
    activeLayer: w?.activeLayer ?? 1,
    layerFormulas: resolvedLayers,
    gramOverrides: w?.gramOverrides ?? {},
    fotoSample: w?.fotoSample ?? trx.fotoSample ?? false,
    waktuMulai,
    waktuSelesaiMixing,
    mixingActive: step === 1 && !waktuSelesaiMixing,
    elapsedSec,
  };
}

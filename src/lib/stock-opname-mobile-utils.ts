import type { InventoriStokRow } from "./inventori-utils";
import { isOpnameRowDalamToleransi, type StockOpnameRow } from "./stock-opname-utils";

export { isOpnameRowDalamToleransi };

export type StockOpnameItemDraft = {
  inventoriId: string;
  kodeProduk: string;
  produk: string;
  kalengSistem: number;
  gramSistem: number;
  kalengFisik: number;
  gramFisik: number;
  updatedAt: string;
};

export type StockOpnameDraftSession = {
  cabang: string;
  tinter: string;
  items: Record<string, StockOpnameItemDraft>;
};

export function opnameSessionKey(cabang: string, tinter: string) {
  return `${cabang}|${tinter}`;
}

export function computeOpnameSelisih(
  kalengSistem: number,
  gramSistem: number,
  kalengFisik: number,
  gramFisik: number,
) {
  return {
    selisihKaleng: kalengFisik - kalengSistem,
    selisih: gramFisik - gramSistem,
  };
}

export function createOpnameBatchId(cabang: string) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const cab = cabang.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "cabang";
  return `SOB-${y}${m}${day}-${cab}-${String(d.getTime()).slice(-4)}`;
}

export function buildOpnameRowFromDraft(
  draft: StockOpnameItemDraft,
  params: { cabang: string; tinter: string; tanggal: string; batchId: string; seq: number },
): StockOpnameRow {
  const { selisihKaleng, selisih } = computeOpnameSelisih(
    draft.kalengSistem,
    draft.gramSistem,
    draft.kalengFisik,
    draft.gramFisik,
  );
  return {
    id: `${params.batchId}-${String(params.seq).padStart(3, "0")}`,
    batchId: params.batchId,
    kodeProduk: draft.kodeProduk,
    cabang: params.cabang,
    tinter: params.tinter,
    tanggal: params.tanggal,
    produk: draft.produk,
    kalengSistem: draft.kalengSistem,
    gramSistem: draft.gramSistem,
    kalengFisik: draft.kalengFisik,
    gramFisik: draft.gramFisik,
    selisihKaleng,
    sistem: draft.gramSistem,
    fisik: draft.gramFisik,
    selisih,
    status: "Menunggu Review",
    waktuTimbang: new Date().toISOString(),
  };
}

export function buildDraftFromInventori(
  item: InventoriStokRow,
  kalengFisik: number,
  gramFisik: number,
): StockOpnameItemDraft {
  return {
    inventoriId: item.id,
    kodeProduk: item.kodeProduk,
    produk: item.produk,
    kalengSistem: item.kalengUtuh,
    gramSistem: item.gramTerbuka,
    kalengFisik,
    gramFisik,
    updatedAt: new Date().toISOString(),
  };
}

export function matchesOpnameSearch(item: InventoriStokRow, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    item.produk.toLowerCase().includes(q) ||
    item.kodeProduk.toLowerCase().includes(q) ||
    item.cabang.toLowerCase().includes(q)
  );
}

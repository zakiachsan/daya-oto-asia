import { MOCK_STOCK_OPNAME } from "./mock-data";

export const TOLERANSI_GRAM = 5;

export type StockOpnameRow = {
  id: string;
  batchId?: string;
  kodeProduk?: string;
  cabang: string;
  tinter: string;
  tanggal: string;
  produk: string;
  kalengSistem?: number;
  gramSistem?: number;
  kalengFisik?: number;
  gramFisik?: number;
  sistem: number;
  fisik: number;
  selisih: number;
  selisihKaleng?: number;
  status: string;
  catatan?: string;
  supervisor?: string;
  waktuTimbang?: string;
};

export const INITIAL_STOCK_OPNAME: StockOpnameRow[] = MOCK_STOCK_OPNAME.map((r) => ({
  ...r,
  waktuTimbang: `${r.tanggal}T10:00:00`,
  supervisor: Math.abs(r.selisih) > TOLERANSI_GRAM ? undefined : "Pak Ahmad",
  catatan: Math.abs(r.selisih) > TOLERANSI_GRAM ? "Selisih melebihi toleransi · perlu investigasi tinter" : undefined,
}));

export function isDalamToleransi(selisih: number) {
  return Math.abs(selisih) <= TOLERANSI_GRAM;
}

export function isOpnameRowDalamToleransi(row: Pick<StockOpnameRow, "selisih" | "selisihKaleng">) {
  const kalengOk = (row.selisihKaleng ?? 0) === 0;
  return kalengOk && isDalamToleransi(row.selisih);
}

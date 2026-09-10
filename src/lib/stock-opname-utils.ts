import { MOCK_STOCK_OPNAME } from "./mock-data";

export const TOLERANSI_GRAM = 5;

export type StockOpnameRow = (typeof MOCK_STOCK_OPNAME)[number] & {
  catatan?: string;
  supervisor?: string;
  waktuTimbang?: string;
};

export const INITIAL_STOCK_OPNAME: StockOpnameRow[] = MOCK_STOCK_OPNAME.map((r) => ({
  ...r,
  waktuTimbang: `${r.tanggal}T10:00:00`,
  supervisor: Math.abs(r.selisih) > TOLERANSI_GRAM ? undefined : "Pak Ahmad",
  catatan: Math.abs(r.selisih) > TOLERANSI_GRAM ? "Selisih melebihi toleransi — perlu investigasi tinter" : undefined,
}));

export function isDalamToleransi(selisih: number) {
  return Math.abs(selisih) <= TOLERANSI_GRAM;
}

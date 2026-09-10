import { MOCK_PO, MOCK_PRODUK } from "./mock-data";

export type PoLine = { kode: string; nama: string; qty: number; harga: number };

export type PoDetail = {
  id: string;
  tanggal: string;
  supplier: string;
  items: number;
  total: number;
  status: string;
  gr: string;
  catatan?: string;
  lines: PoLine[];
};

function line(kode: string, qty: number, harga: number): PoLine {
  const p = MOCK_PRODUK.find((x) => x.kode === kode);
  return { kode, nama: p?.nama ?? kode, qty, harga };
}

export const INITIAL_PO: PoDetail[] = [
  {
    ...MOCK_PO[0],
    catatan: "Order rutin bulanan Axalta",
    lines: [
      line("AXT-207", 20, 450000),
      line("AXT-814", 15, 520000),
      line("AXT-910", 10, 610000),
    ],
  },
  {
    ...MOCK_PO[1],
    catatan: "Restock clear coat & thinner",
    lines: [
      line("AXT-101", 8, 380000),
      line("AXT-207", 5, 450000),
    ],
  },
  {
    ...MOCK_PO[2],
    catatan: "Menunggu TTD kepala gudang",
    lines: [
      line("AXT-814", 12, 520000),
      line("AXT-910", 8, 610000),
      line("AXT-207", 25, 450000),
    ],
  },
];

export const HARGA_EST: Record<string, number> = {
  "AXT-207": 450000,
  "AXT-814": 520000,
  "AXT-1010": 380000,
  "AXT-910": 610000,
  "AXT-101": 380000,
};

export const PO_SUPPLIERS = ["PT Axalta Indonesia", "PT Nippon Paint"];

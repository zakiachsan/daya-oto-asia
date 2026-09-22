import { MOCK_PO, MOCK_PRODUK } from "./mock-data";

export type PoLine = {
  kode: string;
  nama: string;
  qty: number;
  harga: number;
  /** Qty diterima saat goods receipt (partial OK) */
  qtyReceived?: number;
};

export type PoReturLine = {
  kode: string;
  nama: string;
  qty: number;
  alasan: string;
};

export type PoReceiveStatus = "pending" | "partial" | "complete";

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
  returs?: PoReturLine[];
  receiveStatus?: PoReceiveStatus;
  /** Total nilai barang yang benar-benar diterima (basis faktur) */
  receivedTotal?: number;
};

export function calcReceivedTotal(lines: PoLine[]) {
  return lines.reduce((s, l) => s + (l.qtyReceived ?? 0) * l.harga, 0);
}

export function deriveReceiveStatus(lines: PoLine[]): PoReceiveStatus {
  const received = lines.filter((l) => (l.qtyReceived ?? 0) > 0);
  if (received.length === 0) return "pending";
  const allFull = lines.every((l) => (l.qtyReceived ?? 0) >= l.qty);
  return allFull ? "complete" : "partial";
}

export const PO_RETUR_ALASAN = [
  "Tumpah dalam pengiriman",
  "Kaleng penyok / rusak",
  "Qty kurang dari PO",
  "Kadaluarsa / produk reject",
  "Lain-lain",
] as const;

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

export const PO_SUPPLIERS = [
  "PT Axalta Indonesia",
  "PT Nippon Paint",
  "Distributor Axalta Manado",
  "Distributor Axalta Surabaya",
];

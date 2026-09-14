import type { OpbRow } from "./mock-data";
import { MOCK_COA } from "./mock-data";

export type JurnalSourceType =
  | "faktur-jual"
  | "faktur-beli"
  | "penerimaan-penjualan"
  | "pembayaran-pembelian"
  | "penyesuaian-stok"
  | "kas-penerimaan"
  | "kas-pembayaran"
  | "transfer-bank"
  | "jurnal-manual";

export const JURNAL_SOURCE_LABELS: Record<JurnalSourceType, string> = {
  "faktur-jual": "Faktur Penjualan",
  "faktur-beli": "Faktur Pembelian",
  "penerimaan-penjualan": "Penerimaan Penjualan",
  "pembayaran-pembelian": "Pembayaran Pembelian",
  "penyesuaian-stok": "Penyesuaian Persediaan",
  "kas-penerimaan": "Penerimaan Kas/Bank",
  "kas-pembayaran": "Pembayaran Kas/Bank",
  "transfer-bank": "Transfer Bank",
  "jurnal-manual": "Jurnal Manual",
};

export type JurnalLine = {
  accountKode: string;
  accountNama: string;
  debit: number;
  credit: number;
};

export type JurnalDetail = {
  id: string;
  tanggal: string;
  keterangan: string;
  debit: number;
  kredit: number;
  status: "Posted" | "Draft";
  lines: JurnalLine[];
  sourceType?: JurnalSourceType;
  refOpb?: string;
  refFaktur?: string;
  refAdj?: string;
  refPayment?: string;
};

export const MOCK_JURNAL_DETAILS: JurnalDetail[] = [
  {
    id: "JU/2026/09/001",
    tanggal: "2026-09-01",
    keterangan: "Tagihan OPB Auto 2000 Agustus",
    debit: 12500000,
    kredit: 12500000,
    status: "Posted",
    sourceType: "faktur-jual",
    refOpb: "OPB-2026-0089",
    refFaktur: "INV-2026-0088",
    lines: [
      { accountKode: "110301", accountNama: "Piutang Usaha", debit: 12500000, credit: 0 },
      { accountKode: "410101", accountNama: "Pendapatan Jasa Cat", debit: 0, credit: 12500000 },
    ],
  },
  {
    id: "JU/2026/09/002",
    tanggal: "2026-09-05",
    keterangan: "Penerimaan barang PO-2026-034",
    debit: 8500000,
    kredit: 8500000,
    status: "Posted",
    sourceType: "faktur-beli",
    refFaktur: "PINV-2026-034",
    lines: [
      { accountKode: "130101", accountNama: "Persediaan Bahan Cat", debit: 8500000, credit: 0 },
      { accountKode: "210101", accountNama: "Hutang Usaha", debit: 0, credit: 8500000 },
    ],
  },
  {
    id: "JU/2026/09/003",
    tanggal: "2026-09-08",
    keterangan: "Penyesuaian stok opname Surabaya",
    debit: 250000,
    kredit: 250000,
    status: "Posted",
    sourceType: "penyesuaian-stok",
    refAdj: "ADJ-2026-012",
    lines: [
      { accountKode: "510101", accountNama: "HPP Bahan Cat", debit: 250000, credit: 0 },
      { accountKode: "130101", accountNama: "Persediaan Bahan Cat", debit: 0, credit: 250000 },
    ],
  },
];

export function jurnalSlug(id: string) {
  return id.replace(/\//g, "-").toLowerCase();
}

export function jurnalFromSlug(slug: string) {
  const m = slug.match(/^ju-(\d{4})-(\d{2})-(\d{3})$/i);
  if (m) return `JU/${m[1]}/${m[2]}/${m[3]}`;
  return slug.toUpperCase();
}

export function accountName(kode: string) {
  return MOCK_COA.find((a) => a.kode === kode)?.nama ?? kode;
}

export function nextJurnalId(seq: number) {
  return `JU/2026/09/${String(seq).padStart(3, "0")}`;
}

export function allocateJurnalId(jurnalList: JurnalDetail[]) {
  return nextJurnalId(jurnalList.length + 4);
}

export function linesFromDraft(drafts: { accountKode: string; debit: number; credit: number }[]): JurnalLine[] {
  return drafts
    .filter((d) => d.debit > 0 || d.credit > 0)
    .map((d) => ({
      accountKode: d.accountKode,
      accountNama: accountName(d.accountKode),
      debit: d.debit,
      credit: d.credit,
    }));
}

import type { OpbRow } from "./mock-data";
import { MOCK_COA } from "./mock-data";

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
  refOpb?: string;
};

export const MOCK_JURNAL_DETAILS: JurnalDetail[] = [
  {
    id: "JU/2026/09/001",
    tanggal: "2026-09-01",
    keterangan: "Tagihan OPB Auto 2000 Agustus",
    debit: 12500000,
    kredit: 12500000,
    status: "Posted",
    refOpb: "OPB-2026-0089",
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
    status: "Draft",
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

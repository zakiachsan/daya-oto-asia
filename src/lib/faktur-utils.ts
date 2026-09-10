import type { OpbRow } from "./mock-data";

export type FakturJualRow = {
  id: string;
  tanggal: string;
  pelanggan: string;
  periode: string;
  total: number;
  status: "Draft" | "Posted";
  opbId?: string;
};

export function findOpbForFaktur(faktur: FakturJualRow, opbList: OpbRow[]): OpbRow | undefined {
  if (faktur.opbId) return opbList.find((o) => o.id === faktur.opbId);
  return opbList.find((o) => o.cabang.includes(faktur.pelanggan.split(" ")[0]) && o.periode === faktur.periode)
    ?? opbList.find((o) => o.cabang === faktur.pelanggan || o.cabang.includes(faktur.pelanggan));
}

export function fakturSlug(id: string) {
  return id.toLowerCase();
}

export function fakturFromSlug(slug: string) {
  return slug.toUpperCase();
}

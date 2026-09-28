import type { OpbRow } from "./mock-data";
import { nextFakturJualId, type FakturJualRow } from "./faktur-utils";

/** Generate 1 Faktur Penjualan per OPB · total ambil dari OPB, bukan dibagi-bagi (#57) */
export function buildFakturPenjualan(opb: OpbRow, seq: number): FakturJualRow {
  return {
    id: `INV-2026-${String(seq).padStart(4, "0")}`,
    tanggal: new Date().toISOString().slice(0, 10),
    pelanggan: opb.cabang,
    periode: opb.periode,
    total: opb.total,
    status: "Draft",
    opbId: opb.id,
    jenis: "Faktur Penjualan",
  };
}

/** Faktur untuk beberapa OPB sekaligus (tombol Proses Invoice per cabang & Batch Cabang) */
export function buildFakturUntukOpb(opbList: OpbRow[], fakturJual: FakturJualRow[]): FakturJualRow[] {
  const hasil: FakturJualRow[] = [];
  let seq = Number(nextFakturJualId(fakturJual).split("-").pop());
  for (const opb of opbList) {
    hasil.push(buildFakturPenjualan(opb, seq));
    seq += 1;
  }
  return hasil;
}

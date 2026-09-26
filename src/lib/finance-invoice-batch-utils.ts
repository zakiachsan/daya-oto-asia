import type { TransaksiRow } from "./mock-data";
import type { FakturJualRow } from "./faktur-utils";

/** Generate faktur/invoice batch per cabang + rentang tanggal (#57) */
export function transaksiForBatch(
  all: TransaksiRow[],
  cabang: string,
  dari: string,
  sampai: string,
) {
  return all.filter((t) => {
    if (t.tanggal < dari || t.tanggal > sampai) return false;
    if (cabang !== "Semua Cabang" && !t.cabang.includes(cabang.replace(/^Bengkel /, ""))) return false;
    return t.status !== "Draft" && t.status !== "Dibatalkan";
  });
}

export function buildBatchFaktur(params: {
  cabang: string;
  dari: string;
  sampai: string;
  transaksi: TransaksiRow[];
  seq: number;
}): FakturJualRow[] {
  const rows = transaksiForBatch(params.transaksi, params.cabang, params.dari, params.sampai);
  const total = rows.reduce((s, t) => s + t.total, 0);
  const baseId = `INV-BATCH-${params.dari.replace(/-/g, "")}-${String(params.seq).padStart(3, "0")}`;

  const a: FakturJualRow = {
    id: `${baseId}-A`,
    tanggal: params.sampai,
    pelanggan: params.cabang,
    periode: `${params.dari} s/d ${params.sampai}`,
    total: Math.round(total * 0.6),
    status: "Draft",
    opbId: `BATCH-${params.cabang.slice(0, 3).toUpperCase()}`,
    jenis: "Faktur Penjualan",
  };
  const b: FakturJualRow = {
    id: `${baseId}-B`,
    tanggal: params.sampai,
    pelanggan: params.cabang,
    periode: `${params.dari} s/d ${params.sampai}`,
    total: total - Math.round(total * 0.6),
    status: "Draft",
    opbId: `BATCH-${params.cabang.slice(0, 3).toUpperCase()}`,
    jenis: "Rekap Invoice",
  };
  return [a, b];
}

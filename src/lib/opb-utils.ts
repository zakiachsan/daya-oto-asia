import type { OpbRow, TransaksiRow } from "./mock-data";

/** Transaksi yang masuk OPB · by opbId atau cabang+selesai */
export function getOpbTransaksi(opb: OpbRow, transaksi: TransaksiRow[]) {
  const byId = transaksi.filter((t) => t.opbId === opb.id);
  if (byId.length > 0) return byId;

  const cabangKey = opb.cabang.split(" ")[0];
  return transaksi.filter((t) => t.status === "Selesai" && t.cabang.includes(cabangKey));
}

export const OPB_PIPELINE = [
  { status: "Draft", label: "Draft OPB", desc: "OPB digenerate dari transaksi selesai" },
  { status: "Menunggu TTD", label: "TTD Admin Cabang", desc: "Dikirim ke admin cabang via DocuMatrix" },
  { status: "Rekonsiliasi", label: "Rekonsiliasi HO", desc: "Supervisor cocokkan OPB vs nota vs stok" },
  { status: "Ditagihkan", label: "Ditagihkan (SAP)", desc: "No. SAP diinput · masuk faktur penjualan" },
] as const;

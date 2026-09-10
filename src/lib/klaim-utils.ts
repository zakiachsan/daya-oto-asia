import type { KlaimWarnaRow, TransaksiRow } from "./mock-data";

export function findKlaimMatches(klaim: KlaimWarnaRow, transaksi: TransaksiRow[]) {
  return transaksi.filter(
    (t) =>
      t.cabang === klaim.cabang &&
      (t.kodeWarna === klaim.kodeWarna || t.platNomor === klaim.platNomor),
  );
}

export function klaimStatusBadge(status: KlaimWarnaRow["status"]) {
  if (status === "Menunggu Verifikasi") return "Menunggu TTD";
  if (status === "Valid") return "Selesai";
  return "Draft";
}

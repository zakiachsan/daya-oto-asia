/** Klaim nota · pembatalan nota tercetak + restore stok (Sheet #15, PPT slide 13) */

export type KlaimNotaRow = {
  id: string;
  tanggal: string;
  cabang: string;
  platNomor: string;
  receiptId: string;
  trxId: string;
  alasan: string;
  diajukanOleh: string;
  status: "Menunggu Verifikasi" | "Disetujui" | "Ditolak";
  catatan?: string;
};

export const INITIAL_KLAIM_NOTA: KlaimNotaRow[] = [
  {
    id: "KN-2026-001",
    tanggal: "2026-09-08",
    cabang: "Auto 2000 Surabaya",
    platNomor: "L 8821 QW",
    receiptId: "TRX-2026-0135",
    trxId: "TRX-2026-0135",
    alasan: "OPB tidak terbit · system Astra sudah ditutup",
    diajukanOleh: "Andi Wijaya",
    status: "Disetujui",
    catatan: "Stok dikembalikan ke inventory",
  },
];

export function klaimNotaStatusBadge(status: KlaimNotaRow["status"]) {
  return status;
}

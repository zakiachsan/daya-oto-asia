import { MOCK_IZIN } from "./mock-data";

export type IzinDetail = {
  id: string;
  nama: string;
  cabang: string;
  tipe: string;
  mulai: string;
  selesai: string;
  alasan: string;
  status: "Menunggu TTD" | "Draft" | "Selesai" | "Ditolak";
  diajukanPada?: string;
  catatanApprover?: string;
  approver?: string;
};

const CABANG: Record<string, string> = {
  "Andi Wijaya": "Surabaya",
  "Rudi Hartono": "Malang",
  "Eko Prasetyo": "Jember",
};

export const INITIAL_IZIN: IzinDetail[] = MOCK_IZIN.map((r) => ({
  ...r,
  cabang: CABANG[r.nama] ?? "Surabaya",
  diajukanPada: `${r.mulai}T08:30:00`,
  status: r.status as IzinDetail["status"],
}));

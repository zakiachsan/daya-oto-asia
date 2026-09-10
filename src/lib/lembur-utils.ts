import { MOCK_LEMBUR } from "./mock-data";

export type LemburDetail = {
  id: string;
  nama: string;
  cabang: string;
  tanggal: string;
  jam: number;
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
  gps: string;
  fotoBukti: boolean;
  status: "Menunggu TTD" | "Selesai" | "Ditolak";
  catatanApprover?: string;
  approver?: string;
};

const GPS: Record<string, string> = {
  Surabaya: "Auto 2000 Surabaya · -7.28, 112.73",
  Malang: "Cakrawala Malang · -7.98, 112.63",
  Jember: "Prima Jember · -8.17, 113.70",
};

export const INITIAL_LEMBUR: LemburDetail[] = MOCK_LEMBUR.map((r) => ({
  ...r,
  cabang: r.lokasi,
  jamMulai: r.jam === 3 ? "17:00" : "18:00",
  jamSelesai: r.jam === 3 ? "20:00" : "20:00",
  gps: GPS[r.lokasi] ?? `${r.lokasi} · dalam radius`,
  fotoBukti: true,
  status: r.status as LemburDetail["status"],
}));

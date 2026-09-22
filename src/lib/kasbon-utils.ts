/** Pengajuan kasbon tinter · Sheet #19 */

export type KasbonRow = {
  id: string;
  tanggal: string;
  nama: string;
  cabang: string;
  nominal: number;
  keperluan: string;
  status: "Menunggu TTD" | "Disetujui" | "Ditolak" | "Cair";
  catatan?: string;
};

export const INITIAL_KASBON: KasbonRow[] = [
  {
    id: "KB-2026-001",
    tanggal: "2026-09-05",
    nama: "Andi Wijaya",
    cabang: "Auto 2000 Surabaya",
    nominal: 500000,
    keperluan: "Kebutuhan operasional cabang mendadak",
    status: "Cair",
  },
  {
    id: "KB-2026-002",
    tanggal: "2026-09-20",
    nama: "Andi Wijaya",
    cabang: "Auto 2000 Surabaya",
    nominal: 350000,
    keperluan: "Beli consumables mixing mendadak",
    status: "Menunggu TTD",
  },
];

export function kasbonStatusBadge(status: KasbonRow["status"]) {
  return status;
}

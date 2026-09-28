export type AjuanStokDetail = {
  id: string;
  produk: string;
  qty: number;
  cabang: string;
  tinter: string;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  stokSaatIni: string;
  alasan: string;
  catatanApprover?: string;
  refPo?: string;
  refDistribusi?: string;
  /** Kode produk pusat (AXT-xxx) — dipakai saat ajuan disetujui bikin distribusi */
  kodeProduk?: string;
};

export const INITIAL_AJUAN_STOK: AjuanStokDetail[] = [
  {
    id: "AJ-001",
    produk: "Toner HS-30 Black",
    qty: 5,
    cabang: "Surabaya",
    tinter: "Andi Wijaya",
    tanggal: "2026-09-10",
    status: "Menunggu",
    stokSaatIni: "2 kaleng",
    kodeProduk: "AXT-207",
    alasan: "Stok kritis · permintaan mixing meningkat pekan ini",
  },
  {
    id: "AJ-002",
    produk: "Pearl White PW-01",
    qty: 3,
    cabang: "Jember",
    tinter: "Eko Prasetyo",
    tanggal: "2026-09-09",
    status: "Menunggu",
    stokSaatIni: "0 kaleng · habis",
    kodeProduk: "AXT-910",
    alasan: "Sisa stok tidak cukup untuk 2 job Pearl White minggu depan",
  },
];

export function ajuanStatusBadge(status: AjuanStokDetail["status"]): string {
  if (status === "Menunggu") return "Menunggu TTD";
  if (status === "Disetujui") return "Selesai";
  return "Draft";
}

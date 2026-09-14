import { MOCK_CABANG } from "./mock-data";
import { PO_SUPPLIERS } from "./po-utils";

export const KAS_BANK_ACCOUNTS = ["Kas", "Bank BCA", "Bank Mandiri"] as const;

export type SyaratPembayaranRow = {
  id: string;
  kode: string;
  nama: string;
  hari: number;
  keterangan?: string;
  aktif: boolean;
};

export type PelangganRow = {
  id: string;
  kode: string;
  nama: string;
  kota: string;
  syaratBayarId: string;
  npwp?: string;
  kontak: string;
  telepon: string;
  piutang: number;
  status: "Aktif" | "Nonaktif";
};

export type PemasokRow = {
  id: string;
  kode: string;
  nama: string;
  syaratBayarId: string;
  npwp?: string;
  kontak: string;
  telepon: string;
  hutang: number;
  status: "Aktif" | "Nonaktif";
};

export type TransferBankRow = {
  id: string;
  tanggal: string;
  dari: string;
  ke: string;
  jumlah: number;
  keterangan: string;
  jurnalId?: string;
};

export const INITIAL_SYARAT_PEMBAYARAN: SyaratPembayaranRow[] = [
  { id: "sp1", kode: "COD", nama: "Cash on Delivery", hari: 0, keterangan: "Bayar saat terima barang", aktif: true },
  { id: "sp2", kode: "NET14", nama: "Net 14", hari: 14, keterangan: "Jatuh tempo 14 hari", aktif: true },
  { id: "sp3", kode: "NET30", nama: "Net 30", hari: 30, keterangan: "Standar bengkel mitra", aktif: true },
  { id: "sp4", kode: "NET45", nama: "Net 45", hari: 45, keterangan: "Vendor pabrik cat", aktif: true },
];

const PIUTANG_BY_NAMA: Record<string, number> = {
  "Bengkel Auto 2000 Surabaya": 12500000,
  "Bengkel Cakrawala Malang": 0,
  "Bengkel Prima Jember": 8200000,
  "Bengkel Surya Kediri": 0,
};

export const INITIAL_PELANGGAN: PelangganRow[] = MOCK_CABANG.map((c, i) => ({
  id: c.id,
  kode: `PLG-${String(i + 1).padStart(3, "0")}`,
  nama: c.nama.replace(/^Bengkel /, ""),
  kota: c.kota,
  syaratBayarId: "sp3",
  npwp: `01.${String(i + 1).padStart(3, "0")}.123.4-567.890`,
  kontak: `PIC ${c.kota}`,
  telepon: `0812-${1000 + i}000${i}`,
  piutang: PIUTANG_BY_NAMA[c.nama] ?? 0,
  status: "Aktif" as const,
}));

const HUTANG_BY_VENDOR: Record<string, number> = {
  "PT Axalta Indonesia": 8500000,
  "PT Nippon Paint": 5200000,
};

export const INITIAL_PEMASOK: PemasokRow[] = PO_SUPPLIERS.map((nama, i) => ({
  id: String(i + 1),
  kode: `VND-${String(i + 1).padStart(3, "0")}`,
  nama,
  syaratBayarId: "sp4",
  npwp: `02.${String(i + 1).padStart(3, "0")}.456.7-890.123`,
  kontak: `Sales ${nama.split(" ").pop()}`,
  telepon: `021-${5000 + i}000${i}`,
  hutang: HUTANG_BY_VENDOR[nama] ?? 0,
  status: "Aktif" as const,
}));

export const INITIAL_TRANSFER_BANK: TransferBankRow[] = [
  {
    id: "TRF/2026/09/001",
    tanggal: "2026-09-07",
    dari: "Kas",
    ke: "Bank BCA",
    jumlah: 50000000,
    keterangan: "Setor kas ke rekening operasional",
  },
];

export function syaratBayarLabel(syarat: SyaratPembayaranRow): string {
  return syarat.hari === 0 ? syarat.nama : `${syarat.nama} (${syarat.hari} hari)`;
}

export function findSyaratBayar(items: SyaratPembayaranRow[], id: string): SyaratPembayaranRow | undefined {
  return items.find((s) => s.id === id);
}

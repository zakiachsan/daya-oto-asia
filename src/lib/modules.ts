import {
  Paintbrush,
  UserCheck,
  Calculator,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface ModuleMenu {
  href: string;
  label: string;
  desc?: string;
  section?: string;
}

export interface ModuleDef {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  color: { bg: string; icon: string; hover: string; chip: string };
  menus: ModuleMenu[];
  firstMenu?: string;
}

export const MODULES: ModuleDef[] = [
  {
    id: "operasional",
    label: "Operasional",
    desc: "Transaksi warna, WMS, OPB, stok cabang & monitoring",
    icon: Paintbrush,
    color: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      hover: "hover:border-orange-300 hover:bg-orange-50/50",
      chip: "bg-orange-100 text-orange-700",
    },
    menus: [
      { href: "/operasional", label: "Dashboard" },
      { href: "/operasional/transaksi", label: "Transaksi", section: "Operasional" },
      { href: "/operasional/opb", label: "OPB & Tagihan" },
      { href: "/operasional/rekonsiliasi", label: "Rekonsiliasi" },
      { href: "/operasional/verifikasi-klaim", label: "Verifikasi Klaim Warna" },
      { href: "/operasional/inventori", label: "Inventori & Stok", section: "WMS" },
      { href: "/operasional/po", label: "PO & Penerimaan" },
      { href: "/operasional/distribusi", label: "Distribusi Cabang" },
      { href: "/operasional/stock-opname", label: "Stock Opname" },
      { href: "/operasional/ajuan-stok", label: "Ajuan Stok" },
      { href: "/operasional/cabang", label: "Master Cabang", section: "Master Data" },
      { href: "/operasional/produk", label: "Master Produk" },
      { href: "/operasional/kategori-harga", label: "Kategori Harga" },
      { href: "/operasional/kode-warna", label: "Kode Warna" },
      { href: "/operasional/laporan-pemakaian", label: "Laporan Pemakaian Base", section: "Laporan" },
      { href: "/operasional/monitoring", label: "Monitoring" },
      { href: "/operasional/panduan", label: "Panduan" },
    ],
  },
  {
    id: "hris",
    label: "HRIS",
    desc: "Absensi, slip gaji, karyawan, izin, lembur & kinerja tinter",
    icon: UserCheck,
    color: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      hover: "hover:border-blue-300 hover:bg-blue-50/50",
      chip: "bg-blue-100 text-blue-700",
    },
    menus: [
      { href: "/hris", label: "Dashboard" },
      { href: "/hris/absensi", label: "Absensi", section: "Kehadiran" },
      { href: "/hris/karyawan", label: "Karyawan" },
      { href: "/hris/assignment", label: "Assignment Cabang" },
      { href: "/hris/slip-gaji", label: "Slip Gaji", section: "Payroll" },
      { href: "/hris/izin", label: "Izin & Cuti" },
      { href: "/hris/lembur", label: "Lembur" },
      { href: "/hris/kinerja", label: "Kinerja Tinter", section: "Monitoring" },
      { href: "/hris/hr-analytics", label: "HR Analytics" },
      { href: "/hris/users", label: "Users & Akun", section: "Pengaturan" },
      { href: "/hris/panduan", label: "Panduan" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    desc: "Pembukuan Accurate-style · buku besar, kas/bank, penjualan, pembelian, laporan",
    icon: Calculator,
    color: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      hover: "hover:border-amber-300 hover:bg-amber-50/50",
      chip: "bg-amber-100 text-amber-700",
    },
    menus: [
      { href: "/finance", label: "Dashboard" },
      { href: "/finance/buku-besar/akun-perkiraan", label: "Akun Perkiraan", section: "Buku Besar" },
      { href: "/finance/buku-besar/pencatatan-beban", label: "Pencatatan Beban" },
      { href: "/finance/buku-besar/jurnal-umum", label: "Jurnal Umum" },
      { href: "/finance/buku-besar/anggaran", label: "Anggaran" },
      { href: "/finance/buku-besar/histori-akun", label: "Histori Akun" },
      { href: "/finance/buku-besar/log-aktivitas-jurnal", label: "Log Aktivitas Jurnal" },
      { href: "/finance/kas-bank/pembayaran", label: "Pembayaran", section: "Kas & Bank" },
      { href: "/finance/kas-bank/penerimaan", label: "Penerimaan" },
      { href: "/finance/kas-bank/transfer-bank", label: "Transfer Bank" },
      { href: "/finance/kas-bank/rekening-koran", label: "Rekening Koran" },
      { href: "/finance/kas-bank/rekonsiliasi-bank", label: "Rekonsiliasi Bank" },
      { href: "/finance/kas-bank/histori-bank", label: "Histori Bank" },
      { href: "/finance/penjualan/faktur-penjualan", label: "Faktur Penjualan", section: "Penjualan" },
      { href: "/finance/penjualan/penerimaan-penjualan", label: "Penerimaan Penjualan" },
      { href: "/finance/penjualan/uang-muka-penjualan", label: "Uang Muka Penjualan" },
      { href: "/finance/penjualan/retur-penjualan", label: "Retur Penjualan" },
      { href: "/finance/penjualan/pelanggan", label: "Pelanggan" },
      { href: "/finance/persediaan/penyesuaian-persediaan", label: "Penyesuaian Persediaan", section: "Persediaan" },
      { href: "/finance/persediaan/penerimaan-barang", label: "Penerimaan Barang" },
      { href: "/finance/persediaan/barang-jasa", label: "Barang & Jasa" },
      { href: "/finance/persediaan/barang-per-gudang", label: "Barang Per Gudang" },
      { href: "/finance/persediaan/barang-stok-minimum", label: "Barang Stok Minimum" },
      { href: "/finance/pembelian/pesanan-pembelian", label: "Pesanan Pembelian", section: "Pembelian" },
      { href: "/finance/pembelian/faktur-pembelian", label: "Faktur Pembelian" },
      { href: "/finance/pembelian/uang-muka-pembelian", label: "Uang Muka Pembelian" },
      { href: "/finance/pembelian/pembayaran-pembelian", label: "Pembayaran Pembelian" },
      { href: "/finance/pembelian/penerimaan-barang", label: "Penerimaan Barang" },
      { href: "/finance/pembelian/pemasok", label: "Pemasok" },
      { href: "/finance/aset-tetap/aset-tetap", label: "Aset Tetap", section: "Aset Tetap" },
      { href: "/finance/aset-tetap/kategori-aset", label: "Kategori Aset" },
      { href: "/finance/aset-tetap/perubahan-aset-tetap", label: "Perubahan Aset Tetap" },
      { href: "/finance/aset-tetap/disposisi-aset-tetap", label: "Disposisi Aset Tetap" },
      { href: "/finance/aset-tetap/pindah-aset", label: "Pindah Aset" },
      { href: "/finance/aset-tetap/aset-per-lokasi", label: "Aset per Lokasi" },
      { href: "/finance/perusahaan/syarat-pembayaran", label: "Syarat Pembayaran", section: "Perusahaan" },
      { href: "/finance/perusahaan/proses-akhir-bulan", label: "Proses Akhir Bulan" },
      { href: "/finance/perusahaan/gaji-tunjangan", label: "Gaji & Tunjangan" },
      { href: "/finance/perusahaan/karyawan", label: "Karyawan" },
      { href: "/finance/perusahaan/transaksi-berulang", label: "Transaksi Berulang" },
      { href: "/finance/perusahaan/kalender", label: "Kalender" },
      { href: "/finance/perusahaan/kontak", label: "Kontak" },
      { href: "/finance/perusahaan/transaksi-favorit", label: "Transaksi Favorit" },
      { href: "/finance/perusahaan/log-aktivitas", label: "Log Aktivitas" },
      { href: "/finance/laporan/laba-rugi", label: "Laba Rugi", section: "Laporan Keuangan" },
      { href: "/finance/laporan/neraca", label: "Neraca" },
      { href: "/finance/laporan/arus-kas", label: "Arus Kas" },
      { href: "/finance/laporan/laba-ditahan", label: "Laba Ditahan" },
      { href: "/finance/laporan/rasio-keuangan", label: "Rasio Keuangan" },
      { href: "/finance/laporan/perubahan-equitas", label: "Perubahan Equitas" },
      { href: "/finance/laporan/grafik", label: "Grafik" },
      { href: "/finance/laporan/laporan-penjualan", label: "Laporan Penjualan" },
      { href: "/finance/laporan/laporan-pembelian", label: "Laporan Pembelian" },
      { href: "/finance/laporan/hutang-piutang", label: "Hutang Piutang" },
      { href: "/finance/laporan/perpajakan", label: "Perpajakan" },
      { href: "/finance/daftar-laporan", label: "Daftar Laporan" },
      { href: "/finance/panduan", label: "Panduan" },
    ],
  },
];

export const MOBILE_MODULE: ModuleDef = {
  id: "mobile",
  label: "App Tinter",
  desc: "Aplikasi lapangan untuk manpower",
  icon: Smartphone,
  color: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    hover: "hover:border-emerald-300",
    chip: "bg-emerald-100 text-emerald-700",
  },
  firstMenu: "/app",
  menus: [
    { href: "/app", label: "Beranda" },
    { href: "/app/transaksi", label: "Transaksi" },
    { href: "/app/transaksi/baru", label: "Buat Transaksi" },
    { href: "/app/absensi", label: "Absensi" },
    { href: "/app/stok", label: "Stok Cabang" },
    { href: "/app/stock-opname", label: "Stock Opname" },
    { href: "/app/buka-kaleng", label: "Buka Kaleng" },
    { href: "/app/ajukan-stok", label: "Ajukan Stok" },
    { href: "/app/slip-gaji", label: "Slip Gaji" },
    { href: "/app/kasbon", label: "Kasbon" },
    { href: "/app/profil", label: "Profil" },
  ],
};

export function getModuleByPath(pathname: string): ModuleDef | undefined {
  if (pathname.startsWith("/app")) return MOBILE_MODULE;
  return MODULES.find((m) => pathname === `/${m.id}` || pathname.startsWith(`/${m.id}/`));
}

export function getModuleMenus(modId: string): ModuleMenu[] {
  if (modId === "mobile") return MOBILE_MODULE.menus;
  return MODULES.find((m) => m.id === modId)?.menus ?? [];
}

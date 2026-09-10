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
      { href: "/operasional/transaksi", label: "Transaksi Warna", section: "Operasional" },
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
    desc: "COA, jurnal, kas-bank, faktur, laporan keuangan & PPN",
    icon: Calculator,
    color: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      hover: "hover:border-amber-300 hover:bg-amber-50/50",
      chip: "bg-amber-100 text-amber-700",
    },
    menus: [
      { href: "/finance", label: "Dashboard" },
      { href: "/finance/coa", label: "Akun Perkiraan", section: "Buku Besar" },
      { href: "/finance/jurnal", label: "Jurnal Umum" },
      { href: "/finance/kas-bank", label: "Kas & Bank", section: "Transaksi" },
      { href: "/finance/faktur-penjualan", label: "Faktur Penjualan" },
      { href: "/finance/faktur-pembelian", label: "Faktur Pembelian" },
      { href: "/finance/hutang-piutang", label: "Hutang / Piutang" },
      { href: "/finance/penyesuaian-stok", label: "Penyesuaian Stok" },
      { href: "/finance/neraca", label: "Neraca", section: "Laporan Keuangan" },
      { href: "/finance/laba-rugi", label: "Laba Rugi" },
      { href: "/finance/arus-kas", label: "Arus Kas" },
      { href: "/finance/perpajakan", label: "Perpajakan", section: "Pengaturan" },
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
    { href: "/app/transaksi", label: "Transaksi Warna" },
    { href: "/app/transaksi/baru", label: "Buat Transaksi" },
    { href: "/app/absensi", label: "Absensi" },
    { href: "/app/stock-opname", label: "Stock Opname" },
    { href: "/app/buka-kaleng", label: "Buka Kaleng" },
    { href: "/app/ajukan-stok", label: "Ajukan Stok" },
    { href: "/app/slip-gaji", label: "Slip Gaji" },
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

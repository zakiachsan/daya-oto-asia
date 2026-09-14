import { a, g } from "./helpers";
import type { GuideModuleId, ModuleGuideNav } from "./types";

const H = "hris" as GuideModuleId;
const M = "mobile" as GuideModuleId;
const F = "finance" as GuideModuleId;
const O = "operasional" as GuideModuleId;

export const hrisGuideNav: ModuleGuideNav = {
  moduleId: "hris",
  title: "Panduan HRIS",
  subtitle: "Klik menu di kiri — alur kerja ditampilkan dari atas ke bawah.",
  sections: [
    { key: "dashboard", label: "Dashboard", items: [{ id: "dashboard", label: "Dashboard" }] },
    {
      key: "kehadiran",
      label: "Kehadiran",
      items: [
        { id: "absensi", label: "Absensi & Kehadiran" },
        { id: "assignment", label: "Assignment Cabang" },
      ],
    },
    {
      key: "approval",
      label: "Izin & Lembur",
      items: [
        { id: "izin-cuti", label: "Izin & Cuti" },
        { id: "lembur", label: "Lembur" },
      ],
    },
    {
      key: "payroll",
      label: "Payroll",
      items: [{ id: "slip-gaji", label: "Slip Gaji" }],
    },
    {
      key: "kinerja",
      label: "Monitoring",
      items: [
        { id: "kinerja-tinter", label: "Kinerja Tinter" },
        { id: "hr-analytics", label: "HR Analytics" },
      ],
    },
    {
      key: "master",
      label: "Master & Akun",
      items: [
        { id: "karyawan", label: "Karyawan" },
        { id: "users", label: "Users & Akun" },
      ],
    },
  ],
  guides: {
    dashboard: g(
      "dashboard",
      "Dashboard HRIS",
      "Dashboard",
      "/hris",
      "Ringkasan kehadiran, payroll pending, izin/lembur menunggu approval.",
      [
        a(H, "Review KPI Kehadiran Bulan Ini"),
        a(H, "Cek Izin/Lembur Pending", "/hris/izin"),
        a(H, "Monitor Slip Gaji Periode Aktif", "/hris/slip-gaji"),
        a(H, "Lihat Kinerja Tinter", "/hris/kinerja"),
      ],
    ),
    absensi: g(
      "absensi",
      "Absensi & Kehadiran (App → HRIS)",
      "Absensi & Kehadiran",
      "/hris/absensi",
      "Tinter check-in via App dengan geofence cabang. HR monitoring kehadiran harian dan rekap bulanan.",
      [
        a(M, "Check-in / Check-out via App", "/app/absensi"),
        a(H, "Buka Rekap Absensi", "/hris/absensi"),
        a(H, "Filter Bulan & Cabang"),
        a(H, "Koreksi Record Manual (Admin)"),
        a(H, "Data Masuk Perhitungan Slip Gaji", "/hris/slip-gaji"),
      ],
    ),
    assignment: g(
      "assignment",
      "Assignment Cabang",
      "Assignment Cabang",
      "/hris/assignment",
      "HR assign tinter ke bengkel mitra. Kapasitas cabang dibatasi per jumlah tinter.",
      [
        a(H, "Buka Assignment Cabang", "/hris/assignment"),
        a(H, "Pilih Karyawan & Cabang Tujuan"),
        a(H, "Set Periode Penugasan"),
        a(H, "Simpan — Tinter Aktif di Cabang"),
        a(M, "Tinter Login App → Transaksi di Cabang Assigned", "/app/transaksi/baru"),
      ],
    ),
    "izin-cuti": g(
      "izin-cuti",
      "Izin & Cuti (App → HRIS)",
      "Izin & Cuti",
      "/hris/izin",
      "Karyawan ajukan via App. Supervisor/HR approve atau reject. Status real-time di dashboard HRIS.",
      [
        a(M, "Ajukan Izin/Cuti dari App", "/app/izin"),
        a(H, "Review Pengajuan", "/hris/izin"),
        a(H, "Approve / Reject + Catatan"),
        a(H, "Update Rekap Absensi"),
      ],
    ),
    lembur: g(
      "lembur",
      "Lembur (App → HRIS → Slip Gaji)",
      "Lembur",
      "/hris/lembur",
      "Approval jam lembur — masuk perhitungan payroll periode berjalan.",
      [
        a(M, "Ajukan Lembur dari App", "/app/lembur"),
        a(H, "Review Pengajuan Lembur", "/hris/lembur"),
        a(H, "Approve Jam Lembur"),
        a(H, "Otomatis Masuk Slip Gaji", "/hris/slip-gaji"),
      ],
    ),
    "slip-gaji": g(
      "slip-gaji",
      "Payroll & Slip Gaji (HRIS → App → Finance)",
      "Slip Gaji",
      "/hris/slip-gaji",
      "Slip gaji digenerate per periode. HR finalize sebelum dibagikan ke karyawan via App.",
      [
        a(H, "Pilih Periode Gaji", "/hris/slip-gaji"),
        a(H, "Generate Slip per Karyawan"),
        a(H, "Komponen: Pokok, Tunjangan, Potongan, Lembur"),
        a(H, "Finalisasi Slip Gaji"),
        a(M, "Karyawan Lihat Slip di App", "/app/slip-gaji"),
        a(F, "Posting Gaji & Tunjangan", "/finance/perusahaan/gaji-tunjangan"),
        a(F, "Bayar Gaji via Kas/Bank", "/finance/kas-bank/pembayaran"),
      ],
    ),
    "kinerja-tinter": g(
      "kinerja-tinter",
      "Kinerja Tinter",
      "Kinerja Tinter",
      "/hris/kinerja",
      "Monitoring durasi mixing, jumlah transaksi, pemakaian bahan per tinter. Drill-down ke detail transaksi.",
      [
        a(O, "Sumber Data Transaksi", "/operasional/transaksi"),
        a(H, "Buka Kinerja Tinter", "/hris/kinerja"),
        a(H, "Filter Cabang & Periode"),
        a(H, "Review KPI per Tinter — Durasi, Qty, Efisiensi"),
        a(H, "Drill-down Detail Transaksi"),
      ],
    ),
    "hr-analytics": g(
      "hr-analytics",
      "HR Analytics",
      "HR Analytics",
      "/hris/hr-analytics",
      "Dashboard analitik — turnover, kehadiran, biaya tenaga kerja.",
      [
        a(H, "Pilih Metrik & Periode", "/hris/hr-analytics"),
        a(H, "Review Trend & Grafik"),
        a(H, "Export Laporan HR"),
      ],
    ),
    karyawan: g(
      "karyawan",
      "Data Karyawan",
      "Karyawan",
      "/hris/karyawan",
      "Master data karyawan/tinter — profil, jabatan, cabang.",
      [
        a(H, "Kelola Data Karyawan", "/hris/karyawan"),
        a(H, "Assign Cabang", "/hris/assignment"),
        a(H, "Link Akun App", "/hris/users"),
        a(F, "Mirror di Finance Karyawan", "/finance/perusahaan/karyawan"),
      ],
    ),
    users: g(
      "users",
      "Users & Akun App",
      "Users & Akun",
      "/hris/users",
      "Kelola akun login App Tinter & role akses dashboard.",
      [
        a(H, "Buat Akun Karyawan/Tinter", "/hris/users"),
        a(H, "Set Role & Cabang Akses"),
        a(M, "Login App dengan Akun Terkait", "/app"),
      ],
    ),
  },
};

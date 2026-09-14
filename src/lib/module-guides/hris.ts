import { MODULES } from "@/lib/modules";
import { buildSectionsFromMenus } from "./build-nav";
import { a, g, simpleGuide } from "./helpers";
import type { GuideModuleId, ModuleGuideNav } from "./types";

const H = "hris" as GuideModuleId;
const M = "mobile" as GuideModuleId;
const F = "finance" as GuideModuleId;
const O = "operasional" as GuideModuleId;

const hrisMenus = MODULES.find((m) => m.id === "hris")!.menus;

export const hrisGuideNav: ModuleGuideNav = {
  moduleId: "hris",
  title: "Panduan HRIS",
  subtitle: "Klik menu di kiri — alur kerja ditampilkan dari atas ke bawah.",
  sections: buildSectionsFromMenus(hrisMenus),
  guides: {
    dashboard: g(
      "dashboard",
      "Ringkasan Modul HRIS",
      "Dashboard",
      "/hris",
      "Gambaran alur HR — absensi, payroll, izin/lembur, dan integrasi App Tinter.",
      [
        a(M, "Tinter absensi & ajuan via App", "/app/absensi"),
        a(H, "Rekap absensi & koreksi manual", "/hris/absensi"),
        a(H, "Slip gaji per periode", "/hris/slip-gaji"),
        a(H, "Approve izin & lembur", "/hris/izin"),
        a(H, "Monitor kinerja tinter", "/hris/kinerja"),
        a(F, "Posting gaji ke Finance", "/finance/perusahaan/gaji-tunjangan"),
      ],
    ),
    absensi: g(
      "absensi",
      "Absensi (App → HRIS)",
      "Absensi",
      "/hris/absensi",
      "Tinter check-in/out via App; HR pantau rekap & koreksi manual.",
      [
        a(M, "Check-in / check-out harian", "/app/absensi"),
        a(H, "Buka rekap Absensi HRIS", "/hris/absensi"),
        a(H, "Filter per bulan & cabang"),
        a(H, "Lihat detail absensi per karyawan"),
        a(H, "Koreksi / tambah record manual (Admin)"),
        a(H, "Data absensi masuk perhitungan slip gaji", "/hris/slip-gaji"),
      ],
    ),
    karyawan: g(
      "karyawan",
      "Data Karyawan",
      "Karyawan",
      "/hris/karyawan",
      "Master data karyawan/tinter — profil, jabatan, cabang assignment.",
      [
        a(H, "Buka daftar Karyawan", "/hris/karyawan"),
        a(H, "Tambah karyawan baru"),
        a(H, "Edit profil (jabatan, cabang, kontak)"),
        a(H, "Assign ke cabang", "/hris/assignment"),
        a(H, "Link akun App Tinter", "/hris/users"),
      ],
    ),
    assignment: g(
      "assignment",
      "Assignment Cabang",
      "Assignment Cabang",
      "/hris/assignment",
      "Penempatan tinter/manpower ke cabang bengkel.",
      [
        a(H, "Buka Assignment Cabang", "/hris/assignment"),
        a(H, "Pilih karyawan & cabang tujuan"),
        a(H, "Set periode penugasan"),
        a(H, "Simpan — tinter muncul di cabang terkait"),
        a(M, "Tinter login App → transaksi di cabang assigned"),
      ],
    ),
    "slip-gaji": g(
      "slip-gaji",
      "Slip Gaji (HRIS → App → Finance)",
      "Slip Gaji",
      "/hris/slip-gaji",
      "Buat slip gaji per periode; tinter lihat di App; posting ke Finance.",
      [
        a(H, "Buka daftar Slip Gaji", "/hris/slip-gaji"),
        a(H, "Pilih periode gaji"),
        a(H, "Generate slip per karyawan"),
        a(H, "Komponen: gaji pokok, tunjangan, potongan, lembur"),
        a(H, "Finalisasi slip gaji"),
        a(M, "Tinter lihat slip di App", "/app/slip-gaji"),
        a(F, "Posting gaji & tunjangan", "/finance/perusahaan/gaji-tunjangan"),
        a(F, "Jurnal beban gaji otomatis"),
      ],
    ),
    izin: g(
      "izin",
      "Izin & Cuti (App → HRIS)",
      "Izin & Cuti",
      "/hris/izin",
      "Tinter ajukan izin via App; supervisor/HR approve.",
      [
        a(M, "Ajukan izin/cuti dari App"),
        a(H, "Review pengajuan di Izin & Cuti", "/hris/izin"),
        a(H, "Approve / reject dengan catatan"),
        a(H, "Izin approved → update rekap absensi"),
      ],
    ),
    lembur: g(
      "lembur",
      "Lembur (App → HRIS → Slip Gaji)",
      "Lembur",
      "/hris/lembur",
      "Approval jam lembur tinter — masuk perhitungan payroll.",
      [
        a(M, "Ajukan lembur dari App"),
        a(H, "Review pengajuan Lembur", "/hris/lembur"),
        a(H, "Approve jam lembur"),
        a(H, "Lembur approved → masuk Slip Gaji", "/hris/slip-gaji"),
      ],
    ),
    kinerja: g(
      "kinerja",
      "Kinerja Tinter",
      "Kinerja Tinter",
      "/hris/kinerja",
      "Monitor produktivitas tinter — transaksi, efisiensi mixing, rating.",
      [
        a(O, "Data transaksi dari Operasional", "/operasional/transaksi"),
        a(H, "Buka Kinerja Tinter", "/hris/kinerja"),
        a(H, "Filter per cabang & periode"),
        a(H, "Review KPI per tinter"),
        a(H, "Ranking & trend kinerja"),
      ],
    ),
    "hr-analytics": simpleGuide(
      "hr-analytics",
      "HR Analytics",
      "/hris/hr-analytics",
      "Dashboard analitik HR — turnover, kehadiran, biaya tenaga kerja.",
      H,
      ["Buka HR Analytics", "Pilih metrik & periode", "Review trend & grafik", "Export laporan"],
    ),
    users: g(
      "users",
      "Users & Akun App",
      "Users & Akun",
      "/hris/users",
      "Kelola akun login App Tinter & role akses dashboard.",
      [
        a(H, "Buka Users & Akun", "/hris/users"),
        a(H, "Buat akun untuk tinter/karyawan"),
        a(H, "Set role & cabang akses"),
        a(M, "Karyawan login App dengan akun terkait"),
      ],
    ),
  },
};

import { PageHeader } from "@/components/ui/page-header";
import { GuideSections } from "@/components/ui/guide-sections";

const SECTIONS = [
  {
    title: "1. Absensi & Kehadiran",
    body: "Tinter check-in via App dengan geofence cabang. HR monitoring kehadiran harian dan rekap bulanan.",
    links: [
      { href: "/hris/absensi", label: "Absensi" },
      { href: "/app/absensi", label: "App — Absensi" },
    ],
  },
  {
    title: "2. Assignment Cabang",
    body: "HR assign tinter ke bengkel mitra. Kapasitas cabang dibatasi per jumlah tinter. Perubahan assignment disimpan dan tercatat.",
    links: [{ href: "/hris/assignment", label: "Assignment Cabang" }],
  },
  {
    title: "3. Izin, Cuti & Lembur",
    body: "Karyawan ajukan via App. Supervisor/HR approve atau reject. Status real-time di dashboard HRIS.",
    links: [
      { href: "/hris/izin", label: "Izin & Cuti" },
      { href: "/hris/lembur", label: "Lembur" },
    ],
  },
  {
    title: "4. Payroll & Slip Gaji",
    body: "Slip gaji digenerate per periode. HR finalize sebelum dibagikan ke karyawan via App.",
    links: [
      { href: "/hris/slip-gaji", label: "Slip Gaji" },
      { href: "/app/slip-gaji", label: "App — Slip Gaji" },
    ],
  },
  {
    title: "5. Kinerja Tinter",
    body: "Monitoring durasi mixing, jumlah transaksi, dan pemakaian bahan per tinter. Drill-down ke detail transaksi untuk evaluasi KPI.",
    links: [{ href: "/hris/kinerja", label: "Kinerja Tinter" }],
  },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Panduan HRIS"
        desc="Referensi alur kerja modul HRIS Daya Oto Asia"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Panduan" }]}
      />
      <GuideSections sections={SECTIONS} />
    </div>
  );
}

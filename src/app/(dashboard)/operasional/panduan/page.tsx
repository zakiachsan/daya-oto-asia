import { PageHeader } from "@/components/ui/page-header";
import { GuideSections } from "@/components/ui/guide-sections";

const SECTIONS = [
  {
    title: "1. Alur Transaksi Warna (App Tinter)",
    body: "Tinter input transaksi via App: pilih mobil & warna, mixing (timer durasi), cetak nota wajib, TTD DocuMatrix kepala bengkel, selesai.\nPenambahan bahan diperbolehkan sebelum lock, ke mobil yang sama.",
    links: [
      { href: "/operasional/transaksi", label: "Monitoring Transaksi" },
      { href: "/app/transaksi/baru", label: "App - Buat Transaksi" },
    ],
  },
  {
    title: "2. OPB Bulanan & Tagihan",
    body: "Admin cabang generate OPB dari transaksi finalized, TTD, forward ke HO, rekonsiliasi, input no. SAP, status Ditagihkan.\nFinance generate faktur penjualan dari OPB yang sudah ditagihkan.",
    links: [
      { href: "/operasional/opb", label: "OPB & Tagihan" },
      { href: "/finance/penjualan/faktur-penjualan", label: "Faktur Penjualan" },
    ],
  },
  {
    title: "3. Rekonsiliasi & Anti-Leakage",
    body: "Supervisor cocokkan OPB vs nota cetak vs pemakaian stok. Selisih perlu review. Deteksi leakage: stok habis tapi OPB belum terbentuk, atau nota cetak lebih besar dari OPB.",
    links: [{ href: "/operasional/rekonsiliasi", label: "Rekonsiliasi OPB" }],
  },
  {
    title: "4. WMS - PO, Distribusi, Stock Opname",
    body: "PO ke pabrik, Goods Received, stok pusat. Distribusi ke cabang. Stock opname: tinter timbang gram, supervisor rekonsiliasi toleransi.",
    links: [
      { href: "/operasional/po", label: "PO & Penerimaan" },
      { href: "/operasional/distribusi", label: "Distribusi Cabang" },
      { href: "/operasional/stock-opname", label: "Stock Opname" },
    ],
  },
  {
    title: "5. Verifikasi Klaim Warna",
    body: "Bengkel klaim pekerjaan warna sudah dilakukan. Supervisor cek apakah ada transaksi matching (kode warna + cabang + plat) di sistem.",
    links: [{ href: "/operasional/verifikasi-klaim", label: "Verifikasi Klaim" }],
  },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Panduan Operasional"
        desc="Referensi alur kerja modul operasional Daya Oto Asia"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Panduan" }]}
      />
      <GuideSections sections={SECTIONS} />
    </div>
  );
}

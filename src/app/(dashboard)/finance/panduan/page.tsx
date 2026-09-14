import { PageHeader } from "@/components/ui/page-header";
import { GuideSections } from "@/components/ui/guide-sections";

const SECTIONS = [
  {
    title: "1. Buku Besar",
    body: "COA, pencatatan beban, jurnal umum, anggaran, histori akun — fondasi pembukuan Accurate-style.",
    links: [
      { href: "/finance/buku-besar/akun-perkiraan", label: "Akun Perkiraan" },
      { href: "/finance/buku-besar/jurnal-umum", label: "Jurnal Umum" },
      { href: "/finance/buku-besar/histori-akun", label: "Histori Akun" },
    ],
  },
  {
    title: "2. Kas & Bank",
    body: "Pembayaran, penerimaan, transfer, rekening koran, rekonsiliasi.",
    links: [
      { href: "/finance/kas-bank/pembayaran", label: "Pembayaran" },
      { href: "/finance/kas-bank/penerimaan", label: "Penerimaan" },
      { href: "/finance/kas-bank/rekonsiliasi-bank", label: "Rekonsiliasi Bank" },
    ],
  },
  {
    title: "3. Penjualan (Tagihan Bengkel)",
    body: "OPB → Faktur Penjualan → Penerimaan Penjualan → Piutang lunas.",
    links: [
      { href: "/finance/penjualan/faktur-penjualan", label: "Faktur Penjualan" },
      { href: "/finance/penjualan/penerimaan-penjualan", label: "Penerimaan Penjualan" },
      { href: "/operasional/opb", label: "OPB & Tagihan" },
    ],
  },
  {
    title: "4. Pembelian (Vendor Toner)",
    body: "PO → Penerimaan Barang → Faktur Pembelian → Pembayaran Pembelian.",
    links: [
      { href: "/finance/pembelian/pesanan-pembelian", label: "Pesanan Pembelian" },
      { href: "/finance/pembelian/faktur-pembelian", label: "Faktur Pembelian" },
      { href: "/finance/pembelian/pembayaran-pembelian", label: "Pembayaran Pembelian" },
      { href: "/operasional/po", label: "PO & Penerimaan" },
    ],
  },
  {
    title: "5. Persediaan & Penyesuaian",
    body: "Stock opname cabang → penyesuaian persediaan → auto jurnal.",
    links: [
      { href: "/finance/persediaan/penyesuaian-persediaan", label: "Penyesuaian Persediaan" },
      { href: "/operasional/stock-opname", label: "Stock Opname" },
    ],
  },
  {
    title: "6. Laporan & Pajak",
    body: "Neraca, laba rugi, arus kas, hutang piutang, daftar laporan Accurate-style.",
    links: [
      { href: "/finance/laporan/neraca", label: "Neraca" },
      { href: "/finance/laporan/laba-rugi", label: "Laba Rugi" },
      { href: "/finance/laporan/hutang-piutang", label: "Hutang Piutang" },
      { href: "/finance/daftar-laporan", label: "Daftar Laporan" },
    ],
  },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Panduan Finance"
        desc="Alur kerja modul Finance — struktur Accurate (erp-scw-distribution)"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Panduan" }]}
      />
      <GuideSections sections={SECTIONS} />
    </div>
  );
}

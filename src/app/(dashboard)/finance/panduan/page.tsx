import { PageHeader } from "@/components/ui/page-header";
import { GuideSections } from "@/components/ui/guide-sections";

const SECTIONS = [
  {
    title: "1. Chart of Accounts & Jurnal",
    body: "COA sebagai master akun. Jurnal umum untuk posting transaksi keuangan. Status Draft → Posted setelah review.",
    links: [
      { href: "/finance/coa", label: "Akun Perkiraan" },
      { href: "/finance/jurnal", label: "Jurnal Umum" },
    ],
  },
  {
    title: "2. Kas & Bank",
    body: "Pencatatan arus kas masuk/keluar. Rekonsiliasi saldo bank dengan mutasi.",
    links: [{ href: "/finance/kas-bank", label: "Kas & Bank" }],
  },
  {
    title: "3. Faktur Penjualan dari OPB",
    body: "Tagihan bulanan ke bengkel mitra di-generate dari OPB status Ditagihkan (sudah ada no. SAP). Total mengikuti OPB periode terkait.",
    links: [
      { href: "/finance/faktur-penjualan", label: "Faktur Penjualan" },
      { href: "/operasional/opb", label: "OPB & Tagihan" },
    ],
  },
  {
    title: "4. Faktur Pembelian & Hutang/Piutang",
    body: "Faktur pembelian dari supplier (PO pabrik). Monitoring hutang piutang mitra dan supplier.",
    links: [
      { href: "/finance/faktur-pembelian", label: "Faktur Pembelian" },
      { href: "/finance/hutang-piutang", label: "Hutang / Piutang" },
    ],
  },
  {
    title: "5. Laporan Keuangan & Pajak",
    body: "Neraca, laba rugi, arus kas di-generate dari jurnal posted. Modul perpajakan untuk PPN dan pelaporan.",
    links: [
      { href: "/finance/neraca", label: "Neraca" },
      { href: "/finance/laba-rugi", label: "Laba Rugi" },
      { href: "/finance/perpajakan", label: "Perpajakan" },
    ],
  },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Panduan Finance"
        desc="Referensi alur kerja modul Finance Daya Oto Asia"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Panduan" }]}
      />
      <GuideSections sections={SECTIONS} />
    </div>
  );
}

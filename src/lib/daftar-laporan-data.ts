export type ReportIcon = "doc" | "grid" | "chart";

export type ReportItem = {
  title: string;
  desc: string;
  icon: ReportIcon;
};

export type ReportCategory = {
  key: string;
  label: string;
  reports: ReportItem[];
};

function r(title: string, desc: string, icon: ReportIcon = "doc"): ReportItem {
  return { title, desc, icon };
}

/** Katalog laporan Accurate-style · subset relevan DOA */
export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    key: "keuangan",
    label: "Keuangan",
    reports: [
      r("Laba/Rugi (Standar)", "Laba rugi periode terpilih"),
      r("Neraca (Standar)", "Neraca posisi keuangan"),
      r("Arus Kas (Langsung)", "Arus kas operasi, investasi, pendanaan"),
      r("Rasio Keuangan", "Likuiditas, leverage, profitability", "grid"),
    ],
  },
  {
    key: "buku-besar",
    label: "Buku Besar",
    reports: [
      r("Keseluruhan Jurnal", "Semua jurnal posted"),
      r("Neraca Percobaan", "Trial balance per periode"),
      r("Histori Buku Besar", "Mutasi per akun dengan saldo berjalan"),
      r("Daftar Akun Perkiraan", "Export COA", "grid"),
    ],
  },
  {
    key: "kas-bank",
    label: "Kas & Bank",
    reports: [
      r("Rekening Koran", "Mutasi per rekening"),
      r("Histori Bank", "Semua transaksi kas/bank"),
      r("Rekonsiliasi Bank", "Selisih buku vs bank"),
    ],
  },
  {
    key: "piutang",
    label: "Piutang",
    reports: [
      r("Faktur Belum Lunas", "AR outstanding bengkel"),
      r("Umur Piutang", "Aging piutang per bengkel", "grid"),
      r("Buku Besar Pembantu Piutang", "Mutasi piutang per pelanggan"),
    ],
  },
  {
    key: "utang",
    label: "Utang",
    reports: [
      r("Faktur Belum Lunas", "AP outstanding vendor"),
      r("Umur Utang", "Aging hutang supplier", "grid"),
    ],
  },
  {
    key: "penjualan",
    label: "Penjualan",
    reports: [
      r("Penjualan per Bengkel", "Rekap tagihan OPB/faktur", "grid"),
      r("Histori Faktur Penjualan", "Daftar faktur per periode"),
    ],
  },
  {
    key: "pembelian",
    label: "Pembelian",
    reports: [
      r("Pembelian per Vendor", "Rekap PO & faktur beli", "grid"),
      r("Histori Faktur Pembelian", "Daftar faktur vendor"),
    ],
  },
  {
    key: "persediaan",
    label: "Persediaan",
    reports: [
      r("Nilai Persediaan", "Stok toner per cabang", "grid"),
      r("Penyesuaian Stok", "Histori penyesuaian dari opname"),
      r("Kartu Stok", "Mutasi per produk"),
    ],
  },
  {
    key: "pajak",
    label: "Pajak",
    reports: [
      r("PPN Keluaran", "Dari faktur penjualan"),
      r("PPN Masukan", "Dari faktur pembelian"),
      r("Rekonsiliasi PPN", "Neto PPN keluaran vs masukan"),
    ],
  },
];

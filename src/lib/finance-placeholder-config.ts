export type FinancePlaceholderDef = {
  title: string;
  section: string;
  desc?: string;
  features?: string[];
  mirrorHref?: string;
  mirrorLabel?: string;
};

/** Placeholder pages — key = path under /finance/ (no leading slash) */
export const FINANCE_PLACEHOLDERS: Record<string, FinancePlaceholderDef> = {
  "buku-besar/pencatatan-beban": {
    title: "Pencatatan Beban",
    section: "Buku Besar",
    desc: "Catat beban operasional — auto jurnal Dr Beban / Cr Hutang.",
    features: ["Form beban multi-akun", "Status accrual vs lunas", "Link ke pembayaran kas/bank"],
  },
  "buku-besar/anggaran": {
    title: "Anggaran",
    section: "Buku Besar",
    desc: "Anggaran per akun per periode — bandingkan realisasi vs budget.",
  },
  "buku-besar/histori-akun": {
    title: "Histori Akun",
    section: "Buku Besar",
    desc: "Buku besar per akun dengan saldo berjalan.",
    features: ["Filter akun & periode", "Dr/Kr mutasi", "Saldo akhir"],
  },
  "buku-besar/log-aktivitas-jurnal": {
    title: "Log Aktivitas Jurnal",
    section: "Buku Besar",
    desc: "Audit trail create/post/reverse jurnal.",
  },
  "kas-bank/transfer-bank": {
    title: "Transfer Bank",
    section: "Kas & Bank",
    desc: "Transfer antar rekening kas/bank — auto jurnal.",
  },
  "kas-bank/rekening-koran": {
    title: "Rekening Koran",
    section: "Kas & Bank",
    desc: "Mutasi per rekening dengan saldo awal/akhir.",
  },
  "kas-bank/rekonsiliasi-bank": {
    title: "Rekonsiliasi Bank",
    section: "Kas & Bank",
    desc: "Cocokkan saldo buku vs rekening koran bank.",
  },
  "kas-bank/histori-bank": {
    title: "Histori Bank",
    section: "Kas & Bank",
    desc: "Semua mutasi akun kas & bank.",
  },
  "penjualan/penerimaan-penjualan": {
    title: "Penerimaan Penjualan",
    section: "Penjualan",
    desc: "Pelunasan piutang bengkel — Dr Kas / Cr Piutang.",
    features: ["Pilih faktur penjualan", "Partial/full payment", "Auto jurnal & update AR"],
  },
  "penjualan/uang-muka-penjualan": {
    title: "Uang Muka Penjualan",
    section: "Penjualan",
    desc: "DP dari bengkel sebelum faktur penuh.",
  },
  "penjualan/retur-penjualan": {
    title: "Retur Penjualan",
    section: "Penjualan",
    desc: "Koreksi faktur / retur tagihan bengkel.",
  },
  "penjualan/pelanggan": {
    title: "Pelanggan",
    section: "Penjualan",
    desc: "Master bengkel mitra — mirror dari Operasional.",
    mirrorHref: "/operasional/cabang",
    mirrorLabel: "Master Cabang (Operasional)",
  },
  "persediaan/penerimaan-barang": {
    title: "Penerimaan Barang",
    section: "Persediaan",
    desc: "GR toner/cat — mirror dari PO Operasional.",
    mirrorHref: "/operasional/po",
    mirrorLabel: "PO & Penerimaan (Operasional)",
  },
  "persediaan/barang-jasa": {
    title: "Barang & Jasa",
    section: "Persediaan",
    desc: "Master produk toner/cat.",
    mirrorHref: "/operasional/produk",
    mirrorLabel: "Master Produk (Operasional)",
  },
  "persediaan/barang-per-gudang": {
    title: "Barang Per Gudang",
    section: "Persediaan",
    desc: "Stok per cabang/gudang dengan nilai persediaan.",
  },
  "persediaan/barang-stok-minimum": {
    title: "Barang Stok Minimum",
    section: "Persediaan",
    desc: "Alert stok minimum per cabang.",
    mirrorHref: "/operasional/inventori",
    mirrorLabel: "Inventori & Stok",
  },
  "pembelian/pesanan-pembelian": {
    title: "Pesanan Pembelian",
    section: "Pembelian",
    desc: "Monitor PO ke pabrik — mirror Operasional.",
    mirrorHref: "/operasional/po",
    mirrorLabel: "PO & Penerimaan (Operasional)",
  },
  "pembelian/uang-muka-pembelian": {
    title: "Uang Muka Pembelian",
    section: "Pembelian",
    desc: "DP ke vendor sebelum faktur pembelian.",
  },
  "pembelian/pembayaran-pembelian": {
    title: "Pembayaran Pembelian",
    section: "Pembelian",
    desc: "Pelunasan hutang vendor — Dr Hutang / Cr Kas.",
    features: ["DP → GR → Faktur → Pelunasan", "Link faktur pembelian"],
  },
  "pembelian/penerimaan-barang": {
    title: "Penerimaan Barang",
    section: "Pembelian",
    desc: "Goods received dari PO vendor.",
    mirrorHref: "/operasional/po",
    mirrorLabel: "PO & Penerimaan (Operasional)",
  },
  "pembelian/pemasok": {
    title: "Pemasok",
    section: "Pembelian",
    desc: "Master vendor pabrik cat (Axalta, Nippon, dll).",
  },
  "aset-tetap/aset-tetap": {
    title: "Aset Tetap",
    section: "Aset Tetap",
    desc: "Register aset + penyusutan bulanan.",
  },
  "aset-tetap/kategori-aset": {
    title: "Kategori Aset",
    section: "Aset Tetap",
    desc: "Klasifikasi aset tetap.",
  },
  "aset-tetap/perubahan-aset-tetap": {
    title: "Perubahan Aset Tetap",
    section: "Aset Tetap",
    desc: "Histori perubahan nilai/masa manfaat.",
  },
  "aset-tetap/disposisi-aset-tetap": {
    title: "Disposisi Aset Tetap",
    section: "Aset Tetap",
    desc: "Pelepasan aset + jurnal gain/loss.",
  },
  "aset-tetap/pindah-aset": {
    title: "Pindah Aset",
    section: "Aset Tetap",
    desc: "Transfer lokasi aset antar cabang.",
  },
  "aset-tetap/aset-per-lokasi": {
    title: "Aset per Lokasi",
    section: "Aset Tetap",
    desc: "Daftar aset grouped by cabang.",
  },
  "perusahaan/syarat-pembayaran": {
    title: "Syarat Pembayaran",
    section: "Perusahaan",
    desc: "Net 30, COD, dll — master syarat bayar.",
  },
  "perusahaan/proses-akhir-bulan": {
    title: "Proses Akhir Bulan",
    section: "Perusahaan",
    desc: "Checklist closing + jurnal laba ditahan + lock periode.",
  },
  "perusahaan/gaji-tunjangan": {
    title: "Gaji & Tunjangan",
    section: "Perusahaan",
    desc: "Posting jurnal payroll ke buku besar.",
    mirrorHref: "/hris/slip-gaji",
    mirrorLabel: "Slip Gaji (HRIS)",
  },
  "perusahaan/karyawan": {
    title: "Karyawan",
    section: "Perusahaan",
    desc: "Master karyawan — mirror HRIS.",
    mirrorHref: "/hris/karyawan",
    mirrorLabel: "Karyawan (HRIS)",
  },
  "perusahaan/transaksi-berulang": {
    title: "Transaksi Berulang",
    section: "Perusahaan",
    desc: "Template jurnal recurring (sewa, langganan, dll).",
  },
  "perusahaan/kalender": {
    title: "Kalender",
    section: "Perusahaan",
    desc: "Jatuh tempo AR/AP, payroll, opname.",
  },
  "perusahaan/kontak": {
    title: "Kontak",
    section: "Perusahaan",
    desc: "Direktori kontak bisnis.",
  },
  "perusahaan/transaksi-favorit": {
    title: "Transaksi Favorit",
    section: "Perusahaan",
    desc: "Shortcut jurnal yang sering dipakai.",
  },
  "perusahaan/log-aktivitas": {
    title: "Log Aktivitas",
    section: "Perusahaan",
    desc: "Audit log modul finance.",
  },
  "laporan/laba-ditahan": {
    title: "Laba Ditahan",
    section: "Laporan Keuangan",
    desc: "Pergerakan laba ditahan per periode.",
  },
  "laporan/rasio-keuangan": {
    title: "Rasio Keuangan",
    section: "Laporan Keuangan",
    desc: "Likuiditas, leverage, profitability ratios.",
  },
  "laporan/perubahan-equitas": {
    title: "Perubahan Equitas",
    section: "Laporan Keuangan",
    desc: "Laporan perubahan modal.",
  },
  "laporan/grafik": {
    title: "Grafik Keuangan",
    section: "Laporan Keuangan",
    desc: "Trend pendapatan, beban, KPI keuangan.",
  },
  "laporan/laporan-penjualan": {
    title: "Laporan Penjualan",
    section: "Laporan Keuangan",
    desc: "Rekap tagihan bengkel per periode.",
  },
  "laporan/laporan-pembelian": {
    title: "Laporan Pembelian",
    section: "Laporan Keuangan",
    desc: "Rekap pembelian toner ke vendor.",
  },
};

export function getFinancePlaceholder(pathKey: string): FinancePlaceholderDef {
  return (
    FINANCE_PLACEHOLDERS[pathKey] ?? {
      title: pathKey.split("/").pop()?.replace(/-/g, " ") ?? "Finance",
      section: "Finance",
    }
  );
}

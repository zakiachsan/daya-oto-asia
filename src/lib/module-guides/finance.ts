import { a, g } from "./helpers";
import type { GuideModuleId, ModuleGuideNav } from "./types";

const F = "finance" as GuideModuleId;
const O = "operasional" as GuideModuleId;
const H = "hris" as GuideModuleId;

export const financeGuideNav: ModuleGuideNav = {
  moduleId: "finance",
  title: "Panduan Finance",
  subtitle: "Klik menu di kiri · alur kerja ditampilkan dari atas ke bawah.",
  sections: [
    { key: "dashboard", label: "Dashboard", items: [{ id: "dashboard", label: "Dashboard" }] },
    {
      key: "buku-besar",
      label: "Buku Besar",
      items: [
        { id: "akun-perkiraan", label: "Akun Perkiraan" },
        { id: "pencatatan-beban", label: "Pencatatan Beban" },
        { id: "jurnal-umum", label: "Jurnal Umum" },
        { id: "anggaran", label: "Anggaran" },
        { id: "histori-akun", label: "Histori Akun" },
        { id: "log-aktivitas-jurnal", label: "Log Aktivitas Jurnal" },
      ],
    },
    {
      key: "kas-bank",
      label: "Kas & Bank",
      items: [
        { id: "pembayaran", label: "Pembayaran" },
        { id: "penerimaan", label: "Penerimaan" },
        { id: "transfer-bank", label: "Transfer Bank" },
        { id: "rekening-koran", label: "Rekening Koran" },
        { id: "rekonsiliasi-bank", label: "Rekonsiliasi Bank" },
        { id: "histori-bank", label: "Histori Bank" },
      ],
    },
    {
      key: "penjualan",
      label: "Penjualan",
      items: [
        { id: "faktur-penjualan", label: "Faktur Penjualan" },
        { id: "penerimaan-penjualan", label: "Penerimaan Penjualan" },
        { id: "uang-muka-penjualan", label: "Uang Muka Penjualan" },
        { id: "retur-penjualan", label: "Retur Penjualan" },
        { id: "pelanggan", label: "Pelanggan" },
      ],
    },
    {
      key: "pembelian",
      label: "Pembelian",
      items: [
        { id: "pesanan-pembelian", label: "Pesanan Pembelian" },
        { id: "penerimaan-barang-pembelian", label: "Penerimaan Barang" },
        { id: "faktur-pembelian", label: "Faktur Pembelian" },
        { id: "uang-muka-pembelian", label: "Uang Muka Pembelian" },
        { id: "pembayaran-pembelian", label: "Pembayaran Pembelian" },
        { id: "pemasok", label: "Pemasok" },
      ],
    },
    {
      key: "persediaan",
      label: "Persediaan",
      items: [
        { id: "penerimaan-barang-persediaan", label: "Penerimaan Barang" },
        { id: "penyesuaian-persediaan", label: "Penyesuaian Persediaan" },
        { id: "barang-jasa", label: "Barang & Jasa" },
        { id: "barang-per-gudang", label: "Barang Per Gudang" },
        { id: "barang-stok-minimum", label: "Barang Stok Minimum" },
      ],
    },
    {
      key: "laporan",
      label: "Laporan Keuangan",
      items: [
        { id: "laba-rugi", label: "Laba Rugi" },
        { id: "neraca", label: "Neraca" },
        { id: "arus-kas", label: "Arus Kas" },
        { id: "hutang-piutang", label: "Laporan Hutang Piutang" },
        { id: "laporan-penjualan", label: "Laporan Penjualan" },
        { id: "laporan-pembelian", label: "Laporan Pembelian" },
        { id: "laba-ditahan", label: "Laba Ditahan" },
        { id: "rasio-keuangan", label: "Rasio Keuangan" },
        { id: "perubahan-equitas", label: "Perubahan Equitas" },
        { id: "grafik", label: "Grafik" },
        { id: "perpajakan", label: "Perpajakan" },
      ],
    },
    {
      key: "aset-tetap",
      label: "Aset Tetap",
      items: [
        { id: "aset-tetap", label: "Aset Tetap" },
        { id: "kategori-aset", label: "Kategori Aset" },
        { id: "perubahan-aset-tetap", label: "Perubahan Aset Tetap" },
        { id: "disposisi-aset", label: "Disposisi Aset Tetap" },
        { id: "pindah-aset", label: "Pindah Aset" },
        { id: "aset-per-lokasi", label: "Aset per Lokasi" },
      ],
    },
    {
      key: "perusahaan",
      label: "Perusahaan",
      items: [
        { id: "syarat-pembayaran", label: "Syarat Pembayaran" },
        { id: "proses-akhir-bulan", label: "Proses Akhir Bulan" },
        { id: "gaji-tunjangan", label: "Gaji & Tunjangan" },
        { id: "karyawan", label: "Karyawan" },
        { id: "transaksi-berulang", label: "Transaksi Berulang" },
        { id: "kalender", label: "Kalender" },
        { id: "kontak", label: "Kontak" },
        { id: "transaksi-favorit", label: "Transaksi Favorit" },
        { id: "log-aktivitas", label: "Log Aktivitas" },
      ],
    },
    { key: "daftar-laporan", label: "Daftar Laporan", items: [{ id: "daftar-laporan", label: "Daftar Laporan" }] },
  ],
  guides: {
    dashboard: g(
      "dashboard",
      "Dashboard Keuangan",
      "Dashboard",
      "/finance",
      "Ringkasan KPI keuangan, todo perlu tindakan, jurnal terbaru, dan piutang outstanding.",
      [
        a(F, "Pilih Periode Bulan"),
        a(F, "Lihat KPI Keuangan"),
        a(F, "Tindak Item Perlu Tindakan"),
        a(F, "Buat Jurnal Baru", "/finance/buku-besar/jurnal-umum"),
        a(F, "Semua Jurnal", "/finance/buku-besar/jurnal-umum"),
        a(F, "Buka Daftar Laporan", "/finance/daftar-laporan"),
        a(F, "Terima Pembayaran Piutang", "/finance/penjualan/penerimaan-penjualan"),
      ]
    ),
    "akun-perkiraan": g(
      "akun-perkiraan",
      "Akun Perkiraan",
      "Akun Perkiraan",
      "/finance/buku-besar/akun-perkiraan",
      "Chart of accounts · tambah/edit akun tersimpan ke API, dasar semua jurnal dan laporan.",
      [a(F, "Lihat Daftar Akun"), a(F, "Tambah / Edit Akun (simpan ke API)"), a(F, "Review Saldo Akun", "/finance/buku-besar/histori-akun")]
    ),
    anggaran: g(
      "anggaran",
      "Anggaran",
      "Anggaran",
      "/finance/buku-besar/anggaran",
      "Rencana anggaran per akun/periode · master data CONFIG.",
      [a(F, "Buat Anggaran"), a(F, "Review Realisasi vs Anggaran"), a(F, "Bandingkan Laba Rugi", "/finance/laporan/laba-rugi")]
    ),
    "pencatatan-beban": g(
      "pencatatan-beban",
      "Pencatatan Beban",
      "Pencatatan Beban",
      "/finance/buku-besar/pencatatan-beban",
      "Catat beban · jurnal hutang dibuat saat simpan; bayar kas/bank di langkah terpisah.",
      [a(F, "Buat Pencatatan Beban"), a(F, "Simpan & Buat Jurnal"), a(F, "Bayar Beban (Kas/Bank)")]
    ),
    "jurnal-umum": g(
      "jurnal-umum",
      "Jurnal Umum",
      "Jurnal Umum",
      "/finance/buku-besar/jurnal-umum",
      "Entri jurnal manual · langsung status Posted saat disimpan.",
      [
        a(F, "Buat Jurnal Baru"),
        a(F, "Input Baris Debit/Kredit"),
        a(F, "Simpan Jurnal"),
        a(F, "Review Log Aktivitas", "/finance/buku-besar/log-aktivitas-jurnal"),
      ]
    ),
    "histori-akun": g(
      "histori-akun",
      "Histori Akun",
      "Histori Akun",
      "/finance/buku-besar/histori-akun",
      "Mutasi per akun · audit trail transaksi.",
      [a(F, "Pilih Akun"), a(F, "Filter Periode"), a(F, "Review Mutasi")]
    ),
    "log-aktivitas-jurnal": g(
      "log-aktivitas-jurnal",
      "Log Aktifitas Jurnal",
      "Log Aktifitas Jurnal",
      "/finance/buku-besar/log-aktivitas-jurnal",
      "Audit trail perubahan jurnal · siapa ubah/apa.",
      [a(F, "Filter Periode"), a(F, "Cari Nomor Jurnal"), a(F, "Review Aktivitas")]
    ),
    pembayaran: g(
      "pembayaran",
      "Pembayaran Kas/Bank",
      "Pembayaran",
      "/finance/kas-bank/pembayaran",
      "Catat pengeluaran kas · hutang supplier, beban, dll.",
      [
        a(F, "Buat Pembayaran"),
        a(F, "Pilih Akun Kas/Bank"),
        a(F, "Alokasi ke Hutang / Beban"),
        a(F, "Bayar PO", "/finance/pembelian/pembayaran-pembelian"),
      ]
    ),
    penerimaan: g(
      "penerimaan",
      "Penerimaan Kas/Bank",
      "Penerimaan",
      "/finance/kas-bank/penerimaan",
      "Catat penerimaan kas · piutang pelanggan dan pendapatan lain.",
      [
        a(F, "Buat Penerimaan"),
        a(F, "Pilih Akun Kas/Bank"),
        a(F, "Alokasi ke Piutang"),
        a(F, "Terima Pembayaran Penjualan", "/finance/penjualan/penerimaan-penjualan"),
      ]
    ),
    "transfer-bank": g(
      "transfer-bank",
      "Transfer Bank",
      "Transfer Bank",
      "/finance/kas-bank/transfer-bank",
      "Pindahkan saldo antar rekening kas/bank.",
      [a(F, "Buat Transfer"), a(F, "Pilih Rekening Asal & Tujuan"), a(F, "Simpan Transfer")]
    ),
    "rekening-koran": g(
      "rekening-koran",
      "Rekening Koran",
      "Rekening Koran",
      "/finance/kas-bank/rekening-koran",
      "Saldo dan mutasi kas/bank per rekening.",
      [a(F, "Pilih Rekening"), a(F, "Filter Periode"), a(F, "Review Mutasi")]
    ),
    "rekonsiliasi-bank": g(
      "rekonsiliasi-bank",
      "Rekonsiliasi Bank",
      "Rekonsiliasi Bank",
      "/finance/kas-bank/rekonsiliasi-bank",
      "Cocokkan saldo bank dengan buku.",
      [a(F, "Pilih Rekening & Periode"), a(F, "Tandai Item Cocok"), a(F, "Selesaikan Rekonsiliasi")]
    ),
    "histori-bank": g(
      "histori-bank",
      "Histori Bank",
      "Histori Bank",
      "/finance/kas-bank/histori-bank",
      "Riwayat mutasi semua rekening kas/bank.",
      [a(F, "Filter Rekening"), a(F, "Filter Periode"), a(F, "Review Mutasi")]
    ),


    "faktur-penjualan": g(
      "faktur-penjualan",
      "Faktur Penjualan (OPB → Faktur → Piutang)",
      "Faktur Penjualan",
      "/finance/penjualan/faktur-penjualan",
      "Buat faktur dari OPB yang sudah ditagihkan · post jurnal piutang & pendapatan otomatis.",
      [
        a(O, "OPB Status Ditagihkan", "/operasional/opb", { module: F, href: "/finance/penjualan/faktur-penjualan" }),
        a(F, "Buat Faktur Penjualan dari OPB"),
        a(F, "Review PPN & Total Tagihan"),
        a(F, "Post Faktur → Jurnal Otomatis"),
        a(F, "Catat Penerimaan Penjualan", "/finance/penjualan/penerimaan-penjualan"),
      ]
    ),
    "penerimaan-penjualan": g(
      "penerimaan-penjualan",
      "Penerimaan Penjualan",
      "Penerimaan Penjualan",
      "/finance/penjualan/penerimaan-penjualan",
      "Catat pelunasan faktur · update piutang & saldo kas.",
      [
        a(F, "Buat Penerimaan"),
        a(F, "Pilih Faktur Open/Partial"),
        a(F, "Post → Jurnal Piutang & Kas"),
        a(F, "Review Aging Piutang", "/finance/laporan/hutang-piutang"),
      ]
    ),
    "retur-penjualan": g(
      "retur-penjualan",
      "Retur Penjualan",
      "Retur Penjualan",
      "/finance/penjualan/retur-penjualan",
      "Proses retur barang dari pelanggan.",
      [
        a(F, "Buat Retur Penjualan", "/finance/penjualan/retur-penjualan"),
        a(F, "Posting Retur & Koreksi Piutang"),
      ]
    ),
    pelanggan: g(
      "pelanggan",
      "Master Pelanggan",
      "Pelanggan",
      "/finance/penjualan/pelanggan",
      "Data pelanggan/cabang bengkel · dipakai di faktur penjualan & OPB.",
      [
        a(F, "Kelola Data Pelanggan", "/finance/penjualan/pelanggan"),
        a(O, "Cabang Terkait di Master Cabang", "/operasional/cabang"),
        a(F, "Set Syarat Pembayaran", "/finance/perusahaan/syarat-pembayaran"),
      ]
    ),

    "uang-muka-penjualan": g(
      "uang-muka-penjualan",
      "Uang Muka Penjualan",
      "Uang Muka Penjualan",
      "/finance/penjualan/uang-muka-penjualan",
      "Monitor DP pelanggan · catat via Kas Penerimaan (keterangan: uang muka/DP).",
      [a(F, "Catat di Kas Penerimaan", "/finance/kas-bank/penerimaan"), a(F, "Review Daftar DP")]
    ),







    "pesanan-pembelian": g(
      "pesanan-pembelian",
      "Pesanan Pembelian (PO)",
      "Pesanan Pembelian",
      "/finance/pembelian/pesanan-pembelian",
      "Monitor PO Operasional · urutan: DP (opsional) → terima barang → faktur → pelunasan.",
      [
        a(O, "Buat PO & Goods Received", "/operasional/po", { module: F, href: "/finance/pembelian/pesanan-pembelian" }),
        a(F, "Review PO"),
        a(F, "Bayar Uang Muka (opsional)", "/finance/pembelian/uang-muka-pembelian"),
        a(F, "Catat Faktur Pembelian", "/finance/pembelian/faktur-pembelian"),
        a(F, "Bayar / Pelunasan", "/finance/pembelian/pembayaran-pembelian"),
      ]
    ),
    "penerimaan-barang-pembelian": g(
      "penerimaan-barang-pembelian",
      "Penerimaan Barang Pembelian",
      "Penerimaan Barang",
      "/finance/pembelian/penerimaan-barang",
      "Mirror penerimaan Operasional · setelah GR lanjut faktur & pelunasan.",
      [
        a(O, "Goods Received di Operasional", "/operasional/po", { module: F, href: "/finance/pembelian/penerimaan-barang" }),
        a(F, "Review GR"),
        a(F, "Catat Faktur Pembelian", "/finance/pembelian/faktur-pembelian"),
      ]
    ),
    "faktur-pembelian": g(
      "faktur-pembelian",
      "Faktur Pembelian",
      "Faktur Pembelian",
      "/finance/pembelian/faktur-pembelian",
      "Catat faktur supplier · wajib setelah penerimaan barang sebelum pelunasan penuh.",
      [
        a(F, "Catat Faktur dari PO"),
        a(F, "Review PPN & Total"),
        a(F, "Bayar PO", "/finance/pembelian/pembayaran-pembelian"),
      ]
    ),
    "uang-muka-pembelian": g(
      "uang-muka-pembelian",
      "Uang Muka Pembelian",
      "Uang Muka Pembelian",
      "/finance/pembelian/uang-muka-pembelian",
      "Catat DP ke supplier · bisa juga dari menu Pembayaran Pembelian.",
      [a(F, "Catat Uang Muka (DP)"), a(F, "Review Saldo DP PO")]
    ),
    "pembayaran-pembelian": g(
      "pembayaran-pembelian",
      "Pembayaran Pembelian",
      "Pembayaran Pembelian",
      "/finance/pembelian/pembayaran-pembelian",
      "Urutan: bayar DP → GR → faktur → pelunasan. Angsuran setelah ada pembayaran sebelumnya.",
      [
        a(F, "Catat DP", "/finance/pembelian/uang-muka-pembelian"),
        a(F, "Catat Angsuran"),
        a(F, "Catat Pelunasan (setelah faktur)"),
        a(F, "Review Jurnal Pembayaran"),
      ]
    ),

    pemasok: g(
      "pemasok",
      "Master Pemasok",
      "Pemasok",
      "/finance/pembelian/pemasok",
      "Data supplier/pabrik cat · dipakai di PO & faktur pembelian.",
      [
        a(F, "Kelola Data Pemasok", "/finance/pembelian/pemasok"),
        a(O, "Buat PO ke Pemasok", "/operasional/po"),
      ]
    ),



    "penerimaan-barang-persediaan": g(
      "penerimaan-barang-persediaan",
      "Penerimaan Barang (Persediaan)",
      "Penerimaan Barang",
      "/finance/persediaan/penerimaan-barang",
      "Mirror penerimaan barang masuk gudang pusat · review dari sisi Finance.",
      [
        a(O, "Goods Received di Operasional", "/operasional/po"),
        a(F, "Review Penerimaan Barang", "/finance/persediaan/penerimaan-barang"),
        a(F, "Post → Jurnal Persediaan"),
      ]
    ),

    "penyesuaian-persediaan": g(
      "penyesuaian-persediaan",
      "Penyesuaian Persediaan",
      "Penyesuaian Persediaan",
      "/finance/persediaan/penyesuaian-persediaan",
      "Koreksi stok setelah stock opname cabang · posting jurnal persediaan.",
      [
        a(O, "Stock Opname Approved", "/operasional/stock-opname"),
        a(F, "Buat Penyesuaian Persediaan"),
        a(F, "Post → Review Jurnal Persediaan"),
      ]
    ),



    "barang-jasa": g(
      "barang-jasa",
      "Barang & Jasa",
      "Barang & Jasa",
      "/finance/persediaan/barang-jasa",
      "Master item persediaan · mirror data produk Operasional.",
      [
        a(O, "Kelola Master Produk", "/operasional/produk"),
        a(F, "Review Master Barang & Jasa", "/finance/persediaan/barang-jasa"),
      ]
    ),




    "barang-per-gudang": g(
      "barang-per-gudang",
      "Barang Per Gudang",
      "Barang Per Gudang",
      "/finance/persediaan/barang-per-gudang",
      "Stok per gudang · data live dari API stock.",
      [a(F, "Filter Gudang"), a(F, "Review Qty per Lokasi")]
    ),
    "barang-stok-minimum": g(
      "barang-stok-minimum",
      "Barang Stok Minimum",
      "Barang Stok Minimum",
      "/finance/persediaan/barang-stok-minimum",
      "Produk di bawah minimum stok · trigger ajuan stok di Operasional.",
      [
        a(F, "Review Alert Minimum", "/finance/persediaan/barang-stok-minimum"),
        a(O, "Proses Ajuan Stok Cabang", "/operasional/ajuan-stok"),
      ]
    ),
    "laba-rugi": g(
      "laba-rugi",
      "Laporan Laba Rugi",
      "Laba Rugi",
      "/finance/laporan/laba-rugi",
      "Pendapatan vs beban per periode.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan"), a(F, "Export / Cetak")]
    ),
    neraca: g(
      "neraca",
      "Laporan Neraca",
      "Neraca",
      "/finance/laporan/neraca",
      "Posisi aktiva, hutang, dan ekuitas.",
      [a(F, "Pilih Tanggal"), a(F, "Generate Neraca"), a(F, "Review Saldo Akun")]
    ),
    "arus-kas": g(
      "arus-kas",
      "Laporan Arus Kas",
      "Arus Kas",
      "/finance/laporan/arus-kas",
      "Arus masuk/keluar kas operasi, investasi, pendanaan.",
      [a(F, "Pilih Periode"), a(F, "Generate Arus Kas")]
    ),
    "hutang-piutang": g(
      "hutang-piutang",
      "Laporan Hutang Piutang",
      "Laporan Hutang Piutang",
      "/finance/laporan/hutang-piutang",
      "Outstanding AR/AP · aging piutang dan hutang.",
      [a(F, "Review Piutang"), a(F, "Review Hutang"), a(F, "Filter Aging")]
    ),
    "laporan-penjualan": g(
      "laporan-penjualan",
      "Laporan Penjualan",
      "Laporan Penjualan",
      "/finance/laporan/laporan-penjualan",
      "Rekap penjualan per periode · invoice & penerimaan.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan"), a(F, "Export")]
    ),
    "laporan-pembelian": g(
      "laporan-pembelian",
      "Laporan Pembelian",
      "Laporan Pembelian",
      "/finance/laporan/laporan-pembelian",
      "Rekap pembelian per periode · PO, faktur, pembayaran.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan"), a(F, "Export")]
    ),
    "laba-ditahan": g(
      "laba-ditahan",
      "Laba Ditahan",
      "Laba Ditahan",
      "/finance/laporan/laba-ditahan",
      "Pergerakan laba ditahan per periode · dari jurnal penutup & operasional.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan"), a(F, "Review Jurnal Penutup", "/finance/perusahaan/proses-akhir-bulan")]
    ),
    "rasio-keuangan": g(
      "rasio-keuangan",
      "Rasio Keuangan",
      "Rasio Keuangan",
      "/finance/laporan/rasio-keuangan",
      "Likuiditas, leverage, profitabilitas · data live financial-reports.",
      [a(F, "Pilih Periode"), a(F, "Generate Rasio")]
    ),
    "perubahan-equitas": g(
      "perubahan-equitas",
      "Perubahan Equitas",
      "Perubahan Equitas",
      "/finance/laporan/perubahan-equitas",
      "Statement of changes in equity per periode.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan")]
    ),
    grafik: g(
      "grafik",
      "Grafik Keuangan",
      "Grafik",
      "/finance/laporan/grafik",
      "Visualisasi tren pendapatan, beban, dan KPI keuangan.",
      [a(F, "Pilih Periode"), a(F, "Generate Grafik")]
    ),
    "aset-tetap": g(
      "aset-tetap",
      "Aset Tetap",
      "Aset Tetap",
      "/finance/aset-tetap/aset-tetap",
      "Register aset, jalankan penyusutan bulanan, dan dispose dengan jurnal otomatis.",
      [a(F, "Tambah Aset"), a(F, "Jalankan Penyusutan Bulan Ini"), a(F, "Dispose Aset (jurnal AD/)"), a(F, "Review Nilai Buku")]
    ),
    "kategori-aset": g(
      "kategori-aset",
      "Kategori Aset",
      "Kategori Aset",
      "/finance/aset-tetap/kategori-aset",
      "Klasifikasi aset tetap.",
      [a(F, "Kelola Kategori Aset")]
    ),
    "perubahan-aset-tetap": g(
      "perubahan-aset-tetap",
      "Perubahan Aset Tetap",
      "Perubahan Aset Tetap",
      "/finance/aset-tetap/perubahan-aset-tetap",
      "Histori perubahan field aset (nilai, umur, akun) · tercatat di master-data.",
      [a(F, "Catat Perubahan Field"), a(F, "Review Histori per Aset")]
    ),
    "disposisi-aset": g(
      "disposisi-aset",
      "Disposisi Aset Tetap",
      "Disposisi Aset Tetap",
      "/finance/aset-tetap/disposisi-aset-tetap",
      "Daftar aset berstatus Disposed · proses dispose dari tab Daftar di Aset Tetap.",
      [a(F, "Dispose dari Aset Tetap", "/finance/aset-tetap/aset-tetap"), a(F, "Review Jurnal AD/"), a(F, "Review Gain/Loss")]
    ),
    "pindah-aset": g(
      "pindah-aset",
      "Pindah Aset",
      "Pindah Aset",
      "/finance/aset-tetap/pindah-aset",
      "Transfer aset antar lokasi/cabang.",
      [a(F, "Catat Pindah Aset"), a(F, "Update Lokasi")]
    ),
    "aset-per-lokasi": g(
      "aset-per-lokasi",
      "Aset per Lokasi",
      "Aset per Lokasi",
      "/finance/aset-tetap/aset-per-lokasi",
      "Daftar aset per lokasi fisik.",
      [a(F, "Filter Lokasi"), a(F, "Review Aset per Site")]
    ),
    "syarat-pembayaran": g(
      "syarat-pembayaran",
      "Syarat Pembayaran",
      "Syarat Pembayaran",
      "/finance/perusahaan/syarat-pembayaran",
      "Master terms (Net 30, COD, dll.) · dipakai di faktur.",
      [a(F, "Tambah Syarat"), a(F, "Set Default"), a(F, "Nonaktifkan Syarat")]
    ),


    "gaji-tunjangan": g(
      "gaji-tunjangan",
      "Gaji & Tunjangan (HRIS → Finance)",
      "Gaji & Tunjangan",
      "/finance/perusahaan/gaji-tunjangan",
      "Posting payroll dari HRIS · jurnal beban gaji & utang gaji.",
      [
        a(H, "Finalisasi Slip Gaji", "/hris/slip-gaji"),
        a(F, "Catat Batch Payroll"),
        a(F, "Post Jurnal Gaji"),
        a(F, "Bayar Gaji via Kas/Bank", "/finance/kas-bank/pembayaran"),
      ]
    ),
    karyawan: g(
      "karyawan",
      "Karyawan",
      "Karyawan",
      "/finance/perusahaan/karyawan",
      "Data karyawan internal.",
      [a(F, "Kelola Data Karyawan")]
    ),
    "transaksi-berulang": g(
      "transaksi-berulang",
      "Transaksi Berulang",
      "Transaksi Berulang",
      "/finance/perusahaan/transaksi-berulang",
      "Template transaksi berkala · jalankan manual per baris atau bulk jatuh tempo (RB/ jurnal). Scheduler otomatis belum tersedia.",
      [a(F, "Buat Template"), a(F, "Jalankan per Baris"), a(F, "Jalankan Jatuh Tempo")]
    ),
    "proses-akhir-bulan": g(
      "proses-akhir-bulan",
      "Proses Akhir Bulan",
      "Proses Akhir Bulan",
      "/finance/perusahaan/proses-akhir-bulan",
      "Checklist review + tutup periode · buat jurnal penutup CL/ ke Laba Ditahan. Periode tertutup memblokir posting baru.",
      [a(F, "Review Checklist"), a(F, "Simpan Checklist"), a(F, "Tutup Periode & Buat Jurnal")]
    ),
    kontak: g(
      "kontak",
      "Kontak",
      "Kontak",
      "/finance/perusahaan/kontak",
      "Buku alamat kontak bisnis.",
      [a(F, "Kelola Kontak")]
    ),
    "transaksi-favorit": g(
      "transaksi-favorit",
      "Transaksi Favorit",
      "Transaksi Favorit",
      "/finance/perusahaan/transaksi-favorit",
      "Shortcut jurnal yang sering dipakai.",
      [a(F, "Simpan Template Favorit"), a(F, "Pakai Transaksi Favorit")]
    ),
    kalender: g(
      "kalender",
      "Kalender",
      "Kalender",
      "/finance/perusahaan/kalender",
      "Jatuh tempo piutang/hutang, payroll, transaksi berulang, PO, WO & opname · legend dari data live.",
      [a(F, "Lihat Event Bulan Ini"), a(F, "Review Kategori Aktif di Sidebar")]
    ),
    "log-aktivitas": g(
      "log-aktivitas",
      "Log Aktivitas",
      "Log Aktivitas",
      "/finance/perusahaan/log-aktivitas",
      "Audit log aktivitas modul perusahaan.",
      [a(F, "Filter Aktivitas"), a(F, "Review Log")]
    ),
    "daftar-laporan": g(
      "daftar-laporan",
      "Daftar Laporan",
      "Daftar Laporan",
      "/finance/daftar-laporan",
      "Katalog laporan Accurate-style · filter periode & export.",
      [a(F, "Pilih Kategori Laporan"), a(F, "Atur Filter Periode"), a(F, "Generate & Export")]
    ),
    perpajakan: g(
      "perpajakan",
      "Laporan Perpajakan",
      "Perpajakan",
      "/finance/laporan/perpajakan",
      "Rekap PPN masukan/keluaran & kewajiban pajak.",
      [a(F, "Pilih Periode"), a(F, "Generate Laporan Pajak"), a(F, "Export untuk e-Filing")]
    ),
  },
};

import { a, g } from "./helpers";
import type { GuideModuleId, ModuleGuideNav } from "./types";

const O = "operasional" as GuideModuleId;
const F = "finance" as GuideModuleId;
const M = "mobile" as GuideModuleId;

const FIN_FAKTUR = "/finance/penjualan/faktur-penjualan";
const FIN_PENYESUAIAN = "/finance/persediaan/penyesuaian-persediaan";
const FIN_FAKTUR_BELI = "/finance/pembelian/faktur-pembelian";

export const operasionalGuideNav: ModuleGuideNav = {
  moduleId: "operasional",
  title: "Panduan Operasional",
  subtitle: "Klik menu di kiri · alur kerja ditampilkan dari atas ke bawah.",
  sections: [
    { key: "dashboard", label: "Dashboard", items: [{ id: "dashboard", label: "Dashboard" }] },
    {
      key: "transaksi",
      label: "Transaksi Warna",
      items: [{ id: "transaksi-warna", label: "Transaksi Warna (App)" }],
    },
    {
      key: "tagihan",
      label: "Tagihan Bengkel",
      items: [
        { id: "opb-tagihan", label: "OPB & Tagihan" },
        { id: "rekonsiliasi", label: "Rekonsiliasi OPB" },
      ],
    },
    {
      key: "wms",
      label: "WMS & Stok",
      items: [
        { id: "po-penerimaan", label: "PO & Penerimaan" },
        { id: "distribusi", label: "Distribusi Cabang" },
        { id: "stock-opname", label: "Stock Opname" },
        { id: "ajuan-stok", label: "Ajuan Stok" },
        { id: "inventori", label: "Inventori & Stok" },
      ],
    },
    {
      key: "lainnya",
      label: "Lainnya",
      items: [
        { id: "laporan-pemakaian", label: "Laporan Pemakaian Base" },
        { id: "monitoring", label: "Monitoring" },
      ],
    },
    {
      key: "master",
      label: "Master Data",
      items: [
        { id: "cabang", label: "Master Cabang" },
        { id: "produk", label: "Master Produk" },
        { id: "kategori-harga", label: "Kategori Harga" },
        { id: "kode-warna", label: "Kode Warna" },
      ],
    },
  ],
  guides: {
    dashboard: g(
      "dashboard",
      "Dashboard Operasional",
      "Dashboard",
      "/operasional",
      "Ringkasan transaksi warna, OPB, stok cabang, dan alert operasional.",
      [
        a(O, "Lihat KPI Transaksi Harian/Bulanan"),
        a(O, "Monitor OPB Pending", "/operasional/opb"),
        a(O, "Cek Alert Stok Minimum", "/operasional/inventori"),
        a(O, "Review Monitoring", "/operasional/monitoring"),
      ],
    ),
    "transaksi-warna": g(
      "transaksi-warna",
      "Transaksi Warna (App Tinter → Operasional)",
      "Transaksi Warna (App)",
      "/operasional/transaksi",
      "Tinter input transaksi via App: pilih mobil & warna, mixing timer, cetak nota wajib, TTD DocuMatrix kepala bengkel.",
      [
        a(M, "Buat Transaksi", "/app/transaksi/baru"),
        a(M, "Pilih Mobil & Kode Warna"),
        a(M, "Mixing · Timer Durasi Aktif"),
        a(M, "Penambahan Bahan (sebelum lock, mobil sama)"),
        a(M, "Cetak Nota Wajib + TTD DocuMatrix"),
        a(M, "Finalisasi / Lock Transaksi"),
        a(O, "Pantau di Transaksi Warna", "/operasional/transaksi"),
      ],
    ),
    "opb-tagihan": g(
      "opb-tagihan",
      "OPB Bulanan & Tagihan (→ Finance)",
      "OPB & Tagihan",
      "/operasional/opb",
      "Admin cabang generate OPB dari transaksi finalized, TTD, forward ke HO, input no. SAP, status Ditagihkan.",
      [
        a(M, "Transaksi Finalized Masuk Pool OPB", "/app/transaksi"),
        a(O, "Generate OPB Bulanan per Cabang", "/operasional/opb"),
        a(O, "Review Item & Total Tagihan"),
        a(O, "TTD Admin Cabang"),
        a(O, "Forward ke HO"),
        a(O, "Input No. SAP · Status Ditagihkan"),
        a(F, "Buat Faktur Penjualan dari OPB", FIN_FAKTUR, { module: O, href: "/operasional/opb" }),
      ],
    ),
    rekonsiliasi: g(
      "rekonsiliasi",
      "Rekonsiliasi & Anti-Leakage",
      "Rekonsiliasi OPB",
      "/operasional/rekonsiliasi",
      "Supervisor cocokkan OPB vs nota cetak vs pemakaian stok. Deteksi leakage: stok habis tapi OPB belum terbentuk.",
      [
        a(O, "Buka Rekonsiliasi OPB", "/operasional/rekonsiliasi"),
        a(O, "Pilih Cabang & Periode"),
        a(O, "Cocokkan OPB vs Nota Cetak vs Stok"),
        a(O, "Review Selisih di Luar Toleransi"),
        a(O, "Flag Leakage · Tindak Lanjut"),
      ],
    ),
    "po-penerimaan": g(
      "po-penerimaan",
      "PO & Penerimaan Barang (→ Finance)",
      "PO & Penerimaan",
      "/operasional/po",
      "PO ke pabrik/supplier, goods received ke gudang pusat, lanjut faktur pembelian di Finance.",
      [
        a(O, "Buat PO ke Supplier/Pabrik", "/operasional/po"),
        a(O, "Kirim PO & Tunggu Pengiriman"),
        a(O, "Goods Received · Terima ke Gudang Pusat"),
        a(O, "Stok Pusat Bertambah"),
        a(F, "Catat Faktur Pembelian", FIN_FAKTUR_BELI, { module: O, href: "/operasional/po" }),
        a(F, "Bayar PO / Pelunasan", "/finance/pembelian/pembayaran-pembelian"),
      ],
    ),
    distribusi: g(
      "distribusi",
      "Distribusi ke Cabang",
      "Distribusi Cabang",
      "/operasional/distribusi",
      "Transfer stok dari gudang pusat ke cabang bengkel.",
      [
        a(O, "Buat Dokumen Distribusi", "/operasional/distribusi"),
        a(O, "Pilih Item & Qty dari Stok Pusat"),
        a(O, "Pilih Cabang Tujuan"),
        a(O, "Kirim & Konfirmasi Penerimaan Cabang"),
        a(O, "Verifikasi Saldo Inventori Cabang", "/operasional/inventori"),
      ],
    ),
    "stock-opname": g(
      "stock-opname",
      "Stock Opname (App → Operasional → Finance)",
      "Stock Opname",
      "/operasional/stock-opname",
      "Tinter timbang stok gram di App; supervisor rekonsiliasi toleransi; Finance posting penyesuaian.",
      [
        a(M, "Input Stock Opname per Item", "/app/stock-opname"),
        a(O, "Review Hasil Opname Cabang", "/operasional/stock-opname"),
        a(O, "Rekonsiliasi Selisih vs Toleransi"),
        a(O, "Approve Stock Opname"),
        a(F, "Buat Penyesuaian Persediaan", FIN_PENYESUAIAN, { module: O, href: "/operasional/stock-opname" }),
        a(F, "Post → Jurnal Persediaan Otomatis"),
      ],
    ),
    "ajuan-stok": g(
      "ajuan-stok",
      "Ajuan Stok (App → Operasional)",
      "Ajuan Stok",
      "/operasional/ajuan-stok",
      "Cabang ajukan replenishment via App; HO approve & proses distribusi.",
      [
        a(M, "Ajukan Stok dari App", "/app/ajukan-stok"),
        a(O, "Review Ajuan Masuk", "/operasional/ajuan-stok"),
        a(O, "Approve / Reject + Catatan"),
        a(O, "Proses via Distribusi Cabang", "/operasional/distribusi"),
      ],
    ),
    inventori: g(
      "inventori",
      "Inventori & Stok Cabang",
      "Inventori & Stok",
      "/operasional/inventori",
      "Saldo stok per cabang · base coat, hardener, thinner. Mutasi dari transaksi, distribusi, opname.",
      [
        a(O, "Buka Inventori & Stok", "/operasional/inventori"),
        a(O, "Filter Cabang & Kategori"),
        a(O, "Lihat Saldo Gram/Liter per Item"),
        a(O, "Drill-down Mutasi Stok"),
        a(O, "Pantau Stok Minimum → Ajuan Stok", "/operasional/ajuan-stok"),
      ],
    ),
    "laporan-pemakaian": g(
      "laporan-pemakaian",
      "Laporan Pemakaian Base",
      "Laporan Pemakaian Base",
      "/operasional/laporan-pemakaian",
      "Rekap pemakaian base coat per cabang/periode · analisis efisiensi mixing.",
      [
        a(O, "Generate Laporan Pemakaian", "/operasional/laporan-pemakaian"),
        a(O, "Filter Cabang & Periode"),
        a(O, "Bandingkan Pemakaian vs Transaksi"),
        a(O, "Cross-check Rekonsiliasi", "/operasional/rekonsiliasi"),
      ],
    ),
    monitoring: g(
      "monitoring",
      "Monitoring Operasional",
      "Monitoring",
      "/operasional/monitoring",
      "Dashboard KPI · transaksi harian, stok alert, OPB pending.",
      [
        a(O, "Buka Monitoring", "/operasional/monitoring"),
        a(O, "Review KPI & Alert"),
        a(O, "Drill-down ke Menu Terkait"),
      ],
    ),
    cabang: g(
      "cabang",
      "Master Cabang",
      "Master Cabang",
      "/operasional/cabang",
      "Data bengkel mitra · nama, alamat, PIC, status aktif.",
      [a(O, "Kelola Data Cabang"), a(O, "Set PIC & Kontak"), a(O, "Aktif / Nonaktif Cabang")],
    ),
    produk: g(
      "produk",
      "Master Produk",
      "Master Produk",
      "/operasional/produk",
      "Master cat & material · kode, satuan, kategori. Sync ke Finance Barang & Jasa.",
      [
        a(O, "Kelola Master Produk", "/operasional/produk"),
        a(F, "Review Barang & Jasa", "/finance/persediaan/barang-jasa"),
      ],
    ),
    "kategori-harga": g(
      "kategori-harga",
      "Kategori Harga",
      "Kategori Harga",
      "/operasional/kategori-harga",
      "Tier harga per kategori pelanggan/cabang.",
      [a(O, "Kelola Tier & Diskon"), a(O, "Assign ke Cabang/Pelanggan")],
    ),
    "kode-warna": g(
      "kode-warna",
      "Kode Warna",
      "Kode Warna",
      "/operasional/kode-warna",
      "Database kode warna OEM & formula mixing.",
      [a(O, "Cari Kode Warna Mobil"), a(O, "Lihat Formula & Produk Terkait"), a(M, "Dipakai saat Buat Transaksi", "/app/transaksi/baru")],
    ),
  },
};

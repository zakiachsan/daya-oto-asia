import { formatIDR } from "./mock-data";

export type MockColumnFormat = "text" | "idr" | "status" | "number";

export type MockColumnDef = {
  key: string;
  label: string;
  format?: MockColumnFormat;
  className?: string;
};

export type MockStatDef = {
  label: string;
  value: string;
  color?: "blue" | "green" | "orange" | "red" | "amber";
};

export type MockPreviewTable = {
  columns: MockColumnDef[];
  rows: Record<string, unknown>[];
  stats?: MockStatDef[];
};

export const FINANCE_MOCK_PREVIEWS: Record<string, MockPreviewTable> = {
  "buku-besar/pencatatan-beban": {
    stats: [
      { label: "Beban Bulan Ini", value: formatIDR(18500000), color: "amber" },
      { label: "Belum Lunas", value: formatIDR(4200000), color: "orange" },
      { label: "Sudah Dibayar", value: formatIDR(14300000), color: "green" },
    ],
    columns: [
      { key: "id", label: "No. Beban" },
      { key: "tanggal", label: "Tanggal" },
      { key: "akun", label: "Akun Beban" },
      { key: "keterangan", label: "Keterangan" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "BEB/2026/09/001", tanggal: "2026-09-02", akun: "Beban Sewa", keterangan: "Sewa gudang Pusat Sep", jumlah: 8500000, status: "Lunas" },
      { id: "BEB/2026/09/002", tanggal: "2026-09-05", akun: "Beban Listrik", keterangan: "PLN cabang Surabaya", jumlah: 2400000, status: "Lunas" },
      { id: "BEB/2026/09/003", tanggal: "2026-09-08", akun: "Beban Transport", keterangan: "Distribusi toner Malang", jumlah: 1800000, status: "Accrual" },
      { id: "BEB/2026/09/004", tanggal: "2026-09-10", akun: "Beban ATK", keterangan: "Supplies kantor pusat", jumlah: 650000, status: "Lunas" },
      { id: "BEB/2026/09/005", tanggal: "2026-09-12", akun: "Beban Marketing", keterangan: "Sample kit bengkel Jember", jumlah: 4200000, status: "Accrual" },
    ],
  },
  "buku-besar/anggaran": {
    stats: [
      { label: "Total Budget", value: formatIDR(520000000), color: "blue" },
      { label: "Realisasi", value: formatIDR(387500000), color: "green" },
      { label: "Sisa Anggaran", value: "25.5%", color: "amber" },
    ],
    columns: [
      { key: "akun", label: "Akun" },
      { key: "budget", label: "Anggaran", format: "idr", className: "text-right" },
      { key: "realisasi", label: "Realisasi", format: "idr", className: "text-right" },
      { key: "selisih", label: "Selisih", format: "idr", className: "text-right" },
      { key: "persen", label: "% Pakai", format: "number", className: "text-right" },
    ],
    rows: [
      { akun: "Pendapatan Jasa Cat", budget: 480000000, realisasi: 452000000, selisih: -28000000, persen: "94%" },
      { akun: "HPP Bahan Cat", budget: 200000000, realisasi: 180000000, selisih: -20000000, persen: "90%" },
      { akun: "Beban Operasional", budget: 40000000, realisasi: 35500000, selisih: -4500000, persen: "89%" },
      { akun: "Beban Gaji", budget: 72000000, realisasi: 70500000, selisih: -1500000, persen: "98%" },
    ],
  },
  "buku-besar/log-aktivitas-jurnal": {
    stats: [
      { label: "Aktivitas Hari Ini", value: "12", color: "blue" },
      { label: "Post Jurnal", value: "8", color: "green" },
      { label: "Reverse", value: "1", color: "red" },
    ],
    columns: [
      { key: "waktu", label: "Waktu" },
      { key: "user", label: "User" },
      { key: "aksi", label: "Aksi" },
      { key: "jurnal", label: "No. Jurnal" },
      { key: "keterangan", label: "Keterangan" },
    ],
    rows: [
      { waktu: "2026-09-14 08:12", user: "Budi Santoso", aksi: "Post", jurnal: "JU/2026/09/014", keterangan: "Faktur penjualan INV-2026-0087" },
      { waktu: "2026-09-14 09:05", user: "Budi Santoso", aksi: "Create", jurnal: "JU/2026/09/015", keterangan: "Penerimaan penjualan Cakrawala" },
      { waktu: "2026-09-13 16:40", user: "Siti Rahayu", aksi: "Post", jurnal: "JU/2026/09/013", keterangan: "Penyesuaian stok Surabaya" },
      { waktu: "2026-09-13 11:20", user: "Budi Santoso", aksi: "Reverse", jurnal: "JU/2026/09/011", keterangan: "Koreksi jurnal duplikat" },
      { waktu: "2026-09-12 14:55", user: "Budi Santoso", aksi: "Post", jurnal: "JU/2026/09/012", keterangan: "Faktur pembelian PINV-2026-034" },
    ],
  },
  "kas-bank/histori-bank": {
    stats: [
      { label: "Mutasi Bulan Ini", value: "24", color: "blue" },
      { label: "Total Masuk", value: formatIDR(98500000), color: "green" },
      { label: "Total Keluar", value: formatIDR(72300000), color: "red" },
    ],
    columns: [
      { key: "tanggal", label: "Tanggal" },
      { key: "id", label: "Referensi" },
      { key: "tipe", label: "Tipe" },
      { key: "akun", label: "Akun" },
      { key: "keterangan", label: "Keterangan" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
    ],
    rows: [
      { tanggal: "2026-09-10", id: "TRM/2026/09/014", tipe: "Penerimaan", akun: "Kas", keterangan: "Pembayaran tunai Surabaya", jumlah: 2500000 },
      { tanggal: "2026-09-09", id: "PMB/2026/09/013", tipe: "Pembayaran", akun: "Bank BCA", keterangan: "Bayar PO Axalta", jumlah: -8500000 },
      { tanggal: "2026-09-08", id: "TRM/2026/09/012", tipe: "Penerimaan", akun: "Bank BCA", keterangan: "Pembayaran OPB Cakrawala", jumlah: 5800000 },
      { tanggal: "2026-09-07", id: "TRF/2026/09/001", tipe: "Transfer", akun: "Kas → BCA", keterangan: "Setor kas operasional", jumlah: 50000000 },
      { tanggal: "2026-09-06", id: "TRM/2026/09/011", tipe: "Penerimaan", akun: "Bank BCA", keterangan: "Pelunasan piutang Jember", jumlah: 8200000 },
    ],
  },
  "kas-bank/rekening-koran": {
    stats: [
      { label: "Saldo Awal", value: formatIDR(350000000), color: "blue" },
      { label: "Mutasi Net", value: formatIDR(50000000), color: "green" },
      { label: "Saldo Akhir", value: formatIDR(400000000), color: "amber" },
    ],
    columns: [
      { key: "tanggal", label: "Tanggal" },
      { key: "referensi", label: "Referensi" },
      { key: "keterangan", label: "Keterangan" },
      { key: "debit", label: "Debit", format: "idr", className: "text-right" },
      { key: "kredit", label: "Kredit", format: "idr", className: "text-right" },
      { key: "saldo", label: "Saldo", format: "idr", className: "text-right" },
    ],
    rows: [
      { tanggal: "2026-09-01", referensi: "—", keterangan: "Saldo awal", debit: 0, kredit: 0, saldo: 350000000 },
      { tanggal: "2026-09-06", referensi: "TRM/011", keterangan: "Pelunasan piutang Jember", debit: 8200000, kredit: 0, saldo: 358200000 },
      { tanggal: "2026-09-07", referensi: "TRF/001", keterangan: "Setor kas", debit: 50000000, kredit: 0, saldo: 408200000 },
      { tanggal: "2026-09-08", referensi: "TRM/012", keterangan: "OPB Cakrawala", debit: 5800000, kredit: 0, saldo: 414000000 },
      { tanggal: "2026-09-09", referensi: "PMB/013", keterangan: "Bayar PO Axalta", debit: 0, kredit: 8500000, saldo: 405500000 },
    ],
  },
  "kas-bank/rekonsiliasi-bank": {
    stats: [
      { label: "Saldo Buku", value: formatIDR(405500000), color: "blue" },
      { label: "Saldo Bank", value: formatIDR(400000000), color: "green" },
      { label: "Selisih", value: formatIDR(5500000), color: "orange" },
    ],
    columns: [
      { key: "item", label: "Item Rekonsiliasi" },
      { key: "tanggal", label: "Tanggal" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { item: "Setor kas belum kredit bank", tanggal: "2026-09-07", jumlah: 5000000, status: "Outstanding" },
      { item: "Biaya admin bank", tanggal: "2026-09-09", jumlah: 500000, status: "Outstanding" },
      { item: "Penerimaan OPB Cakrawala", tanggal: "2026-09-08", jumlah: 5800000, status: "Matched" },
      { item: "Pembayaran PO Axalta", tanggal: "2026-09-09", jumlah: 8500000, status: "Matched" },
    ],
  },
  "penjualan/retur-penjualan": {
    stats: [
      { label: "Retur Bulan Ini", value: "2", color: "orange" },
      { label: "Total Retur", value: formatIDR(1250000), color: "red" },
      { label: "Faktur Terkait", value: "2", color: "blue" },
    ],
    columns: [
      { key: "id", label: "No. Retur" },
      { key: "tanggal", label: "Tanggal" },
      { key: "faktur", label: "Faktur Asal" },
      { key: "pelanggan", label: "Pelanggan" },
      { key: "alasan", label: "Alasan" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "RET/2026/09/001", tanggal: "2026-09-04", faktur: "INV-2026-0086", pelanggan: "Prima Jember", alasan: "Koreksi qty OPB", jumlah: 750000, status: "Posted" },
      { id: "RET/2026/09/002", tanggal: "2026-09-11", faktur: "INV-2026-0088", pelanggan: "Auto 2000 Surabaya", alasan: "Salah periode tagihan", jumlah: 500000, status: "Draft" },
    ],
  },
  "penjualan/uang-muka-penjualan": {
    stats: [
      { label: "Total DP", value: formatIDR(15000000), color: "green" },
      { label: "Belum Alokasi", value: formatIDR(6000000), color: "amber" },
      { label: "Sudah Alokasi", value: formatIDR(9000000), color: "blue" },
    ],
    columns: [
      { key: "id", label: "No. Uang Muka" },
      { key: "tanggal", label: "Tanggal" },
      { key: "pelanggan", label: "Pelanggan" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "alokasi", label: "Alokasi ke Faktur" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "UMJ/2026/09/001", tanggal: "2026-09-03", pelanggan: "Auto 2000 Surabaya", jumlah: 10000000, alokasi: "INV-2026-0088", status: "Sebagian" },
      { id: "UMJ/2026/09/002", tanggal: "2026-09-09", pelanggan: "Cakrawala Malang", jumlah: 5000000, alokasi: "—", status: "Belum Alokasi" },
    ],
  },
  "persediaan/penerimaan-barang": {
    stats: [
      { label: "GR Bulan Ini", value: "3", color: "blue" },
      { label: "Nilai Diterima", value: formatIDR(25800000), color: "green" },
      { label: "Menunggu Faktur", value: "1", color: "amber" },
    ],
    columns: [
      { key: "id", label: "No. GR" },
      { key: "tanggal", label: "Tanggal" },
      { key: "po", label: "PO" },
      { key: "gudang", label: "Gudang" },
      { key: "items", label: "Item", format: "number", className: "text-right" },
      { key: "nilai", label: "Nilai", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "GR-2026-034", tanggal: "2026-09-06", po: "PO-2026-034", gudang: "Pusat", items: 12, nilai: 8500000, status: "Faktur Posted" },
      { id: "GR-2026-037", tanggal: "2026-09-10", po: "PO-2026-035", gudang: "Pusat", items: 8, nilai: 5200000, status: "Menunggu Faktur" },
      { id: "GR-2026-038", tanggal: "2026-09-12", po: "PO-2026-036", gudang: "Surabaya", items: 15, nilai: 12100000, status: "Draft" },
    ],
  },
  "persediaan/barang-jasa": {
    stats: [
      { label: "Total Produk", value: "76", color: "blue" },
      { label: "Aktif", value: "72", color: "green" },
      { label: "Kategori", value: "8", color: "amber" },
    ],
    columns: [
      { key: "kode", label: "Kode" },
      { key: "nama", label: "Nama Produk" },
      { key: "kategori", label: "Kategori" },
      { key: "satuan", label: "Satuan" },
      { key: "harga", label: "Harga Jual", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { kode: "AXT-HS30-BK", nama: "Toner HS-30 Black", kategori: "1K Solid", satuan: "kaleng", harga: 285000, status: "Aktif" },
      { kode: "AXT-SL-MT", nama: "Toner Silver Metallic", kategori: "Effect", satuan: "gram", harga: 4200, status: "Aktif" },
      { kode: "AXT-CC-100", nama: "Clear Coat CC-100", kategori: "Clear Coat", satuan: "gram", harga: 3800, status: "Aktif" },
      { kode: "AXT-PW-01", nama: "Toner Pearl White", kategori: "Pearl", satuan: "gram", harga: 5100, status: "Aktif" },
      { kode: "AXT-BC-450", nama: "Binder Controller 450", kategori: "Binder", satuan: "liter", harga: 195000, status: "Nonaktif" },
    ],
  },
  "persediaan/barang-per-gudang": {
    stats: [
      { label: "Total Gudang", value: "4", color: "blue" },
      { label: "Nilai Persediaan", value: formatIDR(280000000), color: "green" },
      { label: "SKU Aktif", value: "68", color: "amber" },
    ],
    columns: [
      { key: "produk", label: "Produk" },
      { key: "gudang", label: "Gudang" },
      { key: "qty", label: "Qty", format: "number", className: "text-right" },
      { key: "satuan", label: "Satuan" },
      { key: "nilai", label: "Nilai", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { produk: "Toner HS-30 Black", gudang: "Pusat", qty: 45, satuan: "kaleng", nilai: 12825000, status: "Aman" },
      { produk: "Toner HS-30 Black", gudang: "Surabaya", qty: 2, satuan: "kaleng", nilai: 570000, status: "Kritis" },
      { produk: "Silver Metallic", gudang: "Surabaya", qty: 850, satuan: "gram", nilai: 3570000, status: "Aman" },
      { produk: "Clear Coat CC-100", gudang: "Malang", qty: 120, satuan: "gram", nilai: 456000, status: "Menipis" },
      { produk: "Pearl White", gudang: "Jember", qty: 0, satuan: "gram", nilai: 0, status: "Habis" },
    ],
  },
  "persediaan/barang-stok-minimum": {
    stats: [
      { label: "Alert Aktif", value: "5", color: "red" },
      { label: "Kritis", value: "2", color: "orange" },
      { label: "Normal", value: "63", color: "green" },
    ],
    columns: [
      { key: "produk", label: "Produk" },
      { key: "gudang", label: "Gudang" },
      { key: "stok", label: "Stok", format: "number", className: "text-right" },
      { key: "minimum", label: "Stok Min.", format: "number", className: "text-right" },
      { key: "satuan", label: "Satuan" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { produk: "Toner HS-30 Black", gudang: "Surabaya", stok: 2, minimum: 10, satuan: "kaleng", status: "Kritis" },
      { produk: "Pearl White", gudang: "Jember", stok: 0, minimum: 500, satuan: "gram", status: "Habis" },
      { produk: "Clear Coat CC-100", gudang: "Malang", stok: 120, minimum: 200, satuan: "gram", status: "Menipis" },
      { produk: "Binder 450", gudang: "Pusat", stok: 8, minimum: 5, satuan: "liter", status: "Aman" },
    ],
  },
  "pembelian/pesanan-pembelian": {
    stats: [
      { label: "PO Aktif", value: "3", color: "blue" },
      { label: "Total Nilai", value: formatIDR(26000000), color: "green" },
      { label: "Selesai GR", value: "1", color: "amber" },
    ],
    columns: [
      { key: "id", label: "No. PO" },
      { key: "tanggal", label: "Tanggal" },
      { key: "supplier", label: "Pemasok" },
      { key: "items", label: "Item", format: "number", className: "text-right" },
      { key: "total", label: "Total", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "PO-2026-034", tanggal: "2026-09-05", supplier: "PT Axalta Indonesia", items: 12, total: 8500000, status: "Selesai" },
      { id: "PO-2026-035", tanggal: "2026-09-08", supplier: "PT Nippon Paint", items: 8, total: 5200000, status: "Draft" },
      { id: "PO-2026-036", tanggal: "2026-09-09", supplier: "PT Axalta Indonesia", items: 15, total: 12300000, status: "Menunggu TTD" },
    ],
  },
  "pembelian/uang-muka-pembelian": {
    stats: [
      { label: "Total DP Vendor", value: formatIDR(8000000), color: "green" },
      { label: "Belum Alokasi", value: formatIDR(3000000), color: "amber" },
      { label: "Sudah Alokasi", value: formatIDR(5000000), color: "blue" },
    ],
    columns: [
      { key: "id", label: "No. Uang Muka" },
      { key: "tanggal", label: "Tanggal" },
      { key: "vendor", label: "Pemasok" },
      { key: "po", label: "PO" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "UMP/2026/09/001", tanggal: "2026-09-04", vendor: "PT Axalta Indonesia", po: "PO-2026-034", jumlah: 5000000, status: "Alokasi Penuh" },
      { id: "UMP/2026/09/002", tanggal: "2026-09-09", vendor: "PT Nippon Paint", po: "PO-2026-035", jumlah: 3000000, status: "Belum Alokasi" },
    ],
  },
  "pembelian/penerimaan-barang": {
    stats: [
      { label: "GR Vendor", value: "3", color: "blue" },
      { label: "Nilai GR", value: formatIDR(25800000), color: "green" },
      { label: "Outstanding AP", value: formatIDR(5200000), color: "orange" },
    ],
    columns: [
      { key: "id", label: "No. GR" },
      { key: "tanggal", label: "Tanggal" },
      { key: "po", label: "PO" },
      { key: "vendor", label: "Pemasok" },
      { key: "nilai", label: "Nilai", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "GR-2026-034", tanggal: "2026-09-06", po: "PO-2026-034", vendor: "PT Axalta Indonesia", nilai: 8500000, status: "Invoiced" },
      { id: "GR-2026-037", tanggal: "2026-09-10", po: "PO-2026-035", vendor: "PT Nippon Paint", nilai: 5200000, status: "Pending Invoice" },
      { id: "GR-2026-038", tanggal: "2026-09-12", po: "PO-2026-036", vendor: "PT Axalta Indonesia", nilai: 12100000, status: "Draft" },
    ],
  },
  "aset-tetap/aset-tetap": {
    stats: [
      { label: "Total Aset", value: "18", color: "blue" },
      { label: "Nilai Perolehan", value: formatIDR(920000000), color: "green" },
      { label: "Nilai Buku", value: formatIDR(645000000), color: "amber" },
    ],
    columns: [
      { key: "kode", label: "Kode Aset" },
      { key: "nama", label: "Nama Aset" },
      { key: "kategori", label: "Kategori" },
      { key: "perolehan", label: "Tgl Perolehan" },
      { key: "nilai", label: "Nilai Perolehan", format: "idr", className: "text-right" },
      { key: "buku", label: "Nilai Buku", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { kode: "AT-001", nama: "Mixer Toner Industrial", kategori: "Mesin Produksi", perolehan: "2024-03-15", nilai: 185000000, buku: 148000000, status: "Aktif" },
      { kode: "AT-002", nama: "Mobil Distribusi Hino", kategori: "Kendaraan", perolehan: "2023-08-01", nilai: 320000000, buku: 224000000, status: "Aktif" },
      { kode: "AT-003", nama: "Rak Gudang Surabaya", kategori: "Peralatan", perolehan: "2025-01-10", nilai: 45000000, buku: 40500000, status: "Aktif" },
      { kode: "AT-004", nama: "Laptop Admin (5 unit)", kategori: "Elektronik", perolehan: "2025-06-20", nilai: 75000000, buku: 60000000, status: "Aktif" },
    ],
  },
  "aset-tetap/kategori-aset": {
    stats: [
      { label: "Kategori", value: "6", color: "blue" },
      { label: "Masa Manfaat Avg", value: "8 th", color: "green" },
      { label: "Total Aset", value: "18", color: "amber" },
    ],
    columns: [
      { key: "kode", label: "Kode" },
      { key: "nama", label: "Nama Kategori" },
      { key: "masaManfaat", label: "Masa Manfaat (th)" },
      { key: "metode", label: "Metode Susut" },
      { key: "jumlah", label: "Jumlah Aset", format: "number", className: "text-right" },
    ],
    rows: [
      { kode: "KT-01", nama: "Mesin Produksi", masaManfaat: 10, metode: "Garis Lurus", jumlah: 4 },
      { kode: "KT-02", nama: "Kendaraan", masaManfaat: 8, metode: "Garis Lurus", jumlah: 3 },
      { kode: "KT-03", nama: "Peralatan Gudang", masaManfaat: 5, metode: "Garis Lurus", jumlah: 6 },
      { kode: "KT-04", nama: "Elektronik & IT", masaManfaat: 4, metode: "Garis Lurus", jumlah: 5 },
    ],
  },
  "aset-tetap/perubahan-aset-tetap": {
    stats: [
      { label: "Perubahan YTD", value: "3", color: "blue" },
      { label: "Revaluasi", value: formatIDR(25000000), color: "green" },
      { label: "Penyesuaian", value: "1", color: "amber" },
    ],
    columns: [
      { key: "tanggal", label: "Tanggal" },
      { key: "aset", label: "Aset" },
      { key: "jenis", label: "Jenis Perubahan" },
      { key: "nilaiLama", label: "Nilai Lama", format: "idr", className: "text-right" },
      { key: "nilaiBaru", label: "Nilai Baru", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { tanggal: "2026-06-15", aset: "AT-001 Mixer Toner", jenis: "Perpanjang masa manfaat", nilaiLama: 185000000, nilaiBaru: 185000000, status: "Posted" },
      { tanggal: "2026-08-02", aset: "AT-003 Rak Gudang", jenis: "Revaluasi", nilaiLama: 40000000, nilaiBaru: 45000000, status: "Posted" },
      { tanggal: "2026-09-01", aset: "AT-004 Laptop Admin", jenis: "Penambahan unit", nilaiLama: 60000000, nilaiBaru: 75000000, status: "Draft" },
    ],
  },
  "aset-tetap/disposisi-aset-tetap": {
    stats: [
      { label: "Disposisi YTD", value: "1", color: "orange" },
      { label: "Nilai Buku Dilepas", value: formatIDR(12000000), color: "red" },
      { label: "Gain/Loss", value: formatIDR(-2000000), color: "amber" },
    ],
    columns: [
      { key: "id", label: "No. Disposisi" },
      { key: "tanggal", label: "Tanggal" },
      { key: "aset", label: "Aset" },
      { key: "nilaiBuku", label: "Nilai Buku", format: "idr", className: "text-right" },
      { key: "hargaJual", label: "Harga Jual", format: "idr", className: "text-right" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "DSP/2026/001", tanggal: "2026-07-20", aset: "AT-OLD-01 Printer Label", nilaiBuku: 12000000, hargaJual: 10000000, status: "Posted" },
    ],
  },
  "aset-tetap/pindah-aset": {
    stats: [
      { label: "Pindah YTD", value: "2", color: "blue" },
      { label: "Antar Cabang", value: "2", color: "green" },
      { label: "Pending", value: "0", color: "amber" },
    ],
    columns: [
      { key: "id", label: "No. Transfer" },
      { key: "tanggal", label: "Tanggal" },
      { key: "aset", label: "Aset" },
      { key: "dari", label: "Dari Lokasi" },
      { key: "ke", label: "Ke Lokasi" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { id: "MV/2026/001", tanggal: "2026-05-10", aset: "AT-003 Rak Gudang", dari: "Pusat", ke: "Surabaya", status: "Selesai" },
      { id: "MV/2026/002", tanggal: "2026-08-18", aset: "AT-005 Timbangan Digital", dari: "Malang", ke: "Jember", status: "Selesai" },
    ],
  },
  "aset-tetap/aset-per-lokasi": {
    stats: [
      { label: "Lokasi", value: "4", color: "blue" },
      { label: "Total Aset", value: "18", color: "green" },
      { label: "Nilai Buku", value: formatIDR(645000000), color: "amber" },
    ],
    columns: [
      { key: "lokasi", label: "Lokasi" },
      { key: "jumlah", label: "Jumlah Aset", format: "number", className: "text-right" },
      { key: "nilaiBuku", label: "Nilai Buku", format: "idr", className: "text-right" },
      { key: "terbesar", label: "Aset Terbesar" },
    ],
    rows: [
      { lokasi: "Pusat", jumlah: 8, nilaiBuku: 385000000, terbesar: "Mixer Toner Industrial" },
      { lokasi: "Surabaya", jumlah: 4, nilaiBuku: 98000000, terbesar: "Rak Gudang Surabaya" },
      { lokasi: "Malang", jumlah: 3, nilaiBuku: 72000000, terbesar: "Timbangan Digital" },
      { lokasi: "Jember", jumlah: 3, nilaiBuku: 90000000, terbesar: "Mobil Distribusi (cadang)" },
    ],
  },
  "perusahaan/proses-akhir-bulan": {
    stats: [
      { label: "Periode", value: "Sep 2026", color: "blue" },
      { label: "Selesai", value: "4/7", color: "green" },
      { label: "Status", value: "In Progress", color: "amber" },
    ],
    columns: [
      { key: "step", label: "Langkah" },
      { key: "pic", label: "PIC" },
      { key: "deadline", label: "Deadline" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { step: "Rekonsiliasi bank", pic: "Budi Santoso", deadline: "2026-09-30", status: "Selesai" },
      { step: "Posting penyesuaian stok", pic: "Budi Santoso", deadline: "2026-09-30", status: "Selesai" },
      { step: "Accrual beban", pic: "Siti Rahayu", deadline: "2026-09-30", status: "Selesai" },
      { step: "Depresiasi aset tetap", pic: "Budi Santoso", deadline: "2026-09-30", status: "Selesai" },
      { step: "Jurnal laba ditahan", pic: "Budi Santoso", deadline: "2026-10-01", status: "Pending" },
      { step: "Lock periode", pic: "Budi Santoso", deadline: "2026-10-02", status: "Pending" },
      { step: "Review laporan keuangan", pic: "Management", deadline: "2026-10-03", status: "Pending" },
    ],
  },
  "perusahaan/gaji-tunjangan": {
    stats: [
      { label: "Payroll Sep", value: formatIDR(15255000), color: "green" },
      { label: "Posted", value: "1/3", color: "blue" },
      { label: "Draft", value: "2", color: "amber" },
    ],
    columns: [
      { key: "periode", label: "Periode" },
      { key: "karyawan", label: "Karyawan" },
      { key: "cabang", label: "Cabang" },
      { key: "bersih", label: "Gaji Bersih", format: "idr", className: "text-right" },
      { key: "jurnal", label: "No. Jurnal" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { periode: "Agustus 2026", karyawan: "Rudi Hartono", cabang: "Malang", bersih: 5000000, jurnal: "JU/2026/08/045", status: "Posted" },
      { periode: "Agustus 2026", karyawan: "Andi Wijaya", cabang: "Surabaya", bersih: 5170000, jurnal: "—", status: "Draft" },
      { periode: "Agustus 2026", karyawan: "Eko Prasetyo", cabang: "Jember", bersih: 5085000, jurnal: "—", status: "Draft" },
    ],
  },
  "perusahaan/karyawan": {
    stats: [
      { label: "Total Karyawan", value: "5", color: "blue" },
      { label: "Tinter", value: "3", color: "green" },
      { label: "Pusat", value: "2", color: "amber" },
    ],
    columns: [
      { key: "nama", label: "Nama" },
      { key: "jabatan", label: "Jabatan" },
      { key: "cabang", label: "Cabang" },
      { key: "mulai", label: "Mulai Kerja" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { nama: "Andi Wijaya", jabatan: "Tinter", cabang: "Auto 2000 Surabaya", mulai: "2023-04-01", status: "Aktif" },
      { nama: "Rudi Hartono", jabatan: "Tinter", cabang: "Cakrawala Malang", mulai: "2022-11-15", status: "Aktif" },
      { nama: "Eko Prasetyo", jabatan: "Tinter", cabang: "Prima Jember", mulai: "2024-01-08", status: "Aktif" },
      { nama: "Pak Ahmad", jabatan: "Supervisor", cabang: "Pusat", mulai: "2020-06-01", status: "Aktif" },
      { nama: "Siti Rahayu", jabatan: "HR", cabang: "Pusat", mulai: "2021-03-20", status: "Aktif" },
    ],
  },
  "perusahaan/transaksi-berulang": {
    stats: [
      { label: "Template Aktif", value: "4", color: "blue" },
      { label: "Bulan Ini", value: "3", color: "green" },
      { label: "Pending", value: "1", color: "amber" },
    ],
    columns: [
      { key: "nama", label: "Nama Template" },
      { key: "frekuensi", label: "Frekuensi" },
      { key: "jumlah", label: "Jumlah", format: "idr", className: "text-right" },
      { key: "nextRun", label: "Jadwal Berikut" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { nama: "Sewa gudang Pusat", frekuensi: "Bulanan", jumlah: 8500000, nextRun: "2026-10-01", status: "Aktif" },
      { nama: "Langganan software HRIS", frekuensi: "Bulanan", jumlah: 2500000, nextRun: "2026-10-05", status: "Aktif" },
      { nama: "Internet & telepon", frekuensi: "Bulanan", jumlah: 1800000, nextRun: "2026-10-10", status: "Aktif" },
      { nama: "Asuransi kendaraan", frekuensi: "Tahunan", jumlah: 12000000, nextRun: "2027-03-01", status: "Aktif" },
    ],
  },
  "perusahaan/kalender": {
    stats: [
      { label: "Event Bulan Ini", value: "8", color: "blue" },
      { label: "Jatuh Tempo AR/AP", value: "5", color: "orange" },
      { label: "Payroll", value: "1", color: "green" },
    ],
    columns: [
      { key: "tanggal", label: "Tanggal" },
      { key: "event", label: "Event" },
      { key: "tipe", label: "Tipe" },
      { key: "pihak", label: "Pihak / PIC" },
      { key: "status", label: "Status", format: "status" },
    ],
    rows: [
      { tanggal: "2026-09-20", event: "Jatuh tempo hutang Axalta", tipe: "AP", pihak: "PT Axalta Indonesia", status: "Upcoming" },
      { tanggal: "2026-09-25", event: "Stock opname Surabaya", tipe: "Operasional", pihak: "Andi Wijaya", status: "Scheduled" },
      { tanggal: "2026-09-30", event: "Closing bulan September", tipe: "Finance", pihak: "Budi Santoso", status: "Scheduled" },
      { tanggal: "2026-09-30", event: "Jatuh tempo piutang Surabaya", tipe: "AR", pihak: "Auto 2000 Surabaya", status: "Upcoming" },
      { tanggal: "2026-10-01", event: "Posting payroll Agustus", tipe: "Payroll", pihak: "Siti Rahayu", status: "Pending" },
    ],
  },
  "perusahaan/kontak": {
    stats: [
      { label: "Total Kontak", value: "12", color: "blue" },
      { label: "Pelanggan", value: "4", color: "green" },
      { label: "Vendor", value: "2", color: "amber" },
    ],
    columns: [
      { key: "nama", label: "Nama" },
      { key: "perusahaan", label: "Perusahaan" },
      { key: "tipe", label: "Tipe" },
      { key: "telepon", label: "Telepon" },
      { key: "email", label: "Email" },
    ],
    rows: [
      { nama: "Budi Santoso", perusahaan: "Daya Oto Asia", tipe: "Internal", telepon: "0812-9999-0001", email: "admin@dayaoto.com" },
      { nama: "PIC Finance Astra", perusahaan: "Auto 2000 Surabaya", tipe: "Pelanggan", telepon: "031-888-1234", email: "finance.astra@sby.com" },
      { nama: "Sales Axalta", perusahaan: "PT Axalta Indonesia", tipe: "Vendor", telepon: "021-555-7890", email: "sales@axalta.co.id" },
      { nama: "Pak Ahmad", perusahaan: "Daya Oto Asia", tipe: "Internal", telepon: "0813-7777-0002", email: "ahmad@dayaoto.com" },
      { nama: "PIC Cakrawala", perusahaan: "Cakrawala Malang", tipe: "Pelanggan", telepon: "0341-555-4321", email: "ap@cakrawala.com" },
    ],
  },
  "perusahaan/transaksi-favorit": {
    stats: [
      { label: "Favorit", value: "6", color: "blue" },
      { label: "Paling Dipakai", value: "Setor Kas", color: "green" },
      { label: "User", value: "3", color: "amber" },
    ],
    columns: [
      { key: "nama", label: "Nama Shortcut" },
      { key: "modul", label: "Modul" },
      { key: "akunDebit", label: "Dr" },
      { key: "akunKredit", label: "Cr" },
      { key: "user", label: "User" },
    ],
    rows: [
      { nama: "Setor kas ke BCA", modul: "Transfer Bank", akunDebit: "Bank BCA", akunKredit: "Kas", user: "Budi Santoso" },
      { nama: "Bayar sewa gudang", modul: "Pencatatan Beban", akunDebit: "Beban Sewa", akunKredit: "Bank BCA", user: "Budi Santoso" },
      { nama: "Terima OPB bengkel", modul: "Penerimaan Penjualan", akunDebit: "Bank BCA", akunKredit: "Piutang Usaha", user: "Budi Santoso" },
      { nama: "Bayar vendor Axalta", modul: "Pembayaran Pembelian", akunDebit: "Hutang Usaha", akunKredit: "Bank BCA", user: "Budi Santoso" },
    ],
  },
  "perusahaan/log-aktivitas": {
    stats: [
      { label: "Log Hari Ini", value: "18", color: "blue" },
      { label: "User Aktif", value: "3", color: "green" },
      { label: "Modul Top", value: "Penjualan", color: "amber" },
    ],
    columns: [
      { key: "waktu", label: "Waktu" },
      { key: "user", label: "User" },
      { key: "modul", label: "Modul" },
      { key: "aksi", label: "Aksi" },
      { key: "detail", label: "Detail" },
    ],
    rows: [
      { waktu: "2026-09-14 09:12", user: "Budi Santoso", modul: "Penjualan", aksi: "Post Faktur", detail: "INV-2026-0087" },
      { waktu: "2026-09-14 08:45", user: "Budi Santoso", modul: "Kas & Bank", aksi: "Transfer", detail: "TRF/2026/09/001" },
      { waktu: "2026-09-13 16:30", user: "Siti Rahayu", modul: "Perusahaan", aksi: "Update Syarat Bayar", detail: "NET30" },
      { waktu: "2026-09-13 14:10", user: "Budi Santoso", modul: "Pembelian", aksi: "Post Faktur Beli", detail: "PINV-2026-034" },
      { waktu: "2026-09-12 11:00", user: "Budi Santoso", modul: "Persediaan", aksi: "Post Penyesuaian", detail: "ADJ-2026-012" },
    ],
  },
};

export function getFinanceMockPreview(pathKey: string): MockPreviewTable | undefined {
  return FINANCE_MOCK_PREVIEWS[pathKey];
}

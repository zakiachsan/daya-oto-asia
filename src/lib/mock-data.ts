import { AXT_PRODUK } from "./axt-products";
import type { TransaksiDraftWizard } from "./transaksi-draft-utils";
import type { ProdukKategoriId, TransaksiStatus } from "./transaksi-status-utils";

export const MOCK_USER = {
  name: "Budi Santoso",
  role: "admin",
  email: "admin@dayaoto.com",
};

export const MOCK_CABANG = [
  { id: "1", nama: "Bengkel Auto 2000 Surabaya", kota: "Surabaya", tinter: 2, stokAlert: 1, minStokGram: 500 },
  { id: "2", nama: "Bengkel Cakrawala Malang", kota: "Malang", tinter: 1, stokAlert: 0, minStokGram: 300 },
  { id: "3", nama: "Bengkel Prima Jember", kota: "Jember", tinter: 2, stokAlert: 2, minStokGram: 400 },
  { id: "4", nama: "Bengkel Surya Kediri", kota: "Kediri", tinter: 1, stokAlert: 0, minStokGram: 350 },
];

export type TransaksiBahan = { kode: string; nama: string; gram: number };

export type TransaksiLayer = {
  layer: number;
  label: string;
  bahan: TransaksiBahan[];
};

/** Satu kategori produk dalam receipt yang sama (tambah bahan) */
export type TransaksiProdukLine = {
  produkKategori: ProdukKategoriId;
  kodeWarna: string;
  warna: string;
  kategori: string;
  bahan: TransaksiBahan[];
  layers?: TransaksiLayer[];
  mixingVolume: number;
  total: number;
  lainLainLabel?: string;
  lainLainSubKategori?: string;
};

export type TransaksiRow = {
  id: string;
  /** Sama dengan id · ditampilkan sebagai Receipt ID di nota */
  receiptId?: string;
  tanggal: string;
  cabang: string;
  warna: string;
  kodeWarna: string;
  kategori: string;
  tinter: string;
  status: TransaksiStatus | string;
  total: number;
  mobil: string;
  platNomor: string;
  /** Kategori pekerjaan selain basecoat (dempul, primer, dll.) */
  produkKategori?: ProdukKategoriId;
  /** Multi-layer basecoat (1–3 layer) */
  layers?: TransaksiLayer[];
  /** Foto sample plat wajib sebelum cetak nota */
  fotoSample?: boolean;
  /** Waktu tinter mulai transaksi (tap di app) */
  waktuMulai: string;
  /** Waktu selesai mixing · dipakai hitung durasi kinerja */
  waktuSelesaiMixing: string | null;
  durasiMixingMenit: number | null;
  waktuCetakNota: string | null;
  waktuTTD: string | null;
  durasiTotalMenit: number | null;
  bahan: TransaksiBahan[];
  opbId: string | null;
  /** Penambahan bahan ke mobil yang sama (sebelum lock) */
  parentId?: string;
  /** Beberapa kategori produk · satu Receipt ID */
  produkLines?: TransaksiProdukLine[];
  /** Field nota Bogor */
  noPkb?: string;
  jumlahPanel?: number;
  noVendor?: string;
  mixingVolume?: number;
  recipeId?: string;
  /** Label baris lain-lain di nota (#33) */
  lainLainLabel?: string;
  lainLainSubKategori?: string;
  lainLainHarga?: number;
  /** Waktu cetak label cat (#28) */
  waktuCetakLabel?: string | null;
  draftWizard?: TransaksiDraftWizard;
};

export const MOCK_TRANSAKSI: TransaksiRow[] = [
  {
    id: "DOA-2609-2813",
    tanggal: "2026-09-26",
    cabang: "Auto 2000 Surabaya",
    warna: "Silver Metallic",
    kodeWarna: "1G3",
    kategori: "Silver",
    tinter: "Andi Wijaya",
    status: "Menunggu TTD",
    receiptId: "RCP-DOA-Auto2000Surabaya-26/09/2026-L9999QA",
    fotoSample: true,
    total: 210000,
    mobil: "Toyota Avanza 2024",
    platNomor: "L 9999 QA",
    jumlahPanel: 1,
    mixingVolume: 50,
    recipeId: "RCP-DOA-Auto2000Surabaya-26/09/2026-L9999QA",
    waktuMulai: "2026-09-26T08:00:00",
    waktuSelesaiMixing: "2026-09-26T08:20:00",
    durasiMixingMenit: 20,
    waktuCetakNota: "2026-09-26T08:25:00",
    waktuTTD: null,
    durasiTotalMenit: null,
    bahan: [{ kode: "AXT-207", nama: "AXT-207 BLACK TONER", gram: 10 }],
    opbId: null,
  },
  {
    id: "DOA-2026-0142",
    tanggal: "2026-09-10",
    cabang: "Auto 2000 Surabaya",
    warna: "Silver Metallic",
    kodeWarna: "1G3",
    kategori: "Silver",
    tinter: "Andi Wijaya",
    status: "Selesai",
    receiptId: "RCP-DOA-Auto2000Surabaya-10/09/2026-L1234ABC",
    fotoSample: true,
    total: 210000,
    mobil: "Toyota Avanza 2024",
    platNomor: "L 1234 ABC",
    noPkb: "PKB-2026-0892",
    jumlahPanel: 2,
    noVendor: "VND-AXT-001",
    mixingVolume: 50,
    recipeId: "RCP-1G3-50G",
    waktuMulai: "2026-09-10T08:15:00",
    waktuSelesaiMixing: "2026-09-10T08:33:00",
    durasiMixingMenit: 18,
    waktuCetakNota: "2026-09-10T08:34:00",
    waktuTTD: "2026-09-10T08:36:00",
    durasiTotalMenit: 21,
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)", gram: 8 },
      { kode: "AXT-814", nama: "AXT-814 ULTRA FINE BRIGHT SILVER (0,9L)", gram: 35 },
      { kode: "AXT-811", nama: "AXT-811 FINE WHITE SILVER (0,9L)", gram: 7 },
    ],
    opbId: "OPB-2026-0089",
  },
  {
    id: "DOA-2026-0141",
    tanggal: "2026-09-10",
    cabang: "Cakrawala Malang",
    warna: "Merah Solid",
    kodeWarna: "3R1",
    kategori: "Red",
    tinter: "Rudi Hartono",
    status: "Menunggu TTD",
    receiptId: "RCP-DOA-CakrawalaMalang-10/09/2026-N5678XY",
    fotoSample: true,
    total: 210000,
    mobil: "Honda Brio 2022",
    platNomor: "N 5678 XY",
    noPkb: "PKB-2026-0891",
    jumlahPanel: 1,
    mixingVolume: 50,
    recipeId: "RCP-3R1-50G",
    waktuMulai: "2026-09-10T09:05:00",
    waktuSelesaiMixing: "2026-09-10T09:24:00",
    durasiMixingMenit: 19,
    waktuCetakNota: "2026-09-10T09:25:00",
    waktuTTD: null,
    durasiTotalMenit: null,
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)", gram: 12 },
      { kode: "AXT-501", nama: "AXT-501 TRANSOXIDE RED (0,9L)", gram: 38 },
    ],
    opbId: null,
  },
  {
    id: "DOA-2026-0140",
    tanggal: "2026-09-09",
    cabang: "Prima Jember",
    warna: "Pearl White",
    kodeWarna: "PW2",
    kategori: "Pearl",
    tinter: "Eko Prasetyo",
    status: "Draft",
    receiptId: "RCP-DOA-PrimaJember-09/09/2026-P9012JK",
    total: 230000,
    mobil: "Mitsubishi Xpander 2023",
    platNomor: "P 9012 JK",
    mixingVolume: 50,
    recipeId: "RCP-PW2-50G",
    waktuMulai: "2026-09-09T14:20:00",
    waktuSelesaiMixing: null,
    durasiMixingMenit: null,
    waktuCetakNota: null,
    waktuTTD: null,
    durasiTotalMenit: null,
    bahan: [
      { kode: "AXT-101", nama: "AXT-101 TRANSPARENT WHITE (0,9L)", gram: 15 },
      { kode: "AXT-910", nama: "AXT-910 WHITE PEARL (0,9L)", gram: 30 },
      { kode: "AXT-911", nama: "AXT-911 FINE WHITE PEARL (0,9L)", gram: 5 },
    ],
    opbId: null,
  },
  {
    id: "DOA-2026-0139",
    tanggal: "2026-09-09",
    cabang: "Auto 2000 Surabaya",
    warna: "Hitam Special",
    kodeWarna: "SP9",
    kategori: "Special",
    tinter: "Andi Wijaya",
    status: "Menunggu OPB",
    receiptId: "RCP-DOA-Auto2000Surabaya-09/09/2026-L3456DEF",
    fotoSample: true,
    total: 210000,
    mobil: "Toyota Fortuner 2021",
    platNomor: "L 3456 DEF",
    mixingVolume: 50,
    recipeId: "RCP-SP9-50G",
    waktuMulai: "2026-09-09T10:00:00",
    waktuSelesaiMixing: "2026-09-09T10:28:00",
    durasiMixingMenit: 28,
    waktuCetakNota: "2026-09-09T10:29:00",
    waktuTTD: "2026-09-09T10:32:00",
    durasiTotalMenit: 32,
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)", gram: 40 },
      { kode: "AXT-203", nama: "AXT-203 BLUE BLACK (0,9L)", gram: 8 },
      { kode: "AXT-60", nama: "AXT-60 FLIP CONTROLLER (0,9L)", gram: 2 },
    ],
    opbId: "OPB-2026-0089",
  },
];

export function formatWaktu(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function formatDurasi(menit: number | null) {
  if (menit == null) return "-";
  if (menit < 60) return `${menit} menit`;
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  return sisa > 0 ? `${jam} jam ${sisa} menit` : `${jam} jam`;
}

export type OpbRow = {
  id: string;
  cabang: string;
  periode: string;
  jumlahTrx: number;
  total: number;
  status: "Draft" | "Menunggu TTD" | "Rekonsiliasi" | "Ditagihkan";
  sap: string;
  /** Tanggal OPB diinput admin (#49) */
  tanggalOpb?: string;
};

export const MOCK_OPB: OpbRow[] = [
  { id: "OPB-2026-0089", cabang: "Auto 2000 Surabaya", periode: "Agustus 2026", jumlahTrx: 47, total: 12500000, status: "Menunggu TTD", sap: "" },
  { id: "OPB-2026-0088", cabang: "Cakrawala Malang", periode: "Agustus 2026", jumlahTrx: 23, total: 5800000, status: "Ditagihkan", sap: "SAP-2026-445" },
  { id: "OPB-2026-0087", cabang: "Prima Jember", periode: "Agustus 2026", jumlahTrx: 31, total: 8200000, status: "Rekonsiliasi", sap: "" },
];

export const MOCK_STOK = [
  { produk: "Toner HS-30 Black", cabang: "Pusat", qty: 45, satuan: "kaleng", status: "Aman" },
  { produk: "Toner HS-30 Black", cabang: "Surabaya", qty: 2, satuan: "kaleng", status: "Kritis" },
  { produk: "Toner Silver Metallic", cabang: "Surabaya", qty: 850, satuan: "gram", status: "Aman" },
  { produk: "Clear Coat CC-100", cabang: "Malang", qty: 120, satuan: "gram", status: "Menipis" },
  { produk: "Toner Pearl White", cabang: "Jember", qty: 0, satuan: "gram", status: "Habis" },
];

export const MOCK_KARYAWAN = [
  { id: "1", nama: "Andi Wijaya", jabatan: "Tinter", cabang: "Auto 2000 Surabaya", status: "Aktif" },
  { id: "2", nama: "Rudi Hartono", jabatan: "Tinter", cabang: "Cakrawala Malang", status: "Aktif" },
  { id: "3", nama: "Eko Prasetyo", jabatan: "Tinter", cabang: "Prima Jember", status: "Aktif" },
  { id: "4", nama: "Pak Ahmad", jabatan: "Supervisor", cabang: "Pusat", status: "Aktif" },
  { id: "5", nama: "Siti Rahayu", jabatan: "HR", cabang: "Pusat", status: "Aktif" },
];

export const MOCK_JURNAL = [
  { id: "JU/2026/09/001", tanggal: "2026-09-01", keterangan: "Tagihan OPB Auto 2000 Agustus", debit: 12500000, kredit: 12500000, status: "Posted" },
  { id: "JU/2026/09/002", tanggal: "2026-09-05", keterangan: "Penerimaan barang PO-2026-034", debit: 8500000, kredit: 8500000, status: "Posted" },
  { id: "JU/2026/09/003", tanggal: "2026-09-08", keterangan: "Penyesuaian stok opname Surabaya", debit: 250000, kredit: 250000, status: "Draft" },
];

export const MOCK_REKONSILIASI = [
  { cabang: "Auto 2000 Surabaya", opb: 47, notaCetak: 45, stokPakai: 44, selisih: 3, status: "Perlu Review" },
  { cabang: "Cakrawala Malang", opb: 23, notaCetak: 23, stokPakai: 23, selisih: 0, status: "Selesai" },
  { cabang: "Prima Jember", opb: 31, notaCetak: 28, stokPakai: 28, selisih: 3, status: "Perlu Review" },
];

export const MOCK_STOCK_OPNAME = [
  { id: "SO-2026-034", cabang: "Surabaya", tinter: "Andi Wijaya", tanggal: "2026-09-06", produk: "Toner HS-30 Black", sistem: 850, fisik: 845, selisih: -5, status: "Selesai" },
  { id: "SO-2026-035", cabang: "Surabaya", tinter: "Andi Wijaya", tanggal: "2026-09-06", produk: "Silver Metallic", sistem: 420, fisik: 380, selisih: -40, status: "Perlu Review" },
  { id: "SO-2026-036", cabang: "Malang", tinter: "Rudi Hartono", tanggal: "2026-09-06", produk: "Clear Coat CC-100", sistem: 120, fisik: 118, selisih: -2, status: "Selesai" },
];

/** 76 produk Axalta dari List Produk AXT.xlsx */
export const MOCK_PRODUK = AXT_PRODUK.map((p) => ({
  kode: p.kode,
  nama: p.nama,
  kategori: p.kategoriAxalta,
  kategoriTarif: p.kategoriTarif,
  satuan: p.satuan,
  beratKaleng: p.beratKaleng,
  status: p.status,
}));

/** Tarif referensi DOA Cabang Bogor · per liter */
export const MOCK_KATEGORI_HARGA = [
  { kategori: "Standard", harga: 190000, satuan: "liter", contoh: "1K Solid · hitam, putih, biru" },
  { kategori: "Red", harga: 210000, satuan: "liter", contoh: "Merah solid" },
  { kategori: "Yellow", harga: 210000, satuan: "liter", contoh: "Kuning solid" },
  { kategori: "Special", harga: 210000, satuan: "liter", contoh: "Special effect, hitam special" },
  { kategori: "Silver", harga: 210000, satuan: "liter", contoh: "Silver metallic, fine silver" },
  { kategori: "Pearl", harga: 230000, satuan: "liter", contoh: "Pearl white, pearl red" },
  { kategori: "Xyralic", harga: 325000, satuan: "liter", contoh: "Crystal pearl, xyralic" },
  { kategori: "Clear Coat", harga: 180000, satuan: "liter", contoh: "Clear coat 1K/2K" },
  { kategori: "Surfacers", harga: 165000, satuan: "liter", contoh: "Primer, filler, surfacer" },
  { kategori: "Thinner", harga: 95000, satuan: "liter", contoh: "Reducer, thinner" },
  { kategori: "Putty", harga: 145000, satuan: "liter", contoh: "Body filler, putty" },
];

export function getHargaKategori(kategori: string): number {
  return MOCK_KATEGORI_HARGA.find((k) => k.kategori === kategori)?.harga ?? 190000;
}

export const MOCK_PO = [
  { id: "PO-2026-034", tanggal: "2026-09-05", supplier: "PT Axalta Indonesia", items: 12, total: 8500000, status: "Selesai", gr: "GR-2026-034" },
  { id: "PO-2026-035", tanggal: "2026-09-08", supplier: "PT Nippon Paint", items: 8, total: 5200000, status: "Draft", gr: "" },
  { id: "PO-2026-036", tanggal: "2026-09-09", supplier: "PT Axalta Indonesia", items: 15, total: 12300000, status: "Menunggu TTD", gr: "" },
];

export const MOCK_DISTRIBUSI = [
  { id: "DIST-2026-018", tanggal: "2026-09-07", dari: "Pusat", ke: "Surabaya", items: 24, status: "Selesai" },
  { id: "DIST-2026-019", tanggal: "2026-09-08", dari: "Pusat", ke: "Malang", items: 12, status: "Selesai" },
  { id: "DIST-2026-020", tanggal: "2026-09-09", dari: "Pusat", ke: "Jember", items: 18, status: "Draft" },
];

export const MOCK_COA = [
  { kode: "110101", nama: "Kas", tipe: "Aset", sub: "Kas & Bank", saldo: 450000000 },
  { kode: "110201", nama: "Bank BCA", tipe: "Aset", sub: "Kas & Bank", saldo: 400000000 },
  { kode: "110301", nama: "Piutang Usaha", tipe: "Aset", sub: "Piutang", saldo: 125000000 },
  { kode: "130101", nama: "Persediaan Bahan Cat", tipe: "Aset", sub: "Persediaan", saldo: 280000000 },
  { kode: "210101", nama: "Hutang Usaha", tipe: "Kewajiban", sub: "Hutang", saldo: 45000000 },
  { kode: "410101", nama: "Pendapatan Jasa Cat", tipe: "Pendapatan", sub: "Pendapatan", saldo: 452000000 },
  { kode: "510101", nama: "HPP Bahan Cat", tipe: "Beban", sub: "Beban", saldo: 180000000 },
];

export const MOCK_KAS_BANK = [
  { id: "PMB/2026/09/012", tanggal: "2026-09-08", tipe: "Penerimaan", akun: "Bank BCA", keterangan: "Pembayaran OPB Cakrawala", jumlah: 5800000 },
  { id: "PMB/2026/09/013", tanggal: "2026-09-09", tipe: "Pembayaran", akun: "Bank BCA", keterangan: "Bayar PO Axalta", jumlah: -8500000 },
  { id: "PMB/2026/09/014", tanggal: "2026-09-10", tipe: "Penerimaan", akun: "Kas", keterangan: "Pembayaran tunai Surabaya", jumlah: 2500000 },
];

export const MOCK_SLIP_GAJI = [
  { nama: "Andi Wijaya", cabang: "Surabaya", gajiPokok: 4500000, tunjangan: 500000, lembur: 320000, potongan: 150000, bersih: 5170000, status: "Draft" },
  { nama: "Rudi Hartono", cabang: "Malang", gajiPokok: 4500000, tunjangan: 500000, lembur: 0, potongan: 0, bersih: 5000000, status: "Posted" },
  { nama: "Eko Prasetyo", cabang: "Jember", gajiPokok: 4500000, tunjangan: 500000, lembur: 160000, potongan: 75000, bersih: 5085000, status: "Draft" },
];

export const MOCK_IZIN = [
  { id: "IZ-001", nama: "Andi Wijaya", tipe: "Cuti", mulai: "2026-09-15", selesai: "2026-09-16", alasan: "Urusan keluarga", status: "Menunggu TTD" },
  { id: "IZ-002", nama: "Rudi Hartono", tipe: "Sakit", mulai: "2026-09-08", selesai: "2026-09-08", alasan: "Demam", status: "Selesai" },
  { id: "IZ-003", nama: "Eko Prasetyo", tipe: "Izin", mulai: "2026-09-12", selesai: "2026-09-12", alasan: "Ke dokter", status: "Draft" },
];

export const MOCK_LEMBUR = [
  { id: "LB-001", nama: "Andi Wijaya", tanggal: "2026-09-09", jam: 3, lokasi: "Surabaya", status: "Menunggu TTD" },
  { id: "LB-002", nama: "Eko Prasetyo", tanggal: "2026-09-07", jam: 2, lokasi: "Jember", status: "Selesai" },
];

export const MOCK_KINERJA = [
  { nama: "Andi Wijaya", cabang: "Surabaya", trxBulan: 47, avgDurasi: "18 menit", kehadiran: "95%", pemakaianBahan: "12.4 kg" },
  { nama: "Rudi Hartono", cabang: "Malang", trxBulan: 23, avgDurasi: "22 menit", kehadiran: "100%", pemakaianBahan: "6.1 kg" },
  { nama: "Eko Prasetyo", cabang: "Jember", trxBulan: 31, avgDurasi: "20 menit", kehadiran: "90%", pemakaianBahan: "8.8 kg" },
];

export const MOCK_FAKTUR_JUAL = [
  { id: "INV-2026-0088", tanggal: "2026-09-01", pelanggan: "Auto 2000 Surabaya", periode: "Agustus 2026", total: 12500000, status: "Draft" },
  { id: "INV-2026-0087", tanggal: "2026-09-01", pelanggan: "Cakrawala Malang", periode: "Agustus 2026", total: 5800000, status: "Posted" },
  { id: "INV-2026-0086", tanggal: "2026-09-01", pelanggan: "Prima Jember", periode: "Agustus 2026", total: 8200000, status: "Posted" },
];

export const MOCK_FAKTUR_BELI = [
  { id: "PINV-2026-034", tanggal: "2026-09-06", vendor: "PT Axalta Indonesia", po: "PO-2026-034", total: 8500000, status: "Posted" },
  { id: "PINV-2026-035", tanggal: "2026-09-10", vendor: "PT Nippon Paint", po: "PO-2026-035", total: 5200000, status: "Draft" },
];

export const MOCK_HUTANG_PIUTANG = [
  { pihak: "Auto 2000 Surabaya", tipe: "Piutang", total: 12500000, jatuhTempo: "2026-09-30", status: "Draft" },
  { pihak: "Cakrawala Malang", tipe: "Piutang", total: 0, jatuhTempo: "-", status: "Selesai" },
  { pihak: "PT Axalta Indonesia", tipe: "Hutang", total: 8500000, jatuhTempo: "2026-09-20", status: "Posted" },
];

export const MOCK_NERACA = {
  aktiva: [
    { akun: "Kas & Bank", saldo: 850000000 },
    { akun: "Piutang Usaha", saldo: 125000000 },
    { akun: "Persediaan", saldo: 280000000 },
  ],
  pasiva: [
    { akun: "Hutang Usaha", saldo: 45000000 },
    { akun: "Modal", saldo: 500000000 },
    { akun: "Laba Ditahan", saldo: 710000000 },
  ],
};

export const MOCK_LABA_RUGI = [
  { akun: "Pendapatan Jasa Cat", jumlah: 452000000 },
  { akun: "HPP Bahan Cat", jumlah: -180000000 },
  { akun: "Beban Operasional", jumlah: -95000000 },
  { akun: "Beban Gaji", jumlah: -45000000 },
];

export const MOCK_ARUS_KAS = {
  masuk: 8300000,
  keluar: 23500000,
  neto: 32000000,
  rows: [
    { item: "Penerimaan dari bengkel", jumlah: 8300000 },
    { item: "Pembayaran ke pabrik", jumlah: -8500000 },
    { item: "Pembayaran gaji", jumlah: -15000000 },
  ],
};

export const MOCK_GRAFIK_PENJUALAN = [
  { bulan: "Apr", penjualan: 38, penerimaan: 35 },
  { bulan: "Mei", penjualan: 42, penerimaan: 40 },
  { bulan: "Jun", penjualan: 39, penerimaan: 38 },
  { bulan: "Jul", penjualan: 45, penerimaan: 43 },
  { bulan: "Agu", penjualan: 48, penerimaan: 46 },
  { bulan: "Sep", penjualan: 26, penerimaan: 18 },
];

export const MOCK_GRAFIK_BEBAN = [
  { bulan: "Apr", hpp: 14, operasional: 8 },
  { bulan: "Mei", hpp: 15, operasional: 9 },
  { bulan: "Jun", hpp: 14, operasional: 8.5 },
  { bulan: "Jul", hpp: 16, operasional: 9.5 },
  { bulan: "Agu", hpp: 18, operasional: 10 },
  { bulan: "Sep", hpp: 9, operasional: 5 },
];

export const MOCK_RASIO_KEUANGAN = [
  { nama: "Current Ratio", rumus: "Aset Lancar / Hutang Lancar", nilai: "27.9x", benchmark: "> 1.5x", status: "Baik" },
  { nama: "Quick Ratio", rumus: "(Aset Lancar - Persediaan) / Hutang Lancar", nilai: "21.7x", benchmark: "> 1.0x", status: "Baik" },
  { nama: "Debt to Equity", rumus: "Total Hutang / Total Ekuitas", nilai: "0.04x", benchmark: "< 1.0x", status: "Baik" },
  { nama: "Gross Profit Margin", rumus: "(Pendapatan - HPP) / Pendapatan", nilai: "60.2%", benchmark: "> 40%", status: "Baik" },
  { nama: "Net Profit Margin", rumus: "Laba Bersih / Pendapatan", nilai: "28.5%", benchmark: "> 10%", status: "Baik" },
  { nama: "ROA", rumus: "Laba Bersih / Total Aktiva", nilai: "2.5%", benchmark: "> 2%", status: "Baik" },
];

export const MOCK_LABA_DITAHAN = {
  saldoAwal: 678000000,
  labaBersih: 32000000,
  dividen: 0,
  penyesuaian: 0,
  saldoAkhir: 710000000,
  mutasi: [
    { tanggal: "2026-09-01", keterangan: "Saldo awal periode", jumlah: 678000000 },
    { tanggal: "2026-09-30", keterangan: "Laba bersih September 2026", jumlah: 32000000 },
  ],
};

export const MOCK_PERUBAHAN_EKUITAS = [
  { komponen: "Modal Disetor", saldoAwal: 500000000, penambahan: 0, pengurangan: 0, saldoAkhir: 500000000 },
  { komponen: "Laba Ditahan", saldoAwal: 678000000, penambahan: 32000000, pengurangan: 0, saldoAkhir: 710000000 },
  { komponen: "Laba Tahun Berjalan", saldoAwal: 0, penambahan: 0, pengurangan: 0, saldoAkhir: 0 },
];

export const MOCK_PPN = {
  keluaran: 4520000,
  masukan: 1370000,
  neto: 3150000,
  faktur: [
    { no: "INV-2026-0087", tanggal: "2026-09-01", pihak: "Cakrawala Malang", dpp: 5225225, ppn: 522477, tipe: "Keluaran" },
    { no: "INV-2026-0086", tanggal: "2026-09-01", pihak: "Prima Jember", dpp: 7387387, ppn: 738613, tipe: "Keluaran" },
    { no: "PINV-2026-034", tanggal: "2026-09-06", pihak: "PT Axalta Indonesia", dpp: 7657658, ppn: 842342, tipe: "Masukan" },
  ],
};

export const MOCK_HISTORI_AKUN = [
  { tanggal: "2026-09-01", jurnalId: "JU/2026/09/001", keterangan: "Tagihan OPB Auto 2000 Agustus", debit: 12500000, credit: 0, saldo: 125000000 },
  { tanggal: "2026-09-05", jurnalId: "TRM/2026/09/014", keterangan: "Penerimaan transfer Cakrawala", debit: 0, credit: 5800000, saldo: 119200000 },
];

export const MOCK_KODE_WARNA = [
  { kode: "1G3", nama: "Silver Metallic", kategori: "Silver", formula: "AXT-207 + AXT-814 + AXT-811" },
  { kode: "3R1", nama: "Merah Solid", kategori: "Red", formula: "AXT-207 + AXT-501" },
  { kode: "PW2", nama: "Pearl White", kategori: "Pearl", formula: "AXT-101 + AXT-910 + AXT-911" },
  { kode: "SP9", nama: "Hitam Special", kategori: "Special", formula: "AXT-207 + AXT-203 + AXT-60" },
];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

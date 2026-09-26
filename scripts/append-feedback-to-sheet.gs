/**
 * Paste di Google Sheet: Extensions > Apps Script
 * Jalankan appendFeedbackFromWordDoc (authorize sekali).
 */
function appendFeedbackFromWordDoc() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const rows = [
  [
    21,
    "Aplikasi · Transaksi · Foto & Nota",
    "User dapat menambahkan bahan lain (button tambah bahan), kembali ke step 1 dengan data tersimpan, lalu lanjut di halaman foto & nota.",
    "",
    "Doc Aplikasi #1 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    22,
    "Aplikasi · Transaksi",
    "Format Recipe ID: RCP-DOA-CABANG X-TGL-NO PEKERJAAN.",
    "",
    "Doc Aplikasi #2 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    23,
    "Aplikasi · Transaksi · Mobil & Produk",
    "Saat pilih kategori basecoat/cat, langsung muncul list warna di kode warna. Untuk clear coat, kode warna hanya HS (360) dan MS (280).",
    "Referensi rasio Clear Coat dan Hardener based on AXT Mixing ratio (minta ke Pak Ricky foto rasio).",
    "Doc Aplikasi #3 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    24,
    "Aplikasi · Transaksi · Mobil & Produk",
    "Tambahkan kategori Clear Coat; di list produk muncul HS (360) dan MS (280).",
    "",
    "Doc Aplikasi #4 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    25,
    "Aplikasi · Transaksi · Step 1",
    "Kategori produk disamakan dengan semua kategori di nota referensi. Di field kode warna, tampilkan sub bahan berdasarkan nama bahan yang dipilih.",
    "",
    "Doc Aplikasi #5 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    26,
    "Aplikasi · Transaksi · Step 1",
    "Referensi rumus komposisi gramasi untuk Clear Coat, Surfacer, dan Primer.",
    "Minta referensi ke Pak Ricky.",
    "Doc Aplikasi #6 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    27,
    "Aplikasi · Transaksi · Step 1",
    "Untuk Thinner, kode warna diisi dengan PU (tidak perlu 5L dan 20L).",
    "",
    "Doc Aplikasi #7 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    28,
    "Aplikasi · Transaksi · Step 3",
    "Print Label Cart perlu tanggal dan jam; button print label cart juga harus bisa print beneran.",
    "",
    "Doc Aplikasi #8 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    29,
    "Aplikasi · Transaksi · Step 2",
    "Bisa tambah toner manual; user input sendiri gramasi dan toner code.",
    "",
    "Doc Aplikasi #9 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    30,
    "Aplikasi · Transaksi · Layer",
    "Hilangkan deskripsi pada layer 1 dan 2.",
    "",
    "Doc Aplikasi #10 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    31,
    "Aplikasi · Operasional (mixing ratio)",
    "Untuk Clear Coat, Surfacer, Primer: di Operasional ada mixing ratio; saat user pilih gramasi di aplikasi, mixing ratio otomatis terisi.",
    "KECUALI base coat: tidak pakai rasio; user tambah gramasi manual untuk base coat yang dipilih.",
    "Doc Aplikasi #11 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    32,
    "Aplikasi · Transaksi · Status",
    "Setelah cetak nota, status menjadi Menunggu TTD. Setelah ditandatangani, status menjadi Menunggu OPB.",
    "",
    "Doc Aplikasi #12 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    33,
    "Aplikasi · Cetak nota",
    "Template nota: row Primer/Surfacer, label 2C ganti EP 2K. Thinner isinya PU saja. Lain-lain tergantung pilihan user (Degreaser, PP Primer, atau input manual).",
    "Jika user pilih lain-lain, di step 2 mixing user tambah toner manual (nama hingga gramasi).",
    "Doc Aplikasi #13 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    34,
    "Aplikasi · Transaksi · Step 1 · Lain-lain",
    "Untuk lain-lain, user bisa input manual: Nama Sub Kategori, Kode Warna, Harga.",
    "Kode warna dan harga otomatis tersimpan di DB setelah user tambahkan.",
    "Doc Aplikasi #14 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    35,
    "Aplikasi · Transaksi",
    "Receipt ID pakai format DOA, contoh: DOA-2826-2813.",
    "",
    "Doc Aplikasi #15 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    36,
    "Aplikasi · List Transaksi",
    "Untuk status Menunggu TTD, ada button di list \"Sudah Tanda Tangan\" agar petugas verifikasi tanpa buka detail.",
    "",
    "Doc Aplikasi #16 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    37,
    "Aplikasi · Beranda",
    "Menu buka kaleng di take out.",
    "",
    "Doc Aplikasi #17 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    38,
    "Aplikasi · Stok cabang",
    "Take out button Ajukan Stok.",
    "",
    "Doc Aplikasi #18 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    39,
    "Aplikasi · Beranda · Ajukan stok",
    "Setelah user buka kaleng, kembali ke halaman sebelumnya (list kaleng cat) dengan info cat bertambah 1 kaleng dan gram bertambah (xx).",
    "",
    "Doc Aplikasi #19 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    40,
    "Aplikasi · Beranda",
    "Tambah fitur notifikasi dari admin (posisi seperti section reminder stock, di section selamat pagi).",
    "Rotasi reminder ganti setiap 10 detik; ada halaman list notifikasi; user bisa mark read agar tidak muncul lagi di beranda.",
    "Doc Aplikasi #20 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    41,
    "Aplikasi · Beranda",
    "Entry point Klaim warna di take out.",
    "",
    "Doc Aplikasi #21 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    42,
    "Aplikasi · Transaksi",
    "Fitur Tukar-Tambah Nota: pilih 1 nota dibatalkan + 1 nota sedang berjalan; nota dibatalkan digabung ke nota berjalan.",
    "Nota dibatalkan tidak mengurangi stok yang sudah keluar (stok tetap terjual); saat digabung tidak mengurangi stok inventory lagi.",
    "Doc Aplikasi #22 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    43,
    "Aplikasi · Terima barang",
    "Fitur ceklis terima barang dari distribusi (contoh DIST-2026-018): pilih ID & tanggal pengiriman, list barang, inbound + ceklis, stok masuk inventory cabang.",
    "Jika kaleng bocor/kurang, petugas timbang ulang; selisih gram tercatat di detail Terima Barang (petugas) dan detail Distribusi (admin).",
    "Doc Aplikasi #23 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "Ref: /operasional/distribusi/DIST-2026-018",
    "",
    "",
    ""
  ],
  [
    44,
    "Aplikasi · Stock opname",
    "Stock opname: jangan simpan per item; cukup 1 button simpan sticky. Di ops, tampil per ID stock opname (bukan per item).",
    "Support draft agar data tidak hilang jika app/HP tertutup tiba-tiba.",
    "Doc Aplikasi #24 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    45,
    "Website Operasional",
    "Minimum stock per cabang (tiap cabang beda). Jika stok habis, admin & petugas dapat notifikasi di app beranda (section selamat pagi); nama user pindah ke header.",
    "Stok yang diatur admin = item yang tersedia per cabang (utamanya base coat bisa beda per cabang).",
    "Doc Operasional #1 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    46,
    "Website Operasional · /operasional/transaksi",
    "Tambah kolom dan filter plat nomor.",
    "",
    "Doc Operasional #2 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    47,
    "Website Operasional · /operasional/transaksi/TRX-2026-0139",
    "Preview OPB SAP di take out. Format gambar Nota Pemakaian pakai layout /operasional/laporan-pemakaian (informasi per detail project; laporan-pemakaian tetap per bulan).",
    "",
    "Doc Operasional #3 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    48,
    "Website Operasional · /operasional/opb",
    "Status Menunggu TTD diubah teks menjadi \"Proses Invoice\". Kolom Status dihapus.",
    "",
    "Doc Operasional #4 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    49,
    "Website Operasional · Transaksi · OPB",
    "Status Menunggu OPB: saat input OPB tambahkan tanggal OPB (based on tanggal yang diinput).",
    "",
    "Doc Operasional #5 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    50,
    "Website Operasional · /operasional/rekonsiliasi",
    "Kolom stok terpakai di take out. Halaman membandingkan nota tercetak vs OPB keluar; kolom selisih hitung point B.",
    "",
    "Doc Operasional #6 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    51,
    "Website Operasional",
    "Menu /operasional/verifikasi-klaim dihapus.",
    "",
    "Doc Operasional #7 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    52,
    "Website Operasional · /operasional/po",
    "Generate dokumen PO dengan TTD Management; tambah preview dokumen di detail PO.",
    "",
    "Doc Operasional #8 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    53,
    "Website Operasional · Finance",
    "Menu PO & Penerimaan dipindah ke Finance; di detail ada generate PO, preview, download oleh Admin.",
    "",
    "Doc Operasional #9 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    54,
    "Website Operasional",
    "Bikin menu dan fitur Surat Jalan.",
    "",
    "Doc Operasional #10 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    55,
    "Website Operasional · Ajukan Stok",
    "Detail Ajukan Stok: hilangkan hyperlink PO; tampilkan ID untuk pindah ke Distribusi Cabang. Cabang buat surat jalan (relates #54).",
    "",
    "Doc Operasional #11 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    56,
    "Finance · Proses",
    "Alur Finance: OPB terbit → Finance klik Proses Invoice per cabang → cetak invoice (2 format, minta Tim Finance) → rekonsiliasi OPB → kirim invoice → update status Lunas.",
    "",
    "Doc Finance #1 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    57,
    "Finance · /finance/penjualan/faktur-penjualan",
    "Generate OPB/Faktur based on cabang + periode tanggal (user pilih dulu). Generate Faktur/Invoice + Generate Rekap (format dari Tim Finance); generate dari halaman Detail.",
    "Generate Faktur belum ada: tambah preview + button generate faktur/invoice.",
    "Doc Finance #2 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    58,
    "Finance · Menu",
    "Menu Penerimaan barang di Finance dipindah ke Ops; jika sudah ada di Ops, take out dari Finance.",
    "",
    "Doc Finance #3 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    59,
    "Finance · Surat Jalan",
    "Finance punya Surat Jalan view-only.",
    "",
    "Doc Finance #4 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ],
  [
    60,
    "Finance · Laporan",
    "Menu Rekap Pemakaian Cabang per bulan (IDR): bandingkan nilai barang diterima dari pusat vs omset nota per bulan (contoh terima 50 jt, omset 30 jt).",
    "",
    "Doc Finance #5 · Sumber: https://docs.google.com/document/d/17a9wPUo0jBuv5WH3SkB0LVp8jQPLih_R6bwOi8dRqNI",
    "",
    "",
    "",
    ""
  ]
];

  const last = sheet.getLastRow();
  if (last >= 3) {
    const maybeSection = sheet.getRange(last, 1, 1, 3).getValues()[0];
    if (!maybeSection[0] && maybeSection[1] === "Aplikasi" && maybeSection[2] === "Aplikasi") {
      sheet.deleteRow(last);
    }
  }

  const start = sheet.getLastRow() + 1;
  sheet.getRange(start, 1, rows.length, rows[0].length).setValues(rows);
  SpreadsheetApp.getUi().alert("Berhasil menambahkan " + rows.length + " baris feedback (No 21–60).");
}

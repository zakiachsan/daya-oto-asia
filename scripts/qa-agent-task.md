# QA Agent Task · Daya Oto Asia (feedback batch 21–60)

Base URL: http://localhost:3300

Kamu QA otomatis. Untuk setiap item, buka halaman, interaksi jika perlu, lalu laporkan **PASS** atau **FAIL** + alasan singkat.

## Mobile app

1. **#21–32** `/app/transaksi/baru` — Wizard: kategori Clear Coat, isi mobil+plat, Mulai Mixing, Selesai Mixing, step Foto & Nota, Receipt/DOA terlihat.
2. **#34** — Kategori Lain-lain bisa dipilih.
3. **#36** `/app/transaksi` — Tombol Sudah TTD jika ada status Menunggu TTD.
4. **#37** `/app` — Ada Buat Transaksi; tidak ada menu utama Buka Kaleng.
5. **#38** `/app/stok` — Stok cabang, search produk.
6. **#39** `/app/buka-kaleng` — Konfirmasi buka kaleng (opsional, hati-hati mutasi stok).
7. **#40** `/app/notifikasi` — Notifikasi admin.
8. **#41** `/app/stock-opname` — Tombol Simpan sticky terlihat.
9. **#42** `/app/tukar-nota` — Form Tukar-Tambah Nota.
10. **#43** `/app/terima-barang` — Checklist terima barang.
11. **#44** `/app/klaim-nota` — Halaman klaim.
12. **#55** `/app/ajukan-stok` — List ajuan.

## Operasional

13. **#46** `/operasional/transaksi` — Kolom Plat.
14. **#47** — Buka satu detail transaksi; tidak ada field SAP OPB.
15. **#48–49** `/operasional/opb` — Kartu Proses Invoice; buka detail OPB.
16. **#50** `/operasional/rekonsiliasi` — Tab Ringkasan, Detail OPB, Deteksi Leakage.
17. **#51** `/modules` — Tidak ada verifikasi-klaim.
18. **#52** `/operasional/po` — List/detail PO.
19. **#53** `/operasional/ajuan-stok` — Detail ajuan + distribusi ID.
20. **#54** `/operasional/surat-jalan` — List/detail SJ.

## Finance

21. **#56** `/finance/penjualan/proses-invoice` — Pipeline proses invoice.
22. **#57** `/finance/penjualan/faktur-penjualan` — Panel Batch Cabang + Periode.
23. **#58** `/finance/pembelian/po` — Redirect ke operasional PO.
24. **#59** `/finance/surat-jalan` — View only.
25. **#60** `/finance/laporan/rekap-pemakaian-cabang` — Rekap pemakaian.

Akhiri dengan tabel ringkas PASS/FAIL per nomor feedback.

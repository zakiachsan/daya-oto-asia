export type StokChainStep = {
  id: string;
  label: string;
  desc: string;
  href: string;
  status: "done" | "active" | "pending" | "alert";
};

/** Contoh alur end-to-end stok untuk demo Silver Metallic Surabaya */
export const DEMO_STOK_CHAIN: StokChainStep[] = [
  {
    id: "trx",
    label: "Transaksi Mixing",
    desc: "TRX-2026-0142 · Silver Metallic · -45gr",
    href: "/operasional/transaksi/TRX-2026-0142",
    status: "done",
  },
  {
    id: "stok",
    label: "Stok Cabang Berkurang",
    desc: "Sistem: 420gr → 375gr setelah mixing",
    href: "/operasional/inventori",
    status: "done",
  },
  {
    id: "opname",
    label: "Stock Opname",
    desc: "SO-2026-035 · fisik 380gr · selisih -40gr",
    href: "/operasional/stock-opname/SO-2026-035",
    status: "alert",
  },
  {
    id: "adj",
    label: "Penyesuaian Stok",
    desc: "ADJ-2026-012 · auto-jurnal Rp 250.000",
    href: "/finance/penyesuaian-stok/adj-2026-012",
    status: "done",
  },
  {
    id: "ajuan",
    label: "Ajuan Restock",
    desc: "AJ-001 · Toner HS-30 · menunggu approval",
    href: "/operasional/ajuan-stok/AJ-001",
    status: "active",
  },
  {
    id: "po",
    label: "PO / Distribusi",
    desc: "PO-2026-034 → GR → stok cabang terisi",
    href: "/operasional/po/PO-2026-034",
    status: "pending",
  },
];

export const DEMO_CHECKLIST = [
  { id: "d1", group: "Mobile Tinter", label: "Buat transaksi baru (YATU wizard + cetak nota)", href: "/app/transaksi/baru" },
  { id: "d2", group: "Mobile Tinter", label: "Ajukan stok + cek status ajuan", href: "/app/ajukan-stok" },
  { id: "d3", group: "Operasional", label: "Monitoring transaksi → detail OPB linked", href: "/operasional/transaksi" },
  { id: "d4", group: "Operasional", label: "Stock opname selisih → approve/flag supervisor", href: "/operasional/stock-opname" },
  { id: "d5", group: "Operasional", label: "Ajuan stok approve → PO terbentuk", href: "/operasional/ajuan-stok" },
  { id: "d6", group: "Finance", label: "Penyesuaian stok → jurnal otomatis", href: "/finance/penyesuaian-stok" },
  { id: "d7", group: "Finance", label: "Faktur penjualan → hutang/piutang", href: "/finance/faktur-penjualan" },
  { id: "d8", group: "HRIS", label: "Izin/lembur mobile → approval HR", href: "/hris/izin" },
  { id: "d9", group: "HRIS", label: "Kinerja tinter → drill-down transaksi", href: "/hris/kinerja" },
  { id: "d10", group: "Operasional", label: "Alur stok end-to-end (halaman ini)", href: "/operasional/monitoring" },
];

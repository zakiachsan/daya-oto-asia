/** Struktur baris nota penjualan — referensi scan `nota penjualan.pdf` */

export type NotaPenjualanBaris = {
  id: string;
  label: string;
  harga: number;
  /** Kategori transaksi yang map ke baris ini */
  kategoriKeys?: string[];
};

export type NotaPenjualanGrup = {
  judul: string;
  baris: NotaPenjualanBaris[];
};

/** Form terisi tinter — berbeda dari nota pemakaian (pre-print tarif penuh) */
export const NOTA_PENJUALAN_GRUP: NotaPenjualanGrup[] = [
  {
    judul: "BASE COAT",
    baris: [
      { id: "bc-standard", label: "A. STANDARD", harga: 190000, kategoriKeys: ["Standard"] },
      { id: "bc-red", label: "B. RED", harga: 210000, kategoriKeys: ["Red"] },
      { id: "bc-yellow", label: "C. YELLOW", harga: 210000, kategoriKeys: ["Yellow"] },
      { id: "bc-xyralic", label: "D. XYRALIC", harga: 320000, kategoriKeys: ["Xyralic"] },
      { id: "bc-pearl", label: "E. PEARL", harga: 230000, kategoriKeys: ["Pearl"] },
      { id: "bc-special", label: "F. SPECIAL", harga: 210000, kategoriKeys: ["Special", "Silver"] },
    ],
  },
  {
    judul: "CLEAR COAT",
    baris: [
      { id: "cc-hs", label: "A. HS (360) (set)", harga: 147000 },
      { id: "cc-ms", label: "B. MS (280) (set)", harga: 115000 },
    ],
  },
  {
    judul: "PRIMER / SURFACER",
    baris: [
      { id: "sf-pu", label: "A. PU 2K GREY", harga: 110000 },
      { id: "sf-filler", label: "B. 2C HS. Filler", harga: 110000 },
      { id: "sf-pp", label: "C. PP Primer", harga: 115000 },
    ],
  },
  {
    judul: "THINNER",
    baris: [
      { id: "th-xs", label: "A. Extra Slow Dry", harga: 60000 },
      { id: "th-s", label: "B. Slow Dry", harga: 60000 },
      { id: "th-f", label: "C. Fast Dry", harga: 45000 },
    ],
  },
  {
    judul: "PUTTY / DEMPUL",
    baris: [{ id: "pt-dempul", label: "A. Dempul + Hardener", harga: 90000 }],
  },
  {
    judul: "LAIN-LAIN",
    baris: [{ id: "ll-cleaner", label: "A. Waterborne Cleaner", harga: 53000 }],
  },
];

export function formatNotaPenjualanHarga(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatNotaPenjualanTanggal(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${Number(d)}-${Number(m)}-${y.slice(-2)}`;
}

export function notaPenjualanNoFromTrxId(trxId: string) {
  const digits = trxId.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return digits;
}

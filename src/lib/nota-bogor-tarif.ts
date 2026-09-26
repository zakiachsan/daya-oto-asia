/** Tarif & struktur tabel nota DOA Cabang Bogor · hal. 1 PDF referensi */

export type NotaTarifItem = {
  label: string;
  harga: number;
  satuan: "L" | "Kg";
};

export type NotaTarifGrup = {
  judul: string;
  baris: NotaTarifItem[];
};

export const NOTA_TARIF_BOGOR: NotaTarifGrup[] = [
  {
    judul: "BASE COAT",
    baris: [
      { label: "Standard", harga: 190000, satuan: "L" },
      { label: "Red", harga: 210000, satuan: "L" },
      { label: "Yellow", harga: 210000, satuan: "L" },
      { label: "Special", harga: 210000, satuan: "L" },
      { label: "Pearl", harga: 230000, satuan: "L" },
      { label: "Xyralic", harga: 325000, satuan: "L" },
    ],
  },
  {
    judul: "CLEAR COAT",
    baris: [
      { label: "Clear Coat HS (360) 2:1", harga: 147000, satuan: "L" },
      { label: "Clear Coat MS (280) 4:1", harga: 115000, satuan: "L" },
    ],
  },
  {
    judul: "SURFACER",
    baris: [
      { label: "EP 2K Primer Surfacer + Hardener", harga: 110000, satuan: "L" },
      { label: "EP 2K Surfacer Filler + Hardener", harga: 110000, satuan: "L" },
      { label: "PP Primer", harga: 115000, satuan: "L" },
    ],
  },
  {
    judul: "THINER",
    baris: [
      { label: "Extra Slow Dry", harga: 60000, satuan: "L" },
      { label: "Slow Dry", harga: 60000, satuan: "L" },
      { label: "Fast Dry", harga: 45000, satuan: "L" },
    ],
  },
  {
    judul: "PUTTY",
    baris: [
      { label: "Dempul + Hardener", harga: 90000, satuan: "Kg" },
    ],
  },
  {
    judul: "Lain-Lain",
    baris: [
      { label: "Silicon Degreaser", harga: 53000, satuan: "L" },
    ],
  },
];

/** Format harga seperti formulir: Rp 190.000/L */
export function formatHargaNota(harga: number, satuan: "L" | "Kg") {
  const formatted = harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}/${satuan}`;
}

export function formatRpJumlah(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function hargaBaseCoatPerLiter(kategori: string): number {
  const map: Record<string, number> = {
    Standard: 190000,
    Red: 210000,
    Yellow: 210000,
    Special: 210000,
    Silver: 210000,
    Pearl: 230000,
    Xyralic: 325000,
  };
  return map[kategori] ?? 190000;
}

/** Baris tarif BASE COAT yang dipakai untuk kategori transaksi */
export function tarifRowForKategori(kategori: string): { grup: string; label: string; harga: number; satuan: "L" | "Kg" } {
  const target = hargaBaseCoatPerLiter(kategori);
  const base = NOTA_TARIF_BOGOR.find((g) => g.judul === "BASE COAT");
  const labelAlias: Record<string, string> = { Silver: "Special" };
  const prefer = labelAlias[kategori] ?? kategori;
  const match =
    base?.baris.find((b) => b.label === prefer) ??
    base?.baris.find((b) => b.harga === target) ??
    base?.baris[0];
  return {
    grup: "BASE COAT",
    label: match?.label ?? "Standard",
    harga: match?.harga ?? 190000,
    satuan: match?.satuan ?? "L",
  };
}

export function notaNoFromTrxId(trxId: string) {
  return trxId.replace(/^DOA-/, "").replace(/^TRX-/, "");
}

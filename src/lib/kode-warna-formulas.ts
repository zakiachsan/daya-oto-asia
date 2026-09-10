/** Resep mixing per kode warna — base volume 50G (referensi YATU) */
export type FormulaDef = {
  kodeWarna: string;
  nama: string;
  kategori: string;
  recipeId: string;
  baseVolume: number;
  items: { kode: string; gram: number }[];
};

export const FORMULA_WARNA: FormulaDef[] = [
  {
    kodeWarna: "1G3",
    nama: "Silver Metallic",
    kategori: "Silver",
    recipeId: "RCP-1G3-50G",
    baseVolume: 50,
    items: [
      { kode: "AXT-207", gram: 8 },
      { kode: "AXT-814", gram: 35 },
      { kode: "AXT-811", gram: 7 },
    ],
  },
  {
    kodeWarna: "3R1",
    nama: "Merah Solid",
    kategori: "Red",
    recipeId: "RCP-3R1-50G",
    baseVolume: 50,
    items: [
      { kode: "AXT-207", gram: 12 },
      { kode: "AXT-501", gram: 38 },
    ],
  },
  {
    kodeWarna: "PW2",
    nama: "Pearl White",
    kategori: "Pearl",
    recipeId: "RCP-PW2-50G",
    baseVolume: 50,
    items: [
      { kode: "AXT-101", gram: 15 },
      { kode: "AXT-910", gram: 30 },
      { kode: "AXT-911", gram: 5 },
    ],
  },
  {
    kodeWarna: "SP9",
    nama: "Hitam Special",
    kategori: "Special",
    recipeId: "RCP-SP9-50G",
    baseVolume: 50,
    items: [
      { kode: "AXT-207", gram: 40 },
      { kode: "AXT-203", gram: 8 },
      { kode: "AXT-60", gram: 2 },
    ],
  },
];

export function findFormula(kodeOrNama: string): FormulaDef | undefined {
  const q = kodeOrNama.trim().toLowerCase();
  return FORMULA_WARNA.find(
    (f) => f.kodeWarna.toLowerCase() === q || f.nama.toLowerCase() === q || f.nama.toLowerCase().includes(q)
  );
}

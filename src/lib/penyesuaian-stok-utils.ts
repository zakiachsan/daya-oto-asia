export type PenyesuaianLine = {
  kode: string;
  produk: string;
  selisihGram: number;
  nilai: number;
};

export type PenyesuaianDetail = {
  id: string;
  tanggal: string;
  cabang: string;
  alasan: string;
  nilai: number;
  status: "Posted" | "Draft";
  refOpname?: string;
  jurnalId?: string;
  lines: PenyesuaianLine[];
};

export const INITIAL_PENYESUAIAN: PenyesuaianDetail[] = [
  {
    id: "ADJ-2026-012",
    tanggal: "2026-09-08",
    cabang: "Surabaya",
    alasan: "Stock opname selisih -40gr Silver",
    nilai: 250000,
    status: "Posted",
    refOpname: "SO-2026-035",
    jurnalId: "JU/2026/09/003",
    lines: [
      { kode: "AXT-814", produk: "Silver Metallic", selisihGram: -40, nilai: 250000 },
    ],
  },
  {
    id: "ADJ-2026-011",
    tanggal: "2026-09-06",
    cabang: "Malang",
    alasan: "Stock opname selisih -2gr Clear Coat",
    nilai: 15000,
    status: "Posted",
    refOpname: "SO-2026-036",
    lines: [
      { kode: "AXT-101", produk: "Clear Coat CC-100", selisihGram: -2, nilai: 15000 },
    ],
  },
];

export function penyesuaianSlug(id: string) {
  return id.toLowerCase();
}

export function penyesuaianFromSlug(slug: string) {
  return slug.toUpperCase();
}

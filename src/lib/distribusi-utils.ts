import { MOCK_DISTRIBUSI, MOCK_PRODUK } from "./mock-data";

export type DistLine = { kode: string; nama: string; qty: number };

export type DistribusiDetail = {
  id: string;
  tanggal: string;
  dari: string;
  ke: string;
  items: number;
  status: string;
  driver?: string;
  waktuKirim?: string;
  waktuTerima?: string;
  lines: DistLine[];
};

function distLine(kode: string, qty: number): DistLine {
  const p = MOCK_PRODUK.find((x) => x.kode === kode);
  return { kode, nama: p?.nama ?? kode, qty };
}

export const INITIAL_DISTRIBUSI: DistribusiDetail[] = [
  {
    ...MOCK_DISTRIBUSI[0],
    driver: "Budi Kurir",
    waktuKirim: "2026-09-07T08:00:00",
    waktuTerima: "2026-09-07T14:30:00",
    lines: [
      distLine("AXT-207", 10),
      distLine("AXT-814", 8),
      distLine("AXT-910", 6),
    ],
  },
  {
    ...MOCK_DISTRIBUSI[1],
    driver: "Agus Logistik",
    waktuKirim: "2026-09-08T07:30:00",
    waktuTerima: "2026-09-08T16:00:00",
    lines: [
      distLine("AXT-207", 6),
      distLine("AXT-101", 4),
      distLine("AXT-814", 2),
    ],
  },
  {
    ...MOCK_DISTRIBUSI[2],
    driver: "—",
    lines: [
      distLine("AXT-207", 8),
      distLine("AXT-910", 10),
    ],
  },
];

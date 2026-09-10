export type HutangPiutangLine = {
  ref: string;
  tanggal: string;
  keterangan: string;
  jumlah: number;
};

export type HutangPiutangDetail = {
  id: string;
  pihak: string;
  tipe: "Piutang" | "Hutang";
  total: number;
  sisa: number;
  jatuhTempo: string;
  status: string;
  refFaktur?: string;
  lines: HutangPiutangLine[];
};

export const INITIAL_HUTANG_PIUTANG: HutangPiutangDetail[] = [
  {
    id: "HP-001",
    pihak: "Auto 2000 Surabaya",
    tipe: "Piutang",
    total: 12500000,
    sisa: 12500000,
    jatuhTempo: "2026-09-30",
    status: "Draft",
    refFaktur: "INV-2026-0088",
    lines: [
      { ref: "INV-2026-0088", tanggal: "2026-09-01", keterangan: "Tagihan OPB Agustus 2026", jumlah: 12500000 },
    ],
  },
  {
    id: "HP-002",
    pihak: "Cakrawala Malang",
    tipe: "Piutang",
    total: 5800000,
    sisa: 0,
    jatuhTempo: "—",
    status: "Selesai",
    refFaktur: "INV-2026-0087",
    lines: [
      { ref: "INV-2026-0087", tanggal: "2026-09-01", keterangan: "Tagihan OPB Agustus 2026", jumlah: 5800000 },
      { ref: "PAY-2026-014", tanggal: "2026-09-05", keterangan: "Pembayaran transfer", jumlah: -5800000 },
    ],
  },
  {
    id: "HP-003",
    pihak: "PT Axalta Indonesia",
    tipe: "Hutang",
    total: 8500000,
    sisa: 8500000,
    jatuhTempo: "2026-09-20",
    status: "Posted",
    refFaktur: "PINV-2026-034",
    lines: [
      { ref: "PINV-2026-034", tanggal: "2026-09-06", keterangan: "Faktur pembelian PO-2026-034", jumlah: 8500000 },
    ],
  },
];

export function hutangSlug(pihak: string) {
  return pihak
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

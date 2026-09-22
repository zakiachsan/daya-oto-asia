import type { FakturBeliRow } from "./faktur-beli-utils";
import type { FakturJualRow } from "./faktur-utils";
import type { HutangPiutangDetail, HutangPiutangLine } from "./hutang-piutang-utils";

export type FinancePaymentRow = {
  id: string;
  tanggal: string;
  tipe: "Penerimaan" | "Pembayaran";
  refFaktur: string;
  pihak: string;
  jumlah: number;
  akun: string;
  keterangan: string;
  jurnalId: string;
  hutangId: string;
};

export function nextPaymentId(tipe: FinancePaymentRow["tipe"], seq: number) {
  const prefix = tipe === "Penerimaan" ? "TRM" : "BYR";
  return `${prefix}/2026/09/${String(seq).padStart(3, "0")}`;
}

export function piutangForFaktur(items: HutangPiutangDetail[], faktur: FakturJualRow) {
  return items.find((h) => h.tipe === "Piutang" && (h.refFaktur === faktur.id || h.pihak === faktur.pelanggan));
}

export function hutangForFakturBeli(items: HutangPiutangDetail[], faktur: FakturBeliRow) {
  return items.find((h) => h.tipe === "Hutang" && (h.refFaktur === faktur.id || h.pihak === faktur.vendor));
}

export function ensurePiutangFromFaktur(
  items: HutangPiutangDetail[],
  faktur: FakturJualRow,
): HutangPiutangDetail[] {
  if (piutangForFaktur(items, faktur)) return items;
  const row: HutangPiutangDetail = {
    id: `HP-${String(items.length + 1).padStart(3, "0")}`,
    pihak: faktur.pelanggan,
    tipe: "Piutang",
    total: faktur.total,
    sisa: faktur.total,
    jatuhTempo: "2026-09-30",
    status: "Posted",
    refFaktur: faktur.id,
    lines: [
      {
        ref: faktur.id,
        tanggal: faktur.tanggal,
        keterangan: `Tagihan OPB ${faktur.periode}`,
        jumlah: faktur.total,
      },
    ],
  };
  return [row, ...items];
}

export function ensureHutangFromFakturBeli(
  items: HutangPiutangDetail[],
  faktur: FakturBeliRow,
): HutangPiutangDetail[] {
  if (hutangForFakturBeli(items, faktur)) return items;
  const row: HutangPiutangDetail = {
    id: `HP-${String(items.length + 1).padStart(3, "0")}`,
    pihak: faktur.vendor,
    tipe: "Hutang",
    total: faktur.total,
    sisa: faktur.total,
    jatuhTempo: "2026-09-30",
    status: "Posted",
    refFaktur: faktur.id,
    lines: [
      {
        ref: faktur.id,
        tanggal: faktur.tanggal,
        keterangan: `Faktur pembelian ${faktur.po}`,
        jumlah: faktur.total,
      },
    ],
  };
  return [row, ...items];
}

export function applyPaymentToHutang(
  hp: HutangPiutangDetail,
  payment: Pick<FinancePaymentRow, "id" | "tanggal" | "jumlah" | "keterangan">,
): HutangPiutangDetail {
  const line: HutangPiutangLine = {
    ref: payment.id,
    tanggal: payment.tanggal,
    keterangan: payment.keterangan,
    jumlah: -payment.jumlah,
  };
  const sisa = Math.max(0, hp.sisa - payment.jumlah);
  return {
    ...hp,
    sisa,
    status: sisa === 0 ? "Selesai" : hp.status,
    jatuhTempo: sisa === 0 ? "-" : hp.jatuhTempo,
    lines: [...hp.lines, line],
  };
}

export { buildPenerimaanJurnal, buildPembayaranJurnal } from "./jurnal-builders";
export { nextJurnalId, allocateJurnalId } from "./jurnal-utils";
export { postWithJurnal } from "./jurnal-post-utils";

import type { FakturBeliRow } from "./faktur-beli-utils";
import type { FakturJualRow } from "./faktur-utils";
import type { FinancePaymentRow } from "./finance-payment-utils";
import type { PenyesuaianDetail } from "./penyesuaian-stok-utils";
import type { TransferBankRow } from "./finance-master-data";
import { accountName, type JurnalDetail, type JurnalSourceType } from "./jurnal-utils";

export const COA = {
  KAS: "110101",
  BANK: "110201",
  PIUTANG: "110301",
  PERSEDIAAN: "130101",
  HUTANG: "210101",
  PENDAPATAN: "410101",
  HPP: "510101",
} as const;

function kasKode(akun: string) {
  return akun.toLowerCase().includes("bank") ? COA.BANK : COA.KAS;
}

function jurnalHeader(
  id: string,
  tanggal: string,
  keterangan: string,
  amount: number,
  sourceType: JurnalSourceType,
  refs?: Partial<Pick<JurnalDetail, "refOpb" | "refFaktur" | "refAdj" | "refPayment">>,
): Omit<JurnalDetail, "lines"> {
  return {
    id,
    tanggal,
    keterangan,
    debit: amount,
    kredit: amount,
    status: "Posted",
    sourceType,
    ...refs,
  };
}

export function buildFakturJualJurnal(faktur: FakturJualRow, jurnalId: string): JurnalDetail {
  const amount = faktur.total;
  return {
    ...jurnalHeader(
      jurnalId,
      faktur.tanggal,
      `Faktur penjualan ${faktur.id} - ${faktur.pelanggan}`,
      amount,
      "faktur-jual",
      { refFaktur: faktur.id, refOpb: faktur.opbId },
    ),
    lines: [
      { accountKode: COA.PIUTANG, accountNama: accountName(COA.PIUTANG), debit: amount, credit: 0 },
      { accountKode: COA.PENDAPATAN, accountNama: accountName(COA.PENDAPATAN), debit: 0, credit: amount },
    ],
  };
}

export function buildFakturBeliJurnal(faktur: FakturBeliRow, jurnalId: string): JurnalDetail {
  const amount = faktur.total;
  return {
    ...jurnalHeader(
      jurnalId,
      faktur.tanggal,
      `Faktur pembelian ${faktur.id} - ${faktur.vendor}`,
      amount,
      "faktur-beli",
      { refFaktur: faktur.id },
    ),
    lines: [
      { accountKode: COA.PERSEDIAAN, accountNama: accountName(COA.PERSEDIAAN), debit: amount, credit: 0 },
      { accountKode: COA.HUTANG, accountNama: accountName(COA.HUTANG), debit: 0, credit: amount },
    ],
  };
}

export function buildPenerimaanJurnal(payment: FinancePaymentRow, jurnalId: string): JurnalDetail {
  const kas = kasKode(payment.akun);
  const amount = payment.jumlah;
  return {
    ...jurnalHeader(
      jurnalId,
      payment.tanggal,
      `Penerimaan penjualan ${payment.refFaktur} - ${payment.pihak}`,
      amount,
      "penerimaan-penjualan",
      { refFaktur: payment.refFaktur, refPayment: payment.id },
    ),
    lines: [
      { accountKode: kas, accountNama: accountName(kas), debit: amount, credit: 0 },
      { accountKode: COA.PIUTANG, accountNama: accountName(COA.PIUTANG), debit: 0, credit: amount },
    ],
  };
}

export function buildPembayaranJurnal(payment: FinancePaymentRow, jurnalId: string): JurnalDetail {
  const kas = kasKode(payment.akun);
  const amount = payment.jumlah;
  return {
    ...jurnalHeader(
      jurnalId,
      payment.tanggal,
      `Pembayaran pembelian ${payment.refFaktur} - ${payment.pihak}`,
      amount,
      "pembayaran-pembelian",
      { refFaktur: payment.refFaktur, refPayment: payment.id },
    ),
    lines: [
      { accountKode: COA.HUTANG, accountNama: accountName(COA.HUTANG), debit: amount, credit: 0 },
      { accountKode: kas, accountNama: accountName(kas), debit: 0, credit: amount },
    ],
  };
}

export function buildPenyesuaianJurnal(adj: PenyesuaianDetail, jurnalId: string): JurnalDetail {
  const amount = adj.nilai;
  const netGram = adj.lines.reduce((s, l) => s + l.selisihGram, 0);
  const shortage = netGram <= 0;

  const lines = shortage
    ? [
        { accountKode: COA.HPP, accountNama: accountName(COA.HPP), debit: amount, credit: 0 },
        { accountKode: COA.PERSEDIAAN, accountNama: accountName(COA.PERSEDIAAN), debit: 0, credit: amount },
      ]
    : [
        { accountKode: COA.PERSEDIAAN, accountNama: accountName(COA.PERSEDIAAN), debit: amount, credit: 0 },
        { accountKode: COA.HPP, accountNama: accountName(COA.HPP), debit: 0, credit: amount },
      ];

  return {
    ...jurnalHeader(
      jurnalId,
      adj.tanggal,
      `Penyesuaian persediaan ${adj.id} - ${adj.cabang}`,
      amount,
      "penyesuaian-stok",
      { refAdj: adj.id },
    ),
    lines,
  };
}

export type KasVoucherRow = {
  id: string;
  tanggal: string;
  tipe: "Penerimaan" | "Pembayaran";
  akun: string;
  keterangan: string;
  jumlah: number;
  jurnalId?: string;
};

export function buildKasPenerimaanJurnal(voucher: KasVoucherRow, jurnalId: string): JurnalDetail {
  const kas = kasKode(voucher.akun);
  const amount = Math.abs(voucher.jumlah);
  return {
    ...jurnalHeader(
      jurnalId,
      voucher.tanggal,
      voucher.keterangan,
      amount,
      "kas-penerimaan",
      { refPayment: voucher.id },
    ),
    lines: [
      { accountKode: kas, accountNama: accountName(kas), debit: amount, credit: 0 },
      { accountKode: COA.PENDAPATAN, accountNama: accountName(COA.PENDAPATAN), debit: 0, credit: amount },
    ],
  };
}

export function buildKasPembayaranJurnal(voucher: KasVoucherRow, jurnalId: string): JurnalDetail {
  const kas = kasKode(voucher.akun);
  const amount = Math.abs(voucher.jumlah);
  return {
    ...jurnalHeader(
      jurnalId,
      voucher.tanggal,
      voucher.keterangan,
      amount,
      "kas-pembayaran",
      { refPayment: voucher.id },
    ),
    lines: [
      { accountKode: COA.HPP, accountNama: accountName(COA.HPP), debit: amount, credit: 0 },
      { accountKode: kas, accountNama: accountName(kas), debit: 0, credit: amount },
    ],
  };
}

export function buildTransferBankJurnal(transfer: TransferBankRow, jurnalId: string): JurnalDetail {
  const amount = transfer.jumlah;
  const dari = kasKode(transfer.dari);
  const ke = kasKode(transfer.ke);
  return {
    ...jurnalHeader(
      jurnalId,
      transfer.tanggal,
      `Transfer ${transfer.dari} → ${transfer.ke} — ${transfer.keterangan}`,
      amount,
      "transfer-bank",
      { refPayment: transfer.id },
    ),
    lines: [
      { accountKode: ke, accountNama: accountName(ke), debit: amount, credit: 0 },
      { accountKode: dari, accountNama: accountName(dari), debit: 0, credit: amount },
    ],
  };
}

type BuilderFn = (source: unknown, jurnalId: string) => JurnalDetail;

export const JURNAL_BUILDERS: Record<JurnalSourceType, BuilderFn> = {
  "faktur-jual": (s, id) => buildFakturJualJurnal(s as FakturJualRow, id),
  "faktur-beli": (s, id) => buildFakturBeliJurnal(s as FakturBeliRow, id),
  "penerimaan-penjualan": (s, id) => buildPenerimaanJurnal(s as FinancePaymentRow, id),
  "pembayaran-pembelian": (s, id) => buildPembayaranJurnal(s as FinancePaymentRow, id),
  "penyesuaian-stok": (s, id) => buildPenyesuaianJurnal(s as PenyesuaianDetail, id),
  "kas-penerimaan": (s, id) => buildKasPenerimaanJurnal(s as KasVoucherRow, id),
  "kas-pembayaran": (s, id) => buildKasPembayaranJurnal(s as KasVoucherRow, id),
  "transfer-bank": (s, id) => buildTransferBankJurnal(s as TransferBankRow, id),
  "jurnal-manual": (s, id) => s as JurnalDetail,
};

export function buildJurnal(type: JurnalSourceType, source: unknown, jurnalId: string): JurnalDetail {
  return JURNAL_BUILDERS[type](source, jurnalId);
}

import type { FakturBeliRow } from "./faktur-beli-utils";
import type { FakturJualRow } from "./faktur-utils";
import type { FinancePaymentRow } from "./finance-payment-utils";
import { hutangForFakturBeli, piutangForFaktur } from "./finance-payment-utils";
import type { HutangPiutangDetail } from "./hutang-piutang-utils";
import type { PenyesuaianDetail } from "./penyesuaian-stok-utils";
import type { PoDetail } from "./po-utils";
import type { StockOpnameRow } from "./stock-opname-utils";

export type FinanceLinkStatus =
  | "none"
  | "draft"
  | "posted"
  | "partial"
  | "paid";

const NILAI_PER_GRAM = 6250;

export function fakturJualForOpb(opbId: string, faktur: FakturJualRow[]) {
  return faktur.find((f) => f.opbId === opbId);
}

export function fakturBeliForPo(poId: string, faktur: FakturBeliRow[]) {
  return faktur.find((f) => f.po === poId);
}

export function penyesuaianForOpname(opnameId: string, items: PenyesuaianDetail[]) {
  return items.find((p) => p.refOpname === opnameId);
}

export function estimateNilaiSelisih(selisihGram: number) {
  return Math.max(NILAI_PER_GRAM, Math.abs(selisihGram) * NILAI_PER_GRAM);
}

function kodeFromProduk(produk: string) {
  if (produk.includes("Silver")) return "AXT-814";
  if (produk.includes("Clear")) return "AXT-101";
  if (produk.includes("Toner")) return "AXT-207";
  return "AXT-000";
}

export function buildPenyesuaianFromOpname(opname: StockOpnameRow, seq: number): PenyesuaianDetail {
  const nilai = estimateNilaiSelisih(opname.selisih);
  return {
    id: `ADJ-2026-${String(13 + seq).padStart(3, "0")}`,
    tanggal: new Date().toISOString().slice(0, 10),
    cabang: opname.cabang,
    alasan: `Stock opname selisih ${opname.selisih}gr ${opname.produk}`,
    nilai,
    status: "Draft",
    refOpname: opname.id,
    lines: [
      {
        kode: kodeFromProduk(opname.produk),
        produk: opname.produk,
        selisihGram: opname.selisih,
        nilai,
      },
    ],
  };
}

export function buildFakturBeliFromPo(po: PoDetail, seq: number): FakturBeliRow {
  return {
    id: `PINV-2026-${String(36 + seq).padStart(3, "0")}`,
    tanggal: new Date().toISOString().slice(0, 10),
    vendor: po.supplier,
    po: po.id,
    total: po.total,
    status: "Draft",
  };
}

export function getOpbFinanceStatus(
  opbId: string,
  fakturJual: FakturJualRow[],
  hutang: HutangPiutangDetail[],
): FinanceLinkStatus {
  const faktur = fakturJualForOpb(opbId, fakturJual);
  if (!faktur) return "none";
  if (faktur.status === "Draft") return "draft";
  const hp = piutangForFaktur(hutang, faktur);
  if (!hp) return "posted";
  if (hp.sisa === 0) return "paid";
  if (hp.sisa < hp.total) return "partial";
  return "posted";
}

export function getPoFinanceStatus(
  poId: string,
  fakturBeli: FakturBeliRow[],
  hutang: HutangPiutangDetail[],
  payments: FinancePaymentRow[],
): FinanceLinkStatus {
  const faktur = fakturBeliForPo(poId, fakturBeli);
  if (!faktur) return "none";
  if (faktur.status === "Draft") return "draft";
  const hp = hutangForFakturBeli(hutang, faktur);
  const paid = payments
    .filter((p) => p.tipe === "Pembayaran" && p.refFaktur === faktur.id)
    .reduce((s, p) => s + p.jumlah, 0);
  if (hp?.sisa === 0 || paid >= faktur.total) return "paid";
  if (paid > 0 || (hp && hp.sisa < hp.total)) return "partial";
  return "posted";
}

export const FINANCE_STATUS_LABELS: Record<FinanceLinkStatus, string> = {
  none: "Belum difakturkan",
  draft: "Faktur draft",
  posted: "Sudah difakturkan",
  partial: "Bayar sebagian",
  paid: "Lunas",
};

export const FINANCE_STATUS_CLASS: Record<FinanceLinkStatus, string> = {
  none: "bg-slds-bg text-slds-text-weak",
  draft: "bg-amber-50 text-amber-700",
  posted: "bg-blue-50 text-blue-700",
  partial: "bg-orange-50 text-orange-700",
  paid: "bg-green-50 text-green-700",
};

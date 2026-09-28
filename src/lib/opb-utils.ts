import type { FakturJualRow } from "./faktur-utils";
import type { OpbRow, TransaksiRow } from "./mock-data";

/** Transaksi yang masuk OPB · by opbId atau cabang+selesai */
export function getOpbTransaksi(opb: OpbRow, transaksi: TransaksiRow[]) {
  const byId = transaksi.filter((t) => t.opbId === opb.id);
  if (byId.length > 0) return byId;

  const cabangKey = opb.cabang.split(" ")[0];
  return transaksi.filter((t) => t.status === "Selesai" && t.cabang.includes(cabangKey));
}

/** Tanggal OPB (ISO) → tampilan singkat · mis. "2026-09-26" → "26 Sep 2026" */
export function formatTanggalOpb(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Label tampilan status OPB · "Menunggu TTD" ditampilkan sebagai "Proses Invoice"
 * (feedback #27: dari sisi Ops, tahap berikutnya adalah Finance memproses invoice).
 */
export function opbStatusLabel(status: string) {
  return status === "Menunggu TTD" ? "Proses Invoice" : status;
}

/** Nomor OPB berikutnya · OPB-2026-0xxx (anti-tabrakan walau ada baris yang dihapus) */
export function nextOpbId(items: OpbRow[]) {
  const max = items.reduce((m, o) => {
    const n = Number(o.id.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `OPB-2026-${String(max + 1).padStart(4, "0")}`;
}

/** OPB sudah terbit (punya tanggal OPB & lewat tahap Draft) tapi belum difakturkan */
export function opbSiapInvoice(opb: OpbRow, fakturJual: FakturJualRow[]) {
  if (!opb.tanggalOpb || opb.status === "Draft") return false;
  return !fakturJual.some((f) => f.opbId === opb.id);
}

export const OPB_PIPELINE = [
  { status: "Draft", label: "Draft OPB", desc: "OPB digenerate dari transaksi selesai" },
  { status: "Menunggu TTD", label: "TTD Admin Cabang", desc: "Dikirim ke admin cabang via DocuMatrix" },
  { status: "Rekonsiliasi", label: "Rekonsiliasi HO", desc: "Supervisor cocokkan OPB vs nota vs stok" },
  { status: "Ditagihkan", label: "Ditagihkan (SAP)", desc: "No. SAP diinput · masuk faktur penjualan" },
] as const;

/** Status lifecycle transaksi tinter · referensi feedback Sheet #14 & PPT slide 9–11 */

export const TRANSAKSI_STATUSES = [
  "Draft",
  "Cetak Nota",
  "TTD GH",
  "Menunggu OPB",
  "OPB Terbit",
  "Proses Invoice",
  "Selesai",
  "Dibatalkan",
] as const;

export type TransaksiStatus = (typeof TRANSAKSI_STATUSES)[number];

export type TransaksiActor = "tinter" | "admin";

/** Map status lama ke status baru (localStorage legacy) */
const LEGACY_STATUS: Record<string, TransaksiStatus> = {
  "Menunggu TTD": "Cetak Nota",
};

export function normalizeTransaksiStatus(status: string): TransaksiStatus {
  if ((TRANSAKSI_STATUSES as readonly string[]).includes(status)) {
    return status as TransaksiStatus;
  }
  return LEGACY_STATUS[status] ?? "Draft";
}

const TINTER_NEXT: Partial<Record<TransaksiStatus, TransaksiStatus>> = {
  Draft: "Cetak Nota",
  "Cetak Nota": "TTD GH",
  "TTD GH": "Menunggu OPB",
};

const ADMIN_NEXT: Partial<Record<TransaksiStatus, TransaksiStatus>> = {
  "Menunggu OPB": "OPB Terbit",
  "OPB Terbit": "Proses Invoice",
  "Proses Invoice": "Selesai",
};

export function nextTransaksiStatus(
  current: TransaksiStatus,
  actor: TransaksiActor,
): TransaksiStatus | null {
  const map = actor === "tinter" ? TINTER_NEXT : ADMIN_NEXT;
  return map[current] ?? null;
}

export function canActorUpdateStatus(status: TransaksiStatus, actor: TransaksiActor): boolean {
  if (status === "Dibatalkan" || status === "Selesai") return false;
  return nextTransaksiStatus(status, actor) !== null;
}

export const TRANSAKSI_STATUS_FILTER = ["Semua Status", ...TRANSAKSI_STATUSES.filter((s) => s !== "Dibatalkan")] as const;

export const PRODUK_KATEGORI = [
  { id: "basecoat", label: "Basecoat / Cat" },
  { id: "dempul", label: "Dempul / Putty" },
  { id: "primer", label: "Primer & Surfacer" },
  { id: "thinner", label: "Thinner" },
  { id: "lain", label: "Lain-lain (Silicon Degreaser)" },
] as const;

export type ProdukKategoriId = (typeof PRODUK_KATEGORI)[number]["id"];

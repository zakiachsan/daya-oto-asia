/** Status lifecycle transaksi tinter · alur Word (#32): Menunggu TTD → Menunggu OPB */

export const TRANSAKSI_STATUSES = [
  "Draft",
  "Menunggu TTD",
  "Menunggu OPB",
  "OPB Terbit",
  "Proses Invoice",
  "Selesai",
  "Dibatalkan",
] as const;

export type TransaksiStatus = (typeof TRANSAKSI_STATUSES)[number];

export type TransaksiActor = "tinter" | "admin";

const LEGACY_STATUS: Record<string, TransaksiStatus> = {
  "Cetak Nota": "Menunggu TTD",
  "TTD GH": "Menunggu OPB",
};

export function normalizeTransaksiStatus(status: string): TransaksiStatus {
  if ((TRANSAKSI_STATUSES as readonly string[]).includes(status)) {
    return status as TransaksiStatus;
  }
  return LEGACY_STATUS[status] ?? "Draft";
}

const TINTER_NEXT: Partial<Record<TransaksiStatus, TransaksiStatus>> = {
  "Menunggu TTD": "Menunggu OPB",
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

/** Urutan dropdown fase 1 transaksi · selaras nota (#25) */
export const PRODUK_KATEGORI = [
  { id: "basecoat", label: "Base coat" },
  { id: "clearcoat", label: "Clear Coat" },
  { id: "surfacer", label: "Surfacer" },
  { id: "primer", label: "Primer" },
  { id: "thinner", label: "Thinner" },
  { id: "dempul", label: "Putty/Dempul" },
  { id: "lain", label: "lain-lain" },
] as const;

export type ProdukKategoriId = (typeof PRODUK_KATEGORI)[number]["id"];

import type { TransaksiRow } from "./mock-data";
import { isInternalTransaksiId, resolveReceiptIdDisplay } from "./recipe-id-utils";
import { normalizeTransaksiId } from "./transaksi-id-utils";
import { normalizeTransaksiStatus } from "./transaksi-status-utils";

function normalizeStoredReceiptId(receiptId: string | undefined, id: string): string | undefined {
  if (!receiptId?.trim()) return undefined;
  if (receiptId.startsWith("RCP-DOA")) return receiptId;
  if (isInternalTransaksiId(receiptId) || receiptId === id) return undefined;
  return receiptId;
}

export function normalizeTransaksiRow(row: TransaksiRow): TransaksiRow {
  const id = normalizeTransaksiId(row.id);
  const base = {
    ...row,
    id,
    receiptId: normalizeStoredReceiptId(row.receiptId, id),
    status: normalizeTransaksiStatus(String(row.status)),
    parentId: row.parentId ? normalizeTransaksiId(row.parentId) : row.parentId,
  };
  const receiptId = resolveReceiptIdDisplay(base);
  return {
    ...base,
    receiptId,
    recipeId: receiptId.startsWith("RCP-DOA") ? receiptId : base.recipeId,
  };
}

/** Receipt ID (nota) · RCP-DOA — tanpa spasi (DB-safe) */

function receiptToken(value: string, maxLen = 48): string {
  const compact = value.replace(/\s+/g, "").trim();
  return compact.slice(0, maxLen) || "—";
}

export function formatRecipeId(params: {
  cabang: string;
  tanggal?: Date;
  noPekerjaan: string;
}) {
  const d = params.tanggal ?? new Date();
  const cab = receiptToken(params.cabang.replace(/^Bengkel\s+/i, ""), 32);
  const tgl = d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\s+/g, "");
  const no = receiptToken(params.noPekerjaan, 24);
  return `RCP-DOA-${cab}-${tgl}-${no}`;
}

/** ID internal transaksi (DOA-…) — bukan Receipt ID nota */
export function isInternalTransaksiId(value: string): boolean {
  return /^DOA-\d{4}-\d{4}$/.test(value) || /^DOA-\d{2}\d{2}-\d{4}$/.test(value);
}

type ReceiptIdSource = {
  receiptId?: string | null;
  recipeId?: string | null;
  id: string;
  cabang?: string;
  tanggal?: string;
  platNomor?: string;
};

/** Yang ditampilkan user / nota · selalu RCP-DOA bila memungkinkan */
export function resolveReceiptIdDisplay(row: ReceiptIdSource): string {
  const candidates = [row.receiptId, row.recipeId].filter(Boolean) as string[];
  for (const c of candidates) {
    if (c.startsWith("RCP-DOA")) return c;
  }
  for (const c of candidates) {
    if (c.startsWith("RCP-") && !isInternalTransaksiId(c)) return c;
  }
  if (row.cabang?.trim() && row.platNomor?.trim() && row.tanggal) {
    const parts = row.tanggal.split("-").map(Number);
    const tanggal =
      parts.length === 3 && parts.every((n) => !Number.isNaN(n))
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(row.tanggal);
    return formatRecipeId({
      cabang: row.cabang,
      tanggal,
      noPekerjaan: row.platNomor,
    });
  }
  return candidates[0] ?? row.id;
}

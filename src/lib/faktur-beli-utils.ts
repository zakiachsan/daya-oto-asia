export type FakturBeliRow = {
  id: string;
  tanggal: string;
  vendor: string;
  po: string;
  total: number;
  status: "Draft" | "Posted";
  jurnalId?: string;
};

export function fakturBeliSlug(id: string) {
  return id.toLowerCase();
}

/** Satu ID faktur unik · yang lebih baru (di depan array) menang */
export function dedupeFakturBeliById(rows: FakturBeliRow[]) {
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

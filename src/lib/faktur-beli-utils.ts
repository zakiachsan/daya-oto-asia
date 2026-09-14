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

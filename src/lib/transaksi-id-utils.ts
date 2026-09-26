/** ID transaksi / Receipt ID · format DOA (contoh DOA-2826-2813) */

export function createDoaTransaksiId(seq?: number) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const n = seq ?? 1000 + Math.floor(Math.random() * 8999);
  return `DOA-${dd}${yy}-${String(n).padStart(4, "0")}`;
}

export function normalizeTransaksiId(id: string) {
  if (id.startsWith("TRX-")) return id.replace(/^TRX-/, "DOA-");
  if (/^DOA-\d{4}-\d{4}$/.test(id)) return id;
  if (/^DOA-2026-/.test(id)) {
    const tail = id.replace(/^DOA-2026-/, "");
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    return `DOA-${dd}${yy}-${tail.padStart(4, "0").slice(-4)}`;
  }
  return id;
}

"use client";

import { formatIDR, type OpbRow, type TransaksiRow } from "@/lib/mock-data";

type RekapInvoicePreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  invoiceId?: string;
  className?: string;
};

/** Rekap admin lampiran invoice — referensi rekap admin PDF */
export function RekapInvoicePreview({ opb, transaksi, invoiceId, className = "" }: RekapInvoicePreviewProps) {
  const cabangTrx = transaksi.filter(
    (t) => t.cabang.includes(opb.cabang.split(" ")[0]) && t.status === "Selesai"
  );

  const byKategori = cabangTrx.reduce<Record<string, { count: number; total: number; gram: number }>>((acc, t) => {
    const k = t.kategori;
    if (!acc[k]) acc[k] = { count: 0, total: 0, gram: 0 };
    acc[k].count += 1;
    acc[k].total += t.total;
    acc[k].gram += t.bahan.reduce((s, b) => s + b.gram, 0);
    return acc;
  }, {});

  type KatSummary = { count: number; total: number; gram: number };
  const fallbackRow: [string, KatSummary] = ["Silver", { count: opb.jumlahTrx, total: opb.total, gram: 0 }];
  const kategoriRows: [string, KatSummary][] =
    Object.keys(byKategori).length > 0
      ? Object.entries(byKategori)
      : [fallbackRow];

  return (
    <div
      className={`bg-white text-black font-serif text-[11px] leading-snug border border-gray-400 p-4 ${className}`}
      id="rekap-invoice-preview"
    >
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <p className="text-[13px] font-bold uppercase">Rekap Admin — Lampiran Invoice</p>
        <p className="text-[11px]">PT Daya Oto Asia</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[10px]">
        <div><span className="font-semibold">No. Invoice</span><span className="ml-2 font-mono">{invoiceId ?? "DRAFT"}</span></div>
        <div><span className="font-semibold">No. OPB</span><span className="ml-2 font-mono">{opb.id}</span></div>
        <div><span className="font-semibold">Pelanggan</span><span className="ml-2">{opb.cabang}</span></div>
        <div><span className="font-semibold">Periode</span><span className="ml-2">{opb.periode}</span></div>
        {opb.sap && <div className="col-span-2"><span className="font-semibold">No. SAP</span><span className="ml-2 font-mono">{opb.sap}</span></div>}
      </div>

      <table className="w-full border-collapse mb-3 text-[10px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-1 py-1 text-left">Kategori Warna</th>
            <th className="border border-black px-1 py-1 text-right">Jumlah Trx</th>
            <th className="border border-black px-1 py-1 text-right">Pemakaian (gr)</th>
            <th className="border border-black px-1 py-1 text-right">Subtotal (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {kategoriRows.map(([kat, data]) => (
            <tr key={kat}>
              <td className="border border-black px-1 py-0.5">{kat}</td>
              <td className="border border-black px-1 py-0.5 text-right">{data.count}</td>
              <td className="border border-black px-1 py-0.5 text-right">{data.gram || "—"}</td>
              <td className="border border-black px-1 py-0.5 text-right">{formatIDR(data.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border border-black px-1 py-1">TOTAL</td>
            <td className="border border-black px-1 py-1 text-right">{opb.jumlahTrx}</td>
            <td className="border border-black px-1 py-1 text-right">—</td>
            <td className="border border-black px-1 py-1 text-right">{formatIDR(opb.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="text-[9px] text-gray-600 italic">
        Dokumen ini dilampirkan pada faktur penjualan untuk verifikasi admin cabang &amp; finance HO.
      </p>

      <div className="grid grid-cols-2 gap-8 mt-6 text-[9px] text-center">
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Admin HO</p>
        </div>
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Finance / AR</p>
        </div>
      </div>
    </div>
  );
}

export function printRekapInvoicePreview() {
  const el = document.getElementById("rekap-invoice-preview");
  if (!el) return;
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Rekap Invoice</title>
    <style>body{margin:16px;font-family:Georgia,serif}</style></head><body>${el.outerHTML}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

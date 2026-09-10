"use client";

import { formatIDR, type OpbRow, type TransaksiRow } from "@/lib/mock-data";

type OpbPreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
  className?: string;
};

/** Layout OPB referensi contoh OPB.pdf — preview cetak */
export function OpbPreview({ opb, transaksi, className = "" }: OpbPreviewProps) {
  const linked = transaksi.filter(
    (t) => t.opbId === opb.id || (t.cabang.includes(opb.cabang.split(" ")[0]) && t.status === "Selesai")
  ).slice(0, opb.jumlahTrx);

  const displayTrx =
    linked.length > 0
      ? linked
      : transaksi.filter((t) => t.cabang.includes(opb.cabang.split(" ")[0]) && t.status === "Selesai").slice(0, 5);

  return (
    <div
      className={`bg-white text-black font-serif text-[11px] leading-snug border border-gray-400 p-4 ${className}`}
      id="opb-preview"
    >
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <p className="text-[14px] font-bold uppercase">Order Pembelian Bahan (OPB)</p>
        <p className="text-[12px] font-bold">PT Daya Oto Asia</p>
        <p className="text-[10px] mt-1">Cabang / Bengkel Mitra: {opb.cabang}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[10px]">
        <div><span className="font-semibold">No. OPB</span><span className="ml-2 font-mono">{opb.id}</span></div>
        <div><span className="font-semibold">Periode</span><span className="ml-2">{opb.periode}</span></div>
        <div><span className="font-semibold">Tanggal Cetak</span><span className="ml-2">{new Date().toISOString().slice(0, 10)}</span></div>
        <div><span className="font-semibold">Status</span><span className="ml-2">{opb.status}</span></div>
        {opb.sap && (
          <div className="col-span-2"><span className="font-semibold">No. SAP</span><span className="ml-2 font-mono">{opb.sap}</span></div>
        )}
      </div>

      <table className="w-full border-collapse mb-3 text-[10px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-1 py-1 text-left">No</th>
            <th className="border border-black px-1 py-1 text-left">No. Transaksi</th>
            <th className="border border-black px-1 py-1 text-left">Tanggal</th>
            <th className="border border-black px-1 py-1 text-left">Warna / Kode</th>
            <th className="border border-black px-1 py-1 text-left">Tinter</th>
            <th className="border border-black px-1 py-1 text-right">Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {(displayTrx.length > 0 ? displayTrx : [{ id: "—", tanggal: "—", warna: "—", kodeWarna: "—", tinter: "—", total: 0 }] as TransaksiRow[]).map((t, i) => (
            <tr key={String(t.id) + i}>
              <td className="border border-black px-1 py-0.5">{i + 1}</td>
              <td className="border border-black px-1 py-0.5 font-mono">{t.id}</td>
              <td className="border border-black px-1 py-0.5">{t.tanggal}</td>
              <td className="border border-black px-1 py-0.5">{t.warna} ({t.kodeWarna})</td>
              <td className="border border-black px-1 py-0.5">{t.tinter}</td>
              <td className="border border-black px-1 py-0.5 text-right">{formatIDR(t.total)}</td>
            </tr>
          ))}
          {displayTrx.length < opb.jumlahTrx && (
            <tr>
              <td className="border border-black px-1 py-0.5 italic text-gray-600" colSpan={6}>
                + {opb.jumlahTrx - displayTrx.length} transaksi lainnya (ringkas di dokumen final)
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border border-black px-1 py-1" colSpan={5}>TOTAL TAGIHAN</td>
            <td className="border border-black px-1 py-1 text-right">{formatIDR(opb.total)}</td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-1" colSpan={5}>Jumlah Transaksi</td>
            <td className="border border-black px-1 py-1 text-right">{opb.jumlahTrx}</td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-3 gap-4 mt-6 text-[9px] text-center">
        <div>
          <div className="border-b border-black h-12 mb-1" />
          <p>Admin Cabang</p>
          <p className="text-gray-500">TTD DocuMatrix</p>
        </div>
        <div>
          <div className="border-b border-black h-12 mb-1" />
          <p>Supervisor HO</p>
          <p className="text-gray-500">Rekonsiliasi</p>
        </div>
        <div>
          <div className="border-b border-black h-12 mb-1" />
          <p>Finance</p>
          <p className="text-gray-500">Input SAP</p>
        </div>
      </div>
    </div>
  );
}

export function printOpbPreview() {
  const el = document.getElementById("opb-preview");
  if (!el) return;
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>OPB</title>
    <style>body{margin:16px;font-family:Georgia,serif}</style></head><body>${el.outerHTML}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

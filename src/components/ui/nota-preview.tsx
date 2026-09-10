"use client";

import { formatIDR, type TransaksiRow } from "@/lib/mock-data";
import { gramToLiter } from "@/lib/formula-utils";

type NotaPreviewProps = {
  trx: Pick<
    TransaksiRow,
    | "id"
    | "tanggal"
    | "cabang"
    | "warna"
    | "kodeWarna"
    | "kategori"
    | "mobil"
    | "platNomor"
    | "tinter"
    | "total"
    | "bahan"
    | "noPkb"
    | "jumlahPanel"
    | "noVendor"
    | "mixingVolume"
  >;
  lokasi?: string;
  className?: string;
};

/** Layout nota referensi DOA Cabang Bogor — preview cetak */
export function NotaPreview({ trx, lokasi = "Astra Daihatsu — Bogor", className = "" }: NotaPreviewProps) {
  const totalGram = trx.bahan.reduce((s, b) => s + b.gram, 0);
  const pemakaianLiter = gramToLiter(totalGram);

  return (
    <div
      className={`bg-white text-black font-serif text-[11px] leading-snug border border-gray-400 p-4 print:p-2 print:border-0 print:shadow-none ${className}`}
      id="nota-preview"
    >
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <p className="text-[13px] font-bold uppercase tracking-wide">PT Daya Oto Asia</p>
        <p className="text-[10px]">Nota Pemakaian Bahan Cat — {trx.cabang}</p>
        <p className="text-[10px] italic">{lokasi}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-[10px]">
        <div><span className="font-semibold">Lokasi</span><span className="ml-2">{lokasi}</span></div>
        <div><span className="font-semibold">Tanggal</span><span className="ml-2">{trx.tanggal}</span></div>
        <div><span className="font-semibold">Type Mobil</span><span className="ml-2">{trx.mobil}</span></div>
        <div><span className="font-semibold">Warna</span><span className="ml-2">{trx.warna} ({trx.kodeWarna})</span></div>
        <div><span className="font-semibold">No. PKB</span><span className="ml-2">{trx.noPkb ?? "—"}</span></div>
        <div><span className="font-semibold">No. Polisi</span><span className="ml-2">{trx.platNomor}</span></div>
        <div><span className="font-semibold">Jumlah Panel</span><span className="ml-2">{trx.jumlahPanel ?? "—"}</span></div>
        <div><span className="font-semibold">No. Vendor</span><span className="ml-2">{trx.noVendor ?? "VND-001"}</span></div>
        <div><span className="font-semibold">Kategori</span><span className="ml-2">{trx.kategori}</span></div>
        <div><span className="font-semibold">Mixing Vol.</span><span className="ml-2">{trx.mixingVolume ?? totalGram}G</span></div>
      </div>

      <table className="w-full border-collapse mb-3 text-[10px]">
        <thead>
          <tr className="border border-black bg-gray-100">
            <th className="border border-black px-1 py-1 text-left">Nama Material</th>
            <th className="border border-black px-1 py-1 text-left">Kode</th>
            <th className="border border-black px-1 py-1 text-right">Pemakaian (gr)</th>
          </tr>
        </thead>
        <tbody>
          {trx.bahan.map((b) => (
            <tr key={b.kode}>
              <td className="border border-black px-1 py-0.5">{b.nama}</td>
              <td className="border border-black px-1 py-0.5 font-mono">{b.kode}</td>
              <td className="border border-black px-1 py-0.5 text-right">{b.gram}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="border border-black px-1 py-0.5" colSpan={2}>Total Pemakaian</td>
            <td className="border border-black px-1 py-0.5 text-right">{totalGram} gr ({pemakaianLiter} L)</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-end border-t border-black pt-2 mb-4">
        <div>
          <p className="text-[10px]">Ref: {trx.id}</p>
          <p className="text-[10px]">Tinter: {trx.tinter}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold">Jumlah Rp</p>
          <p className="text-[14px] font-bold">{formatIDR(trx.total)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-6 text-[9px] text-center">
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Tinter</p>
        </div>
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Kepala Bengkel / DocuMatrix</p>
        </div>
      </div>

      <p className="text-[8px] text-gray-600 mt-3 text-center italic">
        Dokumen ini wajib dicetak sebelum transaksi selesai. Cetak ulang tercatat di audit log.
      </p>
    </div>
  );
}

export function printNotaPreview() {
  const el = document.getElementById("nota-preview");
  if (!el) return;
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Nota ${Date.now()}</title>
    <style>body{margin:16px;font-family:Georgia,serif} @media print{body{margin:0}}</style></head><body>${el.outerHTML}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

"use client";

import type { LaporanPemakaianRow } from "@/lib/laporan-pemakaian";
import { totalGramLaporan } from "@/lib/laporan-pemakaian";

type LaporanPemakaianPreviewProps = {
  bengkel: string;
  tinter: string;
  bulan: string;
  rows: LaporanPemakaianRow[];
  className?: string;
};

/** Grid laporan pemakaian base (gram) — referensi DOA Cabang Bogor halaman 2 */
export function LaporanPemakaianPreview({ bengkel, tinter, bulan, rows, className = "" }: LaporanPemakaianPreviewProps) {
  const bulanLabel = new Date(`${bulan}-01`).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const daysInMonth = new Date(Number(bulan.slice(0, 4)), Number(bulan.slice(5, 7)), 0).getDate();

  const byDay = rows.reduce<Record<number, LaporanPemakaianRow[]>>((acc, r) => {
    if (!acc[r.tanggal]) acc[r.tanggal] = [];
    acc[r.tanggal].push(r);
    return acc;
  }, {});

  return (
    <div
      className={`bg-white text-black font-serif text-[10px] leading-snug border border-gray-400 p-4 ${className}`}
      id="laporan-pemakaian-preview"
    >
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <p className="text-[13px] font-bold uppercase">Laporan Pemakaian Base (Gram)</p>
        <p className="text-[11px]">PT Daya Oto Asia</p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-[10px]">
        <div><span className="font-semibold">NAMA BENGKEL</span><span className="ml-2">{bengkel}</span></div>
        <div><span className="font-semibold">BULAN</span><span className="ml-2">{bulanLabel}</span></div>
        <div className="col-span-2"><span className="font-semibold">NAMA TINTER</span><span className="ml-2">{tinter}</span></div>
      </div>

      <table className="w-full border-collapse mb-3 text-[9px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-1 py-1 w-8">TGL</th>
            <th className="border border-black px-1 py-1 text-left">NAMA BARANG</th>
            <th className="border border-black px-1 py-1 text-left">KODE BARANG</th>
            <th className="border border-black px-1 py-1 text-left">NO POLISI</th>
            <th className="border border-black px-1 py-1 text-right">TOTAL (gr)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayRows = byDay[day];
            if (!dayRows?.length) {
              return (
                <tr key={day} className="text-gray-400">
                  <td className="border border-black px-1 py-0.5 text-center">{day}</td>
                  <td className="border border-black px-1 py-0.5" colSpan={4}>—</td>
                </tr>
              );
            }
            return dayRows.map((r, idx) => (
              <tr key={`${day}-${idx}`}>
                {idx === 0 && (
                  <td className="border border-black px-1 py-0.5 text-center align-top font-semibold" rowSpan={dayRows.length}>
                    {day}
                  </td>
                )}
                <td className="border border-black px-1 py-0.5">{r.namaBarang}</td>
                <td className="border border-black px-1 py-0.5 font-mono">{r.kodeBarang}</td>
                <td className="border border-black px-1 py-0.5">{r.noPolisi}</td>
                <td className="border border-black px-1 py-0.5 text-right font-semibold">{r.totalGram}</td>
              </tr>
            ));
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="border border-black px-1 py-1" colSpan={4}>TOTAL BULAN INI</td>
            <td className="border border-black px-1 py-1 text-right">{totalGramLaporan(rows)} gr</td>
          </tr>
        </tfoot>
      </table>

      <div className="grid grid-cols-2 gap-8 mt-4 text-[9px] text-center">
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Tinter</p>
        </div>
        <div>
          <div className="border-b border-black h-10 mb-1" />
          <p>Supervisor / Admin Cabang</p>
        </div>
      </div>
    </div>
  );
}

export function printLaporanPemakaianPreview() {
  const el = document.getElementById("laporan-pemakaian-preview");
  if (!el) return;
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Laporan Pemakaian</title>
    <style>body{margin:16px;font-family:Georgia,serif} table{font-size:9px}</style></head><body>${el.outerHTML}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

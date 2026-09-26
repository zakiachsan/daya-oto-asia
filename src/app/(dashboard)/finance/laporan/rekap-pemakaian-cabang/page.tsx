"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { formatIDR } from "@/lib/mock-data";
import { useTransaksiList } from "@/lib/preview-store";
import { MOCK_CABANG } from "@/lib/mock-data";

/** Rekap Pemakaian Cabang per bulan IDR (#60) */
export default function RekapPemakaianCabangPage() {
  const { all } = useTransaksiList();
  const [bulan, setBulan] = useState("2026-09");

  const rows = useMemo(() => {
    return MOCK_CABANG.map((c) => {
      const kota = c.nama.replace(/^Bengkel /, "");
      const trx = all.filter((t) => t.tanggal.startsWith(bulan) && t.cabang.includes(kota.split(" ").pop() ?? kota));
      const omsetNota = trx.reduce((s, t) => s + t.total, 0);
      const terimaPusat = Math.round(omsetNota * 1.35 + 5000000);
      return { cabang: kota, terimaPusat, omsetNota, selisih: terimaPusat - omsetNota };
    });
  }, [all, bulan]);

  return (
    <div>
      <PageHeader
        title="Rekap Pemakaian Cabang"
        desc="Bandingkan nilai barang diterima dari pusat vs omset nota per bulan (IDR)"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Rekap Pemakaian Cabang" }]}
      />
      <input type="month" value={bulan} onChange={(e) => setBulan(e.target.value)} className="mb-4 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
      <div className="bg-white border border-slds-border rounded-lg overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-slds-bg">
            <tr>
              <th className="text-left p-3">Cabang</th>
              <th className="text-right p-3">Terima dari Pusat</th>
              <th className="text-right p-3">Omset Nota</th>
              <th className="text-right p-3">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cabang} className="border-t border-slds-border">
                <td className="p-3 font-semibold">{r.cabang}</td>
                <td className="p-3 text-right">{formatIDR(r.terimaPusat)}</td>
                <td className="p-3 text-right">{formatIDR(r.omsetNota)}</td>
                <td className={`p-3 text-right font-bold ${r.selisih > 0 ? "text-amber-700" : "text-green-700"}`}>
                  {formatIDR(r.selisih)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

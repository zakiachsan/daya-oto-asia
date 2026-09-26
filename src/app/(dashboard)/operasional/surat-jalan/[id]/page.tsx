"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { useDistribusiList } from "@/lib/preview-store";

export default function SuratJalanDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { items } = useDistribusiList();
  const distId = id.replace(/^SJ-/, "DIST-");
  const d = items.find((x) => x.id === distId);

  if (!d) {
    return <p className="p-8 text-slds-text-weak">Surat jalan tidak ditemukan</p>;
  }

  return (
    <div>
      <PageHeader
        title={id}
        desc={`Distribusi ${d.id} · ${d.dari} → ${d.ke}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Surat Jalan", href: "/operasional/surat-jalan" },
          { label: id },
        ]}
      />
      <Link href="/operasional/surat-jalan" className="text-brand text-[13px] font-semibold mb-4 inline-block">
        ← Kembali
      </Link>
      <div className="bg-white border border-slds-border rounded-lg p-6 max-w-2xl print:shadow-none" id="sj-print">
        <h2 className="text-lg font-bold text-center">SURAT JALAN</h2>
        <p className="text-center text-[12px] text-slds-text-weak mt-1">PT Daya Oto Asia</p>
        <div className="mt-4 text-[13px] space-y-1">
          <p><strong>No:</strong> {id}</p>
          <p><strong>Tanggal:</strong> {d.tanggal}</p>
          <p><strong>Tujuan:</strong> {d.ke}</p>
          <p><strong>Driver:</strong> {d.driver ?? "-"}</p>
        </div>
        <table className="w-full mt-4 text-[12px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Kode</th>
              <th className="text-left py-2">Produk</th>
              <th className="text-right py-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {d.lines.map((l) => (
              <tr key={l.kode} className="border-b border-slds-border/60">
                <td className="py-2 font-mono">{l.kode}</td>
                <td className="py-2">{l.nama}</td>
                <td className="py-2 text-right">{l.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        data-no-toast
        onClick={() => window.print()}
        className="mt-4 px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold"
      >
        Cetak / Download
      </button>
    </div>
  );
}

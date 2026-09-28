"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { distribusiStatus } from "@/lib/distribusi-utils";
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

  const status = distribusiStatus(d);
  const terbit = status !== "Draft";

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
        actions={terbit ? <StatusBadge status={status === "Selesai" ? "Diterima" : "Terkirim"} /> : undefined}
      />
      <Link href="/operasional/surat-jalan" className="text-brand text-[13px] font-semibold mb-4 inline-block">
        ← Kembali
      </Link>
      {!terbit && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800">
          Surat jalan belum terbit — distribusi <span className="font-mono">{d.id}</span> masih berstatus Draft (belum dikirim pusat).
        </div>
      )}
      <div className="bg-white border border-slds-border rounded-lg p-6 max-w-2xl print:shadow-none" id="sj-print">
        <h2 className="text-lg font-bold text-center">SURAT JALAN</h2>
        <p className="text-center text-[12px] text-slds-text-weak mt-1">PT Daya Oto Asia</p>
        <div className="mt-4 text-[13px] space-y-1">
          <p><strong>No:</strong> {id}</p>
          <p><strong>Tanggal:</strong> {d.tanggal}</p>
          <p><strong>Tujuan:</strong> {d.ke}</p>
          <p><strong>Driver:</strong> {d.driver ?? "-"}</p>
          <p><strong>Status:</strong> {status === "Selesai" ? "Diterima cabang" : "Dalam perjalanan"}</p>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          data-no-toast
          onClick={() => window.print()}
          className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold"
        >
          Cetak / Download
        </button>
        <Link
          href={`/operasional/distribusi/${d.id}`}
          className="px-4 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-brand hover:bg-slds-bg"
        >
          Lihat Distribusi {d.id}
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { penyesuaianFromSlug } from "@/lib/penyesuaian-stok-utils";
import { jurnalSlug } from "@/lib/jurnal-utils";
import { usePenyesuaianStok } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function PenyesuaianStokDetailPage() {
  const params = useParams();
  const id = penyesuaianFromSlug(String(params.slug));
  const { toast } = useToast();
  const { items, update } = usePenyesuaianStok();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Penyesuaian stok tidak ditemukan</p>
        <Link href="/finance/penyesuaian-stok" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  function handlePost() {
    update(row.id, { status: "Posted", jurnalId: row.jurnalId ?? "JU/2026/09/003" });
    toast(`Penyesuaian ${row.id} di-posting + jurnal otomatis`, "success");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={row.alasan}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Penyesuaian Stok", href: "/finance/penyesuaian-stok" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/finance/penyesuaian-stok" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span className="font-semibold">{row.cabang}</span></div>
          <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
            <span>Nilai Koreksi</span><span className="text-brand">{formatIDR(row.nilai)}</span>
          </div>
          {row.refOpname && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ref. Opname</span>
              <Link href={`/operasional/stock-opname/${row.refOpname}`} className="font-mono font-semibold text-brand hover:underline">{row.refOpname}</Link>
            </div>
          )}
          {row.jurnalId && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Jurnal</span>
              <Link href={`/finance/jurnal/${jurnalSlug(row.jurnalId)}`} className="font-mono font-semibold text-brand hover:underline">{row.jurnalId}</Link>
            </div>
          )}
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Alasan</p>
            <p className="text-[12px]">{row.alasan}</p>
          </div>
          {row.status === "Draft" && (
            <button type="button" data-no-toast onClick={handlePost} className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
              <Send className="h-3.5 w-3.5" /> Post Penyesuaian
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Detail Selisih per Produk</h3>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                <th className="pb-2 font-semibold">Kode</th>
                <th className="pb-2 font-semibold">Produk</th>
                <th className="pb-2 font-semibold text-right">Selisih</th>
                <th className="pb-2 font-semibold text-right">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {row.lines.map((l) => (
                <tr key={l.kode} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{l.kode}</td>
                  <td className="py-2 text-slds-text-weak">{l.produk}</td>
                  <td className={`py-2 text-right font-semibold ${l.selisihGram < 0 ? "text-red-600" : "text-green-600"}`}>
                    {l.selisihGram > 0 ? `+${l.selisihGram}` : l.selisihGram} gr
                  </td>
                  <td className="py-2 text-right font-semibold">{formatIDR(l.nilai)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 p-3 bg-slds-bg rounded-md text-[12px]">
            <p className="font-semibold text-slds-text mb-1">Auto-jurnal (preview)</p>
            <p className="text-slds-text-weak">Dr Beban Penyesuaian Stok / Cr Persediaan Bahan Cat — {formatIDR(row.nilai)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { jurnalFromSlug } from "@/lib/jurnal-utils";
import { useJurnalList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function JurnalDetailPage() {
  const params = useParams();
  const id = jurnalFromSlug(String(params.slug));
  const { toast } = useToast();
  const { all, updateStatus } = useJurnalList();
  const jurnal = all.find((j) => j.id === id);

  if (!jurnal) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Jurnal tidak ditemukan</p>
        <Link href="/finance/jurnal" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = jurnal;

  function handlePost() {
    updateStatus(row.id, "Posted");
    toast(`Jurnal ${row.id} di-posting`, "success");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={row.keterangan}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Jurnal Umum", href: "/finance/jurnal" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/finance/jurnal" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Header Jurnal</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Status</span><StatusBadge status={row.status} /></div>
          {row.refOpb && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ref. OPB</span>
              <Link href={`/operasional/opb/${row.refOpb}`} className="font-mono font-semibold text-brand hover:underline">{row.refOpb}</Link>
            </div>
          )}
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Keterangan</p>
            <p>{row.keterangan}</p>
          </div>
          {row.status === "Draft" && (
            <button type="button" data-no-toast onClick={handlePost} className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
              <Send className="h-3.5 w-3.5" /> Post Jurnal
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Baris Jurnal (Double Entry)</h3>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                <th className="pb-2 font-semibold">Kode Akun</th>
                <th className="pb-2 font-semibold">Nama Akun</th>
                <th className="pb-2 font-semibold text-right">Debit</th>
                <th className="pb-2 font-semibold text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {row.lines.map((line) => (
                <tr key={line.accountKode + line.debit + line.credit} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{line.accountKode}</td>
                  <td className="py-2">{line.accountNama}</td>
                  <td className="py-2 text-right">{line.debit > 0 ? formatIDR(line.debit) : "—"}</td>
                  <td className="py-2 text-right">{line.credit > 0 ? formatIDR(line.credit) : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="pt-3" colSpan={2}>Total</td>
                <td className="pt-3 text-right text-green-700">{formatIDR(row.debit)}</td>
                <td className="pt-3 text-right text-green-700">{formatIDR(row.kredit)}</td>
              </tr>
            </tfoot>
          </table>
          <p className={`text-[12px] mt-3 font-semibold ${row.debit === row.kredit ? "text-green-700" : "text-red-600"}`}>
            {row.debit === row.kredit ? "✓ Jurnal balanced" : "✗ Tidak balanced"}
          </p>
        </div>
      </div>
    </div>
  );
}

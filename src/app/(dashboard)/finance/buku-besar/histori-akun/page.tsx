import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { MOCK_COA, MOCK_HISTORI_AKUN, formatIDR } from "@/lib/mock-data";
import { jurnalSlug } from "@/lib/jurnal-utils";

export default function HistoriAkunPage() {
  const akun = MOCK_COA.find((a) => a.kode === "110301")!;
  const saldoAkhir = MOCK_HISTORI_AKUN[MOCK_HISTORI_AKUN.length - 1]?.saldo ?? akun.saldo;

  return (
    <div>
      <PageHeader
        title="Histori Akun"
        desc="Buku besar per akun · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Buku Besar" },
          { label: "Histori Akun" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white min-w-[220px]" defaultValue="110301">
            {MOCK_COA.map((a) => (
              <option key={a.kode} value={a.kode}>{a.kode} · {a.nama}</option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase text-slds-text-weak">Akun</p>
          <p className="text-[13px] font-bold mt-1">{akun.kode} · {akun.nama}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase text-slds-text-weak">Saldo Awal</p>
          <p className="text-xl font-bold mt-1">{formatIDR(akun.saldo)}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase text-slds-text-weak">Saldo Akhir</p>
          <p className="text-xl font-bold text-brand mt-1">{formatIDR(saldoAkhir)}</p>
        </div>
      </div>

      <div className="bg-white border border-slds-border rounded-lg overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak bg-slds-bg">
              <th className="px-4 py-2 font-semibold">Tanggal</th>
              <th className="px-4 py-2 font-semibold">Jurnal</th>
              <th className="px-4 py-2 font-semibold">Keterangan</th>
              <th className="px-4 py-2 font-semibold text-right">Debit</th>
              <th className="px-4 py-2 font-semibold text-right">Kredit</th>
              <th className="px-4 py-2 font-semibold text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HISTORI_AKUN.map((r) => (
              <tr key={r.jurnalId} className="border-b border-slds-border last:border-0">
                <td className="px-4 py-2">{r.tanggal}</td>
                <td className="px-4 py-2">
                  <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(r.jurnalId)}`} className="font-mono text-brand hover:underline">
                    {r.jurnalId}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slds-text-weak">{r.keterangan}</td>
                <td className="px-4 py-2 text-right">{r.debit > 0 ? formatIDR(r.debit) : "-"}</td>
                <td className="px-4 py-2 text-right">{r.credit > 0 ? formatIDR(r.credit) : "-"}</td>
                <td className="px-4 py-2 text-right font-semibold">{formatIDR(r.saldo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

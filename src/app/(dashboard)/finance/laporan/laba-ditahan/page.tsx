import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { PiggyBank, TrendingUp, Minus } from "lucide-react";
import { MOCK_LABA_DITAHAN, formatIDR } from "@/lib/mock-data";

export default function LabaDitahanPage() {
  return (
    <div>
      <PageHeader
        title="Laba Ditahan"
        desc="Mutasi saldo laba ditahan · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Laba Ditahan" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>Tahun 2026</option>
            <option>Tahun 2025</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Saldo Awal" value={formatIDR(MOCK_LABA_DITAHAN.saldoAwal)} icon={PiggyBank} color="blue" />
        <StatCard label="Laba Bersih" value={formatIDR(MOCK_LABA_DITAHAN.labaBersih)} icon={TrendingUp} color="green" />
        <StatCard label="Saldo Akhir" value={formatIDR(MOCK_LABA_DITAHAN.saldoAkhir)} icon={PiggyBank} color="amber" />
      </div>

      <div className="bg-white border border-slds-border rounded-lg p-4 mb-4 max-w-xl">
        <h3 className="text-[13px] font-bold text-slds-text mb-3">Rekapitulasi</h3>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-slds-text-weak">Saldo awal</span><span>{formatIDR(MOCK_LABA_DITAHAN.saldoAwal)}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Laba bersih periode</span><span className="text-green-600">+ {formatIDR(MOCK_LABA_DITAHAN.labaBersih)}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Dividen</span><span className="flex items-center gap-1 text-slds-text-weak"><Minus className="h-3 w-3" /> {formatIDR(MOCK_LABA_DITAHAN.dividen)}</span></div>
          <div className="flex justify-between font-bold pt-2 border-t border-slds-border">
            <span>Saldo akhir</span><span className="text-brand">{formatIDR(MOCK_LABA_DITAHAN.saldoAkhir)}</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "tanggal", label: "Tanggal" },
          { key: "keterangan", label: "Keterangan" },
          { key: "jumlah", label: "Jumlah", render: (r) => formatIDR(Number(r.jumlah)), className: "text-right font-semibold" },
        ]}
        data={MOCK_LABA_DITAHAN.mutasi}
      />
    </div>
  );
}

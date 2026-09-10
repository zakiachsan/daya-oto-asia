import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatIDR } from "@/lib/mock-data";

export default function PerpajakanPage() {
  return (
    <div>
      <PageHeader
        title="Perpajakan"
        desc="PPN keluaran, PPN masukan, dan rekapitulasi SPT"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Perpajakan" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="PPN Neto" value={formatIDR(3150000)} sub="Kurang bayar Masa Agustus" icon={Receipt} color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-bold uppercase text-slds-text-weak">PPN Keluaran</p>
          <p className="text-2xl font-bold text-slds-text mt-1">{formatIDR(4520000)}</p>
          <p className="text-[11px] text-slds-text-weak mt-1">Dari faktur penjualan Agustus</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-bold uppercase text-slds-text-weak">PPN Masukan</p>
          <p className="text-2xl font-bold text-slds-text mt-1">{formatIDR(1370000)}</p>
          <p className="text-[11px] text-slds-text-weak mt-1">Dari faktur pembelian Agustus</p>
        </div>
      </div>

      <div className="mt-4 bg-brand/5 border border-brand/20 rounded-lg p-4">
        <p className="text-[13px] font-bold text-brand">PPN Kurang Bayar: {formatIDR(3150000)}</p>
      </div>
    </div>
  );
}

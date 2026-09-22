import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { MOCK_ARUS_KAS, formatIDR } from "@/lib/mock-data";

export default function ArusKasPage() {
  return (
    <div>
      <PageHeader
        title="Arus Kas"
        desc="Laporan arus kas operasional · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Arus Kas" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Neto Operasional" value={formatIDR(MOCK_ARUS_KAS.neto)} icon={Wallet} color="green" />
        <StatCard label="Kas Masuk" value={formatIDR(MOCK_ARUS_KAS.masuk)} icon={ArrowDownLeft} color="blue" />
        <StatCard label="Kas Keluar" value={formatIDR(MOCK_ARUS_KAS.keluar)} icon={ArrowUpRight} color="red" />
      </div>

      <div className="bg-white border border-slds-border rounded-lg p-4 max-w-xl">
        <h3 className="text-[13px] font-bold text-slds-text mb-3">Arus Kas Operasional</h3>
        <div className="space-y-2">
          {MOCK_ARUS_KAS.rows.map((r) => (
            <div key={r.item} className="flex justify-between text-[13px]">
              <span className="text-slds-text-weak">{r.item}</span>
              <span className={r.jumlah >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {formatIDR(r.jumlah)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatIDR } from "@/lib/mock-data";

export default function ArusKasPage() {
  return (
    <div>
      <PageHeader
        title="Arus Kas"
        desc="Laporan arus kas operasional, investasi, dan pendanaan"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Arus Kas" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Operasional" value={formatIDR(32000000)} icon={Wallet} color="green" />
        <StatCard label="Masuk" value={formatIDR(8300000)} icon={ArrowDownLeft} color="blue" />
        <StatCard label="Keluar" value={formatIDR(8500000)} icon={ArrowUpRight} color="red" />
      </div>

      <div className="bg-white border border-slds-border rounded-lg p-4 max-w-xl space-y-3">
        <h3 className="text-[13px] font-bold text-slds-text">Arus Kas Operasional</h3>
        {[
          { item: "Penerimaan dari bengkel", jumlah: 8300000 },
          { item: "Pembayaran ke pabrik", jumlah: -8500000 },
          { item: "Pembayaran gaji", jumlah: -15000000 },
        ].map((r) => (
          <div key={r.item} className="flex justify-between text-[13px]">
            <span className="text-slds-text-weak">{r.item}</span>
            <span className={r.jumlah >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {formatIDR(r.jumlah)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

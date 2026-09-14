import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Wallet, TrendingUp, CreditCard, Receipt, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatIDR } from "@/lib/mock-data";
import { FinanceJurnalRecent } from "@/components/finance/finance-jurnal-recent";

export default function FinanceDashboard() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard Finance"
        desc="Dashboard keuangan — menu Accurate-style (UI preview)"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Kas & Bank" value={formatIDR(850000000)} sub="Saldo terkini" icon={Wallet} color="green" />
        <StatCard label="Piutang" value={formatIDR(125000000)} sub="3 bengkel belum bayar" icon={ArrowDownLeft} color="blue" />
        <StatCard label="Hutang" value={formatIDR(45000000)} sub="Ke pabrik & vendor" icon={ArrowUpRight} color="orange" />
        <StatCard label="Laba Bulan Ini" value={formatIDR(32000000)} sub="September 2026" icon={TrendingUp} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {[
          { label: "Jurnal Umum", href: "/finance/buku-besar/jurnal-umum", icon: Receipt },
          { label: "Kas & Bank", href: "/finance/kas-bank/pembayaran", icon: CreditCard },
          { label: "Faktur Penjualan", href: "/finance/penjualan/faktur-penjualan", icon: TrendingUp },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white border border-slds-border rounded-lg p-4 hover:border-brand hover:shadow-sm transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50">
              <Icon className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[13px] font-bold text-slds-text">{label}</span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slds-text mb-2">Jurnal Terbaru</h2>
        <FinanceJurnalRecent />
      </div>
    </div>
  );
}

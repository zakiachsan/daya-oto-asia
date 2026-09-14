import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendingUp } from "lucide-react";
import { MOCK_FAKTUR_JUAL, formatIDR } from "@/lib/mock-data";

export default function LaporanPenjualanPage() {
  const posted = MOCK_FAKTUR_JUAL.filter((f) => f.status === "Posted");
  const totalPenjualan = posted.reduce((s, f) => s + f.total, 0);

  return (
    <div>
      <PageHeader
        title="Laporan Penjualan"
        desc="Ringkasan faktur penjualan — UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Laporan Penjualan" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Faktur Posted" value={String(posted.length)} icon={TrendingUp} color="green" />
        <StatCard label="Total Penjualan" value={formatIDR(totalPenjualan)} icon={TrendingUp} color="blue" />
        <StatCard label="Rata-rata/Faktur" value={formatIDR(posted.length ? totalPenjualan / posted.length : 0)} icon={TrendingUp} color="amber" />
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Faktur",
            render: (r) => (
              <Link href={`/finance/penjualan/faktur-penjualan/${String(r.id).toLowerCase()}`} className="font-mono text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "pelanggan", label: "Pelanggan" },
          { key: "periode", label: "Periode OPB" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)), className: "text-right" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={MOCK_FAKTUR_JUAL}
      />
    </div>
  );
}

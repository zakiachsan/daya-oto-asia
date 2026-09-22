import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShoppingCart } from "lucide-react";
import { MOCK_FAKTUR_BELI, formatIDR } from "@/lib/mock-data";

export default function LaporanPembelianPage() {
  const posted = MOCK_FAKTUR_BELI.filter((f) => f.status === "Posted");
  const totalPembelian = posted.reduce((s, f) => s + f.total, 0);

  return (
    <div>
      <PageHeader
        title="Laporan Pembelian"
        desc="Ringkasan faktur pembelian · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Laporan Pembelian" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Faktur Posted" value={String(posted.length)} icon={ShoppingCart} color="orange" />
        <StatCard label="Total Pembelian" value={formatIDR(totalPembelian)} icon={ShoppingCart} color="blue" />
        <StatCard label="Vendor Aktif" value="2" sub="Axalta, Nippon" icon={ShoppingCart} color="amber" />
      </div>

      <DataTable
        columns={[
          { key: "id", label: "No. Faktur", className: "font-mono text-[12px]" },
          { key: "tanggal", label: "Tanggal" },
          { key: "vendor", label: "Vendor" },
          { key: "po", label: "Ref. PO", className: "font-mono text-[12px]" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)), className: "text-right" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={MOCK_FAKTUR_BELI}
      />
    </div>
  );
}

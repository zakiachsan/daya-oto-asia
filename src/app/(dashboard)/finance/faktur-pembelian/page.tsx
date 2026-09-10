import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_FAKTUR_BELI, formatIDR } from "@/lib/mock-data";

export default function FakturPembelianPage() {
  return (
    <div>
      <PageHeader
        title="Faktur Pembelian"
        desc="Invoice dari pabrik/vendor — linked ke PO & Goods Received"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Faktur Pembelian" }]}
      />

      <DataTable
        columns={[
          { key: "id", label: "No. Faktur" },
          { key: "tanggal", label: "Tanggal" },
          { key: "vendor", label: "Vendor / Pabrik" },
          { key: "po", label: "Ref. PO" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={MOCK_FAKTUR_BELI}
      />
    </div>
  );
}

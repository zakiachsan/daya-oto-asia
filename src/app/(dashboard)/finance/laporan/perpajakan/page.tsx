import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Receipt, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MOCK_PPN, formatIDR } from "@/lib/mock-data";

export default function PerpajakanPage() {
  return (
    <div>
      <PageHeader
        title="Perpajakan"
        desc="PPN keluaran, PPN masukan, dan rekapitulasi SPT · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Perpajakan" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>Masa Agustus 2026</option>
            <option>Masa September 2026</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="PPN Keluaran" value={formatIDR(MOCK_PPN.keluaran)} icon={ArrowUpRight} color="green" />
        <StatCard label="PPN Masukan" value={formatIDR(MOCK_PPN.masukan)} icon={ArrowDownLeft} color="blue" />
        <StatCard label="PPN Kurang Bayar" value={formatIDR(MOCK_PPN.neto)} sub="Masa Agustus 2026" icon={Receipt} color="amber" />
      </div>

      <div className="mb-4 bg-brand/5 border border-brand/20 rounded-lg p-4">
        <p className="text-[13px] font-bold text-brand">PPN Neto (Kurang Bayar): {formatIDR(MOCK_PPN.neto)}</p>
        <p className="text-[12px] text-slds-text-weak mt-1">Keluaran {formatIDR(MOCK_PPN.keluaran)} − Masukan {formatIDR(MOCK_PPN.masukan)}</p>
      </div>

      <DataTable
        columns={[
          { key: "no", label: "No. Faktur", className: "font-mono text-[12px]" },
          { key: "tanggal", label: "Tanggal" },
          { key: "pihak", label: "Pihak" },
          { key: "tipe", label: "Tipe" },
          { key: "dpp", label: "DPP", render: (r) => formatIDR(Number(r.dpp)), className: "text-right" },
          {
            key: "ppn",
            label: "PPN",
            render: (r) => (
              <span className={String(r.tipe) === "Keluaran" ? "text-green-600 font-semibold" : "text-blue-600 font-semibold"}>
                {formatIDR(Number(r.ppn))}
              </span>
            ),
            className: "text-right",
          },
        ]}
        data={MOCK_PPN.faktur}
      />
    </div>
  );
}

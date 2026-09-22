import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Scale, ShieldCheck, TrendingUp } from "lucide-react";
import { MOCK_RASIO_KEUANGAN } from "@/lib/mock-data";

export default function RasioKeuanganPage() {
  const baik = MOCK_RASIO_KEUANGAN.filter((r) => r.status === "Baik").length;

  return (
    <div>
      <PageHeader
        title="Rasio Keuangan"
        desc="Analisis kesehatan keuangan · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Rasio Keuangan" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Rasio Dinilai" value={String(MOCK_RASIO_KEUANGAN.length)} sub="6 indikator utama" icon={Scale} color="blue" />
        <StatCard label="Status Baik" value={String(baik)} sub={`dari ${MOCK_RASIO_KEUANGAN.length} rasio`} icon={ShieldCheck} color="green" />
        <StatCard label="Net Profit Margin" value="28.5%" sub="Di atas benchmark" icon={TrendingUp} color="amber" />
      </div>

      <DataTable
        columns={[
          { key: "nama", label: "Rasio", className: "font-semibold" },
          { key: "rumus", label: "Rumus", className: "text-slds-text-weak text-[12px]" },
          { key: "nilai", label: "Nilai", className: "font-mono font-semibold text-brand" },
          { key: "benchmark", label: "Benchmark", className: "text-[12px]" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-green-50 text-green-700">
                {String(r.status)}
              </span>
            ),
          },
        ]}
        data={MOCK_RASIO_KEUANGAN}
      />
    </div>
  );
}

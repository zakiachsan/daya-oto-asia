import Link from "next/link";
import { ExternalLink, Table2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getFinancePlaceholder } from "@/lib/finance-placeholder-config";
import { getFinanceMockPreview, type MockColumnDef } from "@/lib/finance-mock-preview-data";
import { formatIDR } from "@/lib/mock-data";

function renderCell(row: Record<string, unknown>, col: MockColumnDef) {
  const raw = row[col.key];
  if (raw == null || raw === "") return "-";
  switch (col.format) {
    case "idr":
      return formatIDR(Number(raw));
    case "status":
      return <StatusBadge status={String(raw)} />;
    case "number":
      return String(raw);
    default:
      return String(raw);
  }
}

export function FinanceMockPreviewPage({ pathKey }: { pathKey: string }) {
  const meta = getFinancePlaceholder(pathKey);
  const preview = getFinanceMockPreview(pathKey);

  if (!preview) {
    return (
      <div>
        <PageHeader
          title={meta.title}
          desc={meta.desc}
          breadcrumb={[
            { label: "Finance", href: "/finance" },
            { label: meta.section },
            { label: meta.title },
          ]}
        />
        <div className="bg-white border border-slds-border rounded-lg p-8 text-center text-slds-text-weak">
          Mock preview belum dikonfigurasi.
        </div>
      </div>
    );
  }

  const columns = preview.columns.map((col) => ({
    key: col.key,
    label: col.label,
    className: col.className,
    render: (row: Record<string, unknown>) => renderCell(row, col),
  }));

  return (
    <div>
      <PageHeader
        title={meta.title}
        desc={`${meta.desc ?? meta.title} · UI preview (mock data)`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: meta.section },
          { label: meta.title },
        ]}
        actions={
          meta.mirrorHref ? (
            <Link
              href={meta.mirrorHref}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-slds-text hover:bg-slds-bg"
            >
              <ExternalLink className="h-4 w-4" />
              {meta.mirrorLabel ?? "Buka modul terkait"}
            </Link>
          ) : undefined
        }
      />

      {preview.stats && preview.stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {preview.stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={Table2} color={s.color ?? "blue"} />
          ))}
        </div>
      )}

      <DataTable columns={columns} data={preview.rows} />
    </div>
  );
}

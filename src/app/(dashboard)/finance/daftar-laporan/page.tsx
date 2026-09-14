"use client";

import { useMemo, useState } from "react";
import { Search, FileText, Table2, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { REPORT_CATEGORIES, type ReportIcon } from "@/lib/daftar-laporan-data";

function ReportIconView({ type }: { type: ReportIcon }) {
  if (type === "chart") return <BarChart3 className="h-[18px] w-[18px] text-orange-500 shrink-0" />;
  if (type === "grid") return <Table2 className="h-[18px] w-[18px] text-violet-600 shrink-0" />;
  return <FileText className="h-[18px] w-[18px] text-brand shrink-0" />;
}

export default function DaftarLaporanPage() {
  const [activeKey, setActiveKey] = useState(REPORT_CATEGORIES[0].key);
  const [search, setSearch] = useState("");

  const active = REPORT_CATEGORIES.find((c) => c.key === activeKey) ?? REPORT_CATEGORIES[0];

  const reports = useMemo(() => {
    const q = search.toLowerCase();
    return active.reports.filter((r) => !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
  }, [active, search]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daftar Laporan"
        desc="Katalog laporan keuangan Accurate-style — generate & export menyusul"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Daftar Laporan" }]}
        actions={
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slds-text-weak" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 pr-3 text-[13px] border border-slds-border rounded-md w-52"
            />
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 min-h-[480px]">
        <aside className="lg:w-52 shrink-0 bg-white border border-slds-border rounded-lg p-2 space-y-0.5">
          {REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              data-no-toast
              onClick={() => setActiveKey(cat.key)}
              className={`w-full text-left px-3 py-2 rounded-md text-[13px] font-medium transition-colors
                ${cat.key === activeKey ? "bg-brand/10 text-brand font-bold" : "text-slds-text hover:bg-slds-bg"}`}
            >
              {cat.label}
              <span className="text-[10px] text-slds-text-weak ml-1">({cat.reports.length})</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white border border-slds-border rounded-lg p-4">
          <h2 className="text-[15px] font-bold text-slds-text mb-3">{active.label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reports.map((r) => (
              <button
                key={r.title}
                type="button"
                data-no-toast
                className="flex items-start gap-3 p-3 rounded-lg border border-slds-border text-left hover:border-brand/40 hover:bg-slds-bg/50 transition-colors"
              >
                <ReportIconView type={r.icon} />
                <div>
                  <p className="text-[13px] font-semibold text-slds-text">{r.title}</p>
                  <p className="text-[11px] text-slds-text-weak mt-0.5">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {reports.length === 0 && (
            <p className="text-[13px] text-slds-text-weak text-center py-8">Tidak ada laporan cocok.</p>
          )}
        </div>
      </div>
    </div>
  );
}

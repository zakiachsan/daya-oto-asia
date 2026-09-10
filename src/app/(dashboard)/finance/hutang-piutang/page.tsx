"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatIDR } from "@/lib/mock-data";
import { hutangSlug } from "@/lib/hutang-piutang-utils";
import { useHutangPiutang } from "@/lib/preview-store";

export default function HutangPiutangPage() {
  const { items } = useHutangPiutang();
  const [tab, setTab] = useState<"semua" | "piutang" | "hutang">("semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (tab === "piutang" && r.tipe !== "Piutang") return false;
      if (tab === "hutang" && r.tipe !== "Hutang") return false;
      if (!q) return true;
      return r.pihak.toLowerCase().includes(q);
    });
  }, [items, tab, search]);

  const totalPiutang = items.filter((r) => r.tipe === "Piutang").reduce((s, r) => s + r.sisa, 0);
  const totalHutang = items.filter((r) => r.tipe === "Hutang").reduce((s, r) => s + r.sisa, 0);
  const piutangOpen = items.filter((r) => r.tipe === "Piutang" && r.sisa > 0).length;

  return (
    <div>
      <PageHeader
        title="Hutang / Piutang"
        desc="Monitoring AR dari bengkel dan AP ke pabrik — klik pihak untuk detail"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Hutang / Piutang" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <StatCard label="Total Piutang" value={formatIDR(totalPiutang)} sub={`${piutangOpen} belum lunas`} icon={ArrowDownLeft} color="blue" />
        <StatCard label="Total Hutang" value={formatIDR(totalHutang)} sub="Ke supplier" icon={ArrowUpRight} color="orange" />
      </div>

      <div className="flex gap-1 mb-4 border-b border-slds-border">
        {(["semua", "piutang", "hutang"] as const).map((t) => (
          <button type="button"
            key={t}
            data-no-toast onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors capitalize
              ${tab === t ? "border-brand text-brand" : "border-transparent text-slds-text-weak hover:text-slds-text"}`}
          >
            {t === "semua" ? "Semua" : t}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pihak..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "pihak",
            label: "Pihak",
            render: (r) => (
              <Link href={`/finance/hutang-piutang/${hutangSlug(String(r.pihak))}`} className="font-semibold text-brand hover:underline">
                {String(r.pihak)}
              </Link>
            ),
          },
          { key: "tipe", label: "Tipe" },
          { key: "sisa", label: "Sisa", render: (r) => formatIDR(Number(r.sisa)) },
          { key: "jatuhTempo", label: "Jatuh Tempo" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

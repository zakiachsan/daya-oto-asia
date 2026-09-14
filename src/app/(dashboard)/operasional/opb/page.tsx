"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_CABANG, formatIDR, type OpbRow } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { FinanceLinkBadge } from "@/components/finance/finance-link-badge";
import { useFakturJual, useHutangPiutang, useOpbList, useTransaksiList } from "@/lib/preview-store";
import { fakturJualForOpb, getOpbFinanceStatus } from "@/lib/ops-finance-bridge";
import { fakturSlug } from "@/lib/faktur-utils";

function cabangShort(nama: string) {
  return nama.replace(/^Bengkel /, "");
}

const CABANG_OPTIONS = MOCK_CABANG.map((c) => ({
  id: c.id,
  label: cabangShort(c.nama),
}));

const STATUS_FILTER = ["Semua Status", "Draft", "Menunggu TTD", "Rekonsiliasi", "Ditagihkan"];

export default function OPBPage() {
  const { toast } = useToast();
  const { items, add } = useOpbList();
  const { all: transaksi } = useTransaksiList();
  const { all: fakturJual } = useFakturJual();
  const { items: hutang } = useHutangPiutang();
  const [showForm, setShowForm] = useState(false);
  const [periode, setPeriode] = useState("September 2026");
  const [cabang, setCabang] = useState(CABANG_OPTIONS[0].label);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [cabangFilter, setCabangFilter] = useState("Semua Cabang");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((o) => {
      if (statusFilter !== "Semua Status" && o.status !== statusFilter) return false;
      if (cabangFilter !== "Semua Cabang" && !o.cabang.includes(cabangFilter)) return false;
      if (!q) return true;
      return o.id.toLowerCase().includes(q) || o.cabang.toLowerCase().includes(q) || o.periode.toLowerCase().includes(q) || o.sap.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter, cabangFilter]);

  function handleGenerate() {
    const finalized = transaksi.filter(
      (t) => t.status === "Selesai" && t.cabang.includes(cabang),
    );
    const jumlahTrx = finalized.length || Math.floor(Math.random() * 10) + 5;
    const total = finalized.reduce((s, t) => s + t.total, 0) || jumlahTrx * 210000;

    const newOPB: OpbRow = {
      id: `OPB-2026-${String(90 + items.length).padStart(4, "0")}`,
      cabang,
      periode,
      jumlahTrx,
      total,
      status: "Draft",
      sap: "",
    };
    add(newOPB);
    setShowForm(false);
    toast(`OPB ${newOPB.id} digenerate — ${jumlahTrx} trx, ${formatIDR(total)}`, "success");
  }

  const counts = {
    draft: items.filter((o) => o.status === "Draft").length,
    menunggu: items.filter((o) => o.status === "Menunggu TTD").length,
    rekonsiliasi: items.filter((o) => o.status === "Rekonsiliasi").length,
    ditagihkan: items.filter((o) => o.status === "Ditagihkan").length,
  };

  return (
    <div>
      <PageHeader
        title="OPB & Tagihan"
        desc="Order Pembelian Barang — klik no. OPB untuk detail, pipeline & dokumen"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "OPB & Tagihan" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            Generate OPB Bulanan
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Generate OPB Bulanan" onClose={() => setShowForm(false)} onSave={handleGenerate} saveLabel="Generate">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Periode</label>
              <select value={periode} onChange={(e) => setPeriode(e.target.value)} className={`${fieldClass} bg-white`}>
                <option>September 2026</option>
                <option>Agustus 2026</option>
                <option>Juli 2026</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Cabang</label>
              <select value={cabang} onChange={(e) => setCabang(e.target.value)} className={`${fieldClass} bg-white`}>
                {CABANG_OPTIONS.map((c) => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slds-text-weak mt-3">
            OPB di-generate dari transaksi Selesai cabang terpilih. Pipeline: Draft → TTD Admin Cabang → Rekonsiliasi HO → SAP → Ditagihkan.
          </p>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Draft", count: counts.draft, color: "border-slds-border bg-slds-bg" },
          { label: "Menunggu TTD", count: counts.menunggu, color: "border-amber-200 bg-amber-50" },
          { label: "Rekonsiliasi", count: counts.rekonsiliasi, color: "border-blue-200 bg-blue-50" },
          { label: "Ditagihkan", count: counts.ditagihkan, color: "border-green-200 bg-green-50" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-lg p-4 ${s.color}`}>
            <p className="text-[11px] font-bold uppercase text-slds-text-weak">{s.label}</p>
            <p className="text-2xl font-bold text-slds-text mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. OPB, cabang, SAP..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
        >
          {STATUS_FILTER.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select
          value={cabangFilter}
          onChange={(e) => setCabangFilter(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
        >
          {["Semua Cabang", ...CABANG_OPTIONS.map((c) => c.label)].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. OPB",
            render: (r) => (
              <Link href={`/operasional/opb/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "cabang", label: "Cabang" },
          { key: "periode", label: "Periode" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
          {
            key: "finance",
            label: "Finance",
            render: (r) => {
              const status = getOpbFinanceStatus(String(r.id), fakturJual, hutang);
              const faktur = fakturJualForOpb(String(r.id), fakturJual);
              return (
                <FinanceLinkBadge
                  status={status}
                  href={
                    faktur
                      ? `/finance/penjualan/faktur-penjualan/${fakturSlug(faktur.id)}`
                      : r.status === "Ditagihkan"
                        ? "/finance/penjualan/faktur-penjualan"
                        : undefined
                  }
                />
              );
            },
          },
        ]}
        data={filtered}
      />
    </div>
  );
}

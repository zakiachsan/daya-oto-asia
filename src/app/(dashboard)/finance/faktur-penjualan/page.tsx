"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { fakturSlug, type FakturJualRow } from "@/lib/faktur-utils";
import { useToast } from "@/components/ui/toast";
import { useFakturJual, useOpbList } from "@/lib/preview-store";

export default function FakturPenjualanPage() {
  const { toast } = useToast();
  const { items: opbList } = useOpbList();
  const { all: items, add } = useFakturJual();
  const [showForm, setShowForm] = useState(false);
  const ditagihkan = opbList.filter((o) => o.status === "Ditagihkan");
  const [opbId, setOpbId] = useState(ditagihkan[0]?.id ?? opbList[0]?.id ?? "");

  const selectedOPB = opbList.find((o) => o.id === opbId);

  function handleGenerate() {
    if (!selectedOPB) return;
    const newInv: FakturJualRow = {
      id: `INV-2026-${String(89 + items.length).padStart(4, "0")}`,
      tanggal: new Date().toISOString().slice(0, 10),
      pelanggan: selectedOPB.cabang,
      periode: selectedOPB.periode,
      total: selectedOPB.total,
      status: "Draft",
      opbId: selectedOPB.id,
    };
    add(newInv);
    setShowForm(false);
    toast(`Faktur ${newInv.id} digenerate dari ${opbId}`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Faktur Penjualan"
        desc="Tagihan bulanan ke bengkel mitra — klik no. faktur untuk detail & rekap"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Faktur Penjualan" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Generate dari OPB
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Generate Faktur dari OPB" onClose={() => setShowForm(false)} onSave={handleGenerate} saveLabel="Generate Faktur">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Pilih OPB</label>
              <select value={opbId} onChange={(e) => setOpbId(e.target.value)} className={`${fieldClass} bg-white`}>
                {opbList.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} — {o.cabang} ({o.status})</option>
                ))}
              </select>
            </div>
            {selectedOPB && (
              <div>
                <label className={labelClass}>Total OPB</label>
                <input disabled value={formatIDR(selectedOPB.total)} className={`${fieldClass} bg-slds-bg font-semibold`} />
              </div>
            )}
          </div>
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Faktur",
            render: (r) => (
              <Link href={`/finance/faktur-penjualan/${fakturSlug(String(r.id))}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "pelanggan", label: "Pelanggan / Bengkel" },
          { key: "periode", label: "Periode OPB" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={items}
      />
    </div>
  );
}

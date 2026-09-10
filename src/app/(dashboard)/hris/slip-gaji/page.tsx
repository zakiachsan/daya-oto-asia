"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { buildAllSlips, MONTHS, slipSlug } from "@/lib/slip-gaji-utils";
import { useToast } from "@/components/ui/toast";

export default function SlipGajiPage() {
  const { toast } = useToast();
  const [month, setMonth] = useState(8);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const items = useMemo(() => buildAllSlips(month, finalized), [month, finalized]);

  function handleFinalize() {
    setFinalized(true);
    setShowConfirm(false);
    toast(`Slip gaji ${MONTHS[month]} 2026 di-finalize (preview)`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Slip Gaji"
        desc="Batch payroll — klik nama karyawan untuk breakdown lengkap"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Slip Gaji" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowConfirm(true)}
            disabled={finalized}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Finalize Bulan Ini
          </button>
        }
      />

      {showConfirm && (
        <ActionFormPanel title={`Finalize Slip Gaji — ${MONTHS[month]} 2026`} onClose={() => setShowConfirm(false)} onSave={handleFinalize} saveLabel="Ya, Finalize">
          <p className="text-[13px] text-slds-text">Perhitungan: gaji pokok + tunjangan + lembur (PP 35/2021) − potongan telat/alpha − PPh21.</p>
          <p className="text-[12px] text-slds-text-weak mt-2">{items.length} karyawan · Total {formatIDR(items.reduce((s, r) => s + r.bersih, 0))}</p>
        </ActionFormPanel>
      )}

      <div className="flex items-center justify-between mb-4 bg-white border border-slds-border rounded-lg p-3">
        <button type="button" data-no-toast onClick={() => setMonth((m) => Math.max(0, m - 1))} className="p-2 hover:bg-slds-bg rounded-md">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[14px] font-bold text-slds-text">{MONTHS[month]} 2026</span>
        <button type="button" data-no-toast onClick={() => setMonth((m) => Math.min(11, m + 1))} className="p-2 hover:bg-slds-bg rounded-md">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DataTable
        columns={[
          {
            key: "nama",
            label: "Karyawan",
            render: (r) => (
              <Link href={`/hris/slip-gaji/${slipSlug(String(r.nama))}`} className="font-semibold text-brand hover:underline">
                {String(r.nama)}
              </Link>
            ),
          },
          { key: "cabang", label: "Cabang" },
          { key: "bersih", label: "Gaji Bersih", render: (r) => <span className="font-bold">{formatIDR(Number(r.bersih))}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={items}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { useFakturBeli, useHutangPiutang, useJurnalList, usePoList } from "@/lib/preview-store";
import { ensureHutangFromFakturBeli } from "@/lib/finance-payment-utils";
import { postWithJurnal } from "@/lib/jurnal-post-utils";
import { buildFakturBeliFromPo, fakturBeliForPo } from "@/lib/ops-finance-bridge";
import type { FakturBeliRow } from "@/lib/faktur-beli-utils";
import { useToast } from "@/components/ui/toast";

export default function FakturPembelianPage() {
  const { toast } = useToast();
  const { all, add, update } = useFakturBeli();
  const { items: poList } = usePoList();
  const { items: hutangItems, replaceAll } = useHutangPiutang();
  const { all: jurnalList, add: addJurnal } = useJurnalList();
  const [showForm, setShowForm] = useState(false);

  const eligiblePo = poList.filter(
    (p) => p.status === "Selesai" && p.gr && !fakturBeliForPo(p.id, all),
  );
  const [poId, setPoId] = useState(eligiblePo[0]?.id ?? "");
  const selectedPo = poList.find((p) => p.id === poId);

  function handleGenerate() {
    if (!selectedPo) {
      toast("Pilih PO yang sudah GR", "error");
      return;
    }
    if (fakturBeliForPo(selectedPo.id, all)) {
      toast("PO sudah punya faktur pembelian", "error");
      return;
    }
    const row = buildFakturBeliFromPo(selectedPo, all.length + 1);
    add(row);
    setShowForm(false);
    toast(`Faktur ${row.id} digenerate dari ${selectedPo.id}`, "success");
  }

  function handlePost(id: string) {
    const row = all.find((f) => f.id === id);
    if (!row) return;
    const posted = { ...row, status: "Posted" as const };
    const jurnalId = postWithJurnal("faktur-beli", posted, { jurnalList, addJurnal });
    update(id, { status: "Posted", jurnalId });
    replaceAll(ensureHutangFromFakturBeli(hutangItems, posted));
    toast(`Faktur ${id} di-posting · jurnal ${jurnalId}`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Faktur Pembelian"
        desc="Invoice dari pabrik/vendor · generate dari PO selesai + GR"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Pembelian" },
          { label: "Faktur Pembelian" },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Generate dari PO
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel
          title="Generate Faktur dari PO"
          onClose={() => setShowForm(false)}
          onSave={handleGenerate}
          saveLabel="Generate Faktur"
        >
          {eligiblePo.length === 0 ? (
            <p className="text-[13px] text-slds-text-weak">
              Tidak ada PO selesai dengan GR yang belum difakturkan.{" "}
              <Link href="/operasional/po" className="text-brand font-semibold hover:underline">
                Cek PO & Penerimaan
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Pilih PO (sudah GR)</label>
                <select value={poId} onChange={(e) => setPoId(e.target.value)} className={`${fieldClass} bg-white`}>
                  {eligiblePo.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} · {p.supplier} ({p.gr})
                    </option>
                  ))}
                </select>
              </div>
              {selectedPo && (
                <div>
                  <label className={labelClass}>Total PO</label>
                  <input disabled value={formatIDR(selectedPo.total)} className={`${fieldClass} bg-slds-bg font-semibold`} />
                </div>
              )}
            </div>
          )}
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Faktur",
            className: "font-mono text-[12px]",
            render: (r) => (
              <Link href={`/operasional/po/${String((r as FakturBeliRow).po)}`} className="font-mono text-brand hover:underline" title="Lihat PO">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "vendor", label: "Vendor / Pabrik" },
          {
            key: "po",
            label: "Ref. PO",
            className: "font-mono text-[12px]",
            render: (r) => (
              <Link href={`/operasional/po/${String(r.po)}`} className="text-brand hover:underline">
                {String(r.po)}
              </Link>
            ),
          },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)), className: "text-right" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
          {
            key: "aksi",
            label: "Aksi",
            render: (r) => (
              <div className="flex items-center gap-2">
                {r.status === "Draft" && (
                  <button
                    type="button"
                    data-no-toast
                    onClick={() => handlePost(String(r.id))}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold bg-brand text-white rounded hover:bg-brand-dark"
                  >
                    <Send className="h-3 w-3" /> Post
                  </button>
                )}
                {r.status === "Posted" && (
                  <Link
                    href={`/finance/pembelian/pembayaran-pembelian?faktur=${encodeURIComponent(String(r.id))}`}
                    className="text-[11px] font-semibold text-brand hover:underline"
                  >
                    Bayar
                  </Link>
                )}
              </div>
            ),
          },
        ]}
        data={all}
      />
    </div>
  );
}

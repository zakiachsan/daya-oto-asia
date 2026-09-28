"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR, MOCK_CABANG } from "@/lib/mock-data";
import { fakturSlug, fakturStatusView } from "@/lib/faktur-utils";
import { opbSiapInvoice, opbStatusLabel } from "@/lib/opb-utils";
import { useToast } from "@/components/ui/toast";
import { useFakturJual, useHutangPiutang, useOpbList, useTransaksiList } from "@/lib/preview-store";
import { buildFakturUntukOpb } from "@/lib/finance-invoice-batch-utils";
import { piutangForFaktur } from "@/lib/finance-payment-utils";

export default function FakturPenjualanPage() {
  const { toast } = useToast();
  const { items: opbList, patch: patchOpb } = useOpbList();
  const { all: items, add } = useFakturJual();
  const { items: hutangItems } = useHutangPiutang();
  const { all: transaksi } = useTransaksiList();
  const [showForm, setShowForm] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [batchCabang, setBatchCabang] = useState(MOCK_CABANG[0].nama.replace(/^Bengkel /, ""));
  const [batchDari, setBatchDari] = useState("2026-09-01");
  const [batchSampai, setBatchSampai] = useState("2026-09-30");
  const ditagihkan = opbList.filter((o) => o.status === "Ditagihkan");
  const [opbId, setOpbId] = useState(ditagihkan[0]?.id ?? opbList[0]?.id ?? "");

  const selectedOPB = opbList.find((o) => o.id === opbId);
  const opbBatch = opbList.filter(
    (o) =>
      o.cabang.includes(batchCabang) &&
      (o.tanggalOpb ?? "") >= batchDari &&
      (o.tanggalOpb ?? "") <= batchSampai &&
      opbSiapInvoice(o, items),
  );

  function simpanFaktur(opbTerpilih: typeof opbList) {
    const fakturBaru = buildFakturUntukOpb(opbTerpilih, items);
    fakturBaru.forEach((f) => add(f));
    /* OPB masuk penagihan · dari sisi Ops tampil sebagai "masuk faktur penjualan" */
    opbTerpilih.forEach((o) => patchOpb(o.id, { status: "Ditagihkan" }));
    return fakturBaru;
  }

  function handleGenerate() {
    if (!selectedOPB) return;
    if (!opbSiapInvoice(selectedOPB, items)) {
      toast(`${selectedOPB.id} sudah punya faktur · pakai Proses Invoice per cabang untuk OPB lain`, "error");
      return;
    }
    const [baru] = simpanFaktur([selectedOPB]);
    setShowForm(false);
    toast(`Faktur ${baru.id} digenerate dari ${opbId} · cetak Faktur + Rekap di detail`, "success");
  }

  function handleBatch() {
    if (opbBatch.length === 0) {
      toast("Tidak ada OPB terbit yang belum difakturkan di rentang itu", "error");
      return;
    }
    const fakturBaru = simpanFaktur(opbBatch);
    setShowBatch(false);
    toast(`${fakturBaru.length} faktur digenerate (1 faktur per OPB) · ${fakturBaru.map((f) => f.id).join(", ")}`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Faktur Penjualan"
        desc="Tagihan bulanan ke bengkel mitra - klik no. faktur untuk detail, rekonsiliasi & cetak 2 dokumen"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Penjualan" },
          { label: "Faktur Penjualan" },
        ]}
        actions={
          <div className="flex gap-2">
            <Link
              href="/finance/penjualan/proses-invoice"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-brand text-brand rounded-md text-[13px] font-semibold hover:bg-slds-bg"
            >
              <Receipt className="h-4 w-4" /> Proses Invoice per Cabang
            </Link>
            <button
              type="button"
              data-no-toast
              onClick={() => { setShowBatch(!showBatch); setShowForm(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-brand text-brand rounded-md text-[13px] font-semibold"
            >
              Batch Cabang + Periode
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() => { setShowForm(!showForm); setShowBatch(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" /> Generate dari OPB
            </button>
          </div>
        }
      />

      {showBatch && (
        <ActionFormPanel
          title="Generate Faktur · Cabang + Periode OPB (#57)"
          onClose={() => setShowBatch(false)}
          onSave={handleBatch}
          saveLabel={`Generate (${opbBatch.length} OPB)`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Cabang</label>
              <select value={batchCabang} onChange={(e) => setBatchCabang(e.target.value)} className={`${fieldClass} bg-white`}>
                {MOCK_CABANG.map((c) => (
                  <option key={c.id} value={c.nama.replace(/^Bengkel /, "")}>{c.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Dari (Tgl. OPB)</label>
              <input type="date" value={batchDari} onChange={(e) => setBatchDari(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Sampai</label>
              <input type="date" value={batchSampai} onChange={(e) => setBatchSampai(e.target.value)} className={fieldClass} />
            </div>
          </div>
          <p className="text-[12px] text-slds-text-weak mt-3">
            {opbBatch.length === 0
              ? "Tidak ada OPB terbit yang belum difakturkan di rentang ini."
              : `${opbBatch.length} OPB siap invoice · total ${formatIDR(opbBatch.reduce((s, o) => s + o.total, 0))} · 1 faktur per OPB (bukan dibagi)`}
            {" · "}Rekap Invoice tetap dicetak dari detail faktur sebagai lampiran.
          </p>
        </ActionFormPanel>
      )}

      {showForm && (
        <ActionFormPanel title="Generate Faktur dari OPB" onClose={() => setShowForm(false)} onSave={handleGenerate} saveLabel="Generate Faktur">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Pilih OPB Terbit</label>
              <select value={opbId} onChange={(e) => setOpbId(e.target.value)} className={`${fieldClass} bg-white`}>
                {opbList.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.cabang} ({opbStatusLabel(o.status)}){opbSiapInvoice(o, items) ? "" : " · sudah difakturkan"}
                  </option>
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
          {selectedOPB && !opbSiapInvoice(selectedOPB, items) && (
            <p className="text-[12px] text-amber-700 mt-3">OPB ini sudah punya faktur · hapus dulu kalau mau generate ulang.</p>
          )}
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Faktur",
            render: (r) => (
              <Link href={`/finance/penjualan/faktur-penjualan/${fakturSlug(String(r.id))}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "jenis", label: "Format", render: (r) => String(r.jenis ?? "Faktur") },
          { key: "pelanggan", label: "Pelanggan / Bengkel" },
          { key: "periode", label: "Periode OPB" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)) },
          {
            key: "status",
            label: "Status",
            render: (r) => {
              const faktur = items.find((f) => f.id === r.id)!;
              return <StatusBadge status={fakturStatusView(faktur, piutangForFaktur(hutangItems, faktur))} />;
            },
          },
        ]}
        data={items}
      />
    </div>
  );
}

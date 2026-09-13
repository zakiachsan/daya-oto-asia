"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Printer, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { OpbPreview, printOpbPreview } from "@/components/ui/opb-preview";
import { formatIDR, type OpbRow } from "@/lib/mock-data";
import { getOpbTransaksi, OPB_PIPELINE } from "@/lib/opb-utils";
import { useOpbList, useTransaksiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function OpbDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, updateStatus, setSap } = useOpbList();
  const { all: transaksi } = useTransaksiList();
  const opb = items.find((o) => o.id === id);
  const [sapInput, setSapInput] = useState(opb?.sap ?? "");

  if (!opb) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">OPB tidak ditemukan</p>
        <Link href="/operasional/opb" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = opb;
  const linkedTrx = getOpbTransaksi(row, transaksi);
  const pipelineIdx = OPB_PIPELINE.findIndex((p) => p.status === row.status);

  function advancePipeline() {
    if (row.status === "Draft") {
      updateStatus(row.id, "Menunggu TTD");
      toast(`${row.id} dikirim ke Admin Cabang untuk TTD`, "success");
    } else if (row.status === "Menunggu TTD") {
      updateStatus(row.id, "Rekonsiliasi");
      toast(`${row.id} diforward ke HO — masuk rekonsiliasi`, "success");
    }
  }

  function handleSaveSap() {
    if (!sapInput.trim()) {
      toast("No. SAP wajib diisi", "error");
      return;
    }
    setSap(row.id, sapInput.trim());
    toast(`SAP ${sapInput.trim()} tersimpan — OPB ditagihkan`, "success");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.cabang} · ${row.periode}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "OPB & Tagihan", href: "/operasional/opb" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/operasional/opb" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-3">
          <h3 className="text-[13px] font-bold text-slds-text">Ringkasan</h3>
          <div className="text-[13px] space-y-2">
            <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span className="font-semibold">{row.cabang}</span></div>
            <div className="flex justify-between"><span className="text-slds-text-weak">Periode</span><span className="font-semibold">{row.periode}</span></div>
            <div className="flex justify-between"><span className="text-slds-text-weak">Jumlah Trx</span><span className="font-semibold">{row.jumlahTrx}</span></div>
            <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
              <span>Total Tagihan</span><span className="text-brand">{formatIDR(row.total)}</span>
            </div>
            {row.sap && (
              <div className="flex justify-between"><span className="text-slds-text-weak">No. SAP</span><span className="font-mono font-semibold">{row.sap}</span></div>
            )}
          </div>

          <div className="pt-3 border-t border-slds-border space-y-2">
            {(row.status === "Draft" || row.status === "Menunggu TTD") && (
              <button
                type="button"
                data-no-toast
                onClick={advancePipeline}
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold"
              >
                {row.status === "Draft" ? "Kirim TTD Admin Cabang" : "Forward ke HO"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            {row.status === "Rekonsiliasi" && (
              <div className="space-y-2">
                <input
                  placeholder="SAP-2026-..."
                  value={sapInput}
                  onChange={(e) => setSapInput(e.target.value)}
                  className="w-full px-2 py-2 border border-slds-border rounded-md text-[13px] font-mono"
                />
                <button
                  type="button"
                  data-no-toast
                  onClick={handleSaveSap}
                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-[12px] font-semibold"
                >
                  <Save className="h-3.5 w-3.5" /> Simpan SAP & Tagihkan
                </button>
              </div>
            )}
            <button
              type="button"
              data-no-toast
              onClick={() => { printOpbPreview(); toast("OPB dicetak", "success"); }}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak Rekap Bulanan
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Pipeline Status</h3>
          {OPB_PIPELINE.map((step, i) => {
            const done = i <= pipelineIdx;
            const active = i === pipelineIdx;
            return (
              <div key={step.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-[12px] font-bold ${done ? "bg-brand text-white" : "bg-slds-bg border border-slds-border text-slds-text-weak"}`}>
                    {i + 1}
                  </div>
                  {i < OPB_PIPELINE.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] ${done ? "bg-brand/30" : "bg-slds-border"}`} />}
                </div>
                <div className="pb-4 pt-0.5">
                  <p className={`text-[13px] font-semibold ${active ? "text-brand" : done ? "text-slds-text" : "text-slds-text-weak"}`}>{step.label}</p>
                  <p className="text-[11px] text-slds-text-weak">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">
            Transaksi Terkait ({linkedTrx.length} ditampilkan)
          </h3>
          {linkedTrx.length === 0 ? (
            <p className="text-[12px] text-slds-text-weak">Belum ada transaksi ter-link ke OPB ini.</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                  <th className="pb-2 font-semibold">No. Trx</th>
                  <th className="pb-2 font-semibold">Warna</th>
                  <th className="pb-2 font-semibold">Tinter</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {linkedTrx.map((t) => (
                  <tr key={t.id} className="border-b border-slds-border last:border-0">
                    <td className="py-2">
                      <Link href={`/operasional/transaksi/${t.id}`} className="font-mono font-semibold text-brand hover:underline">{t.id}</Link>
                    </td>
                    <td className="py-2">{t.warna}</td>
                    <td className="py-2 text-slds-text-weak">{t.tinter}</td>
                    <td className="py-2 text-right font-semibold">{formatIDR(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {linkedTrx.length < row.jumlahTrx && (
            <p className="text-[11px] text-slds-text-weak mt-2 italic">
              + {row.jumlahTrx - linkedTrx.length} transaksi lainnya di periode {row.periode}
            </p>
          )}
        </div>

        <div className="max-w-xl">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Preview Rekap OPB Bulanan</h3>
          <OpbPreview opb={row} transaksi={transaksi} />
        </div>
      </div>
    </div>
  );
}

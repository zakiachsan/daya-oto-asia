"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Car, Paintbrush, Printer, PenLine, FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR, formatWaktu, formatDurasi, type TransaksiRow } from "@/lib/mock-data";
import { NotaPreview, printNotaPreview } from "@/components/ui/nota-preview";
import { NotaPenjualanPreview, printNotaPenjualanPreview } from "@/components/ui/nota-penjualan-preview";
import { SapOpbPreview, printSapOpbPreview } from "@/components/ui/sap-opb-preview";
import { useNotaPrint, useTransaksiList } from "@/lib/preview-store";
import { CetakNotaAudit } from "@/components/ui/cetak-nota-audit";
import { useToast } from "@/components/ui/toast";
import { canActorUpdateStatus, nextTransaksiStatus, normalizeTransaksiStatus } from "@/lib/transaksi-status-utils";
import { useState } from "react";

export default function TransaksiDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { all, update } = useTransaksiList();
  const { recordPrint, byTrxId } = useNotaPrint();
  const trx = all.find((t) => t.id === id);
  const auditLogs = byTrxId(id);
  const [opbInput, setOpbInput] = useState("");
  const trxStatus = trx ? normalizeTransaksiStatus(trx.status) : "Draft";

  if (!trx) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Transaksi tidak ditemukan</p>
        <Link href="/operasional/transaksi" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = trx;
  const totalGram = row.bahan.reduce((s, b) => s + b.gram, 0);
  const canTambahBahan = trxStatus === "Draft" || trxStatus === "Cetak Nota";

  const timeline = [
    { label: "Mulai Transaksi", waktu: trx.waktuMulai, icon: Paintbrush, done: true },
    { label: "Selesai Mixing", waktu: trx.waktuSelesaiMixing, icon: Clock, done: !!trx.waktuSelesaiMixing },
    { label: "Cetak Nota", waktu: trx.waktuCetakNota, icon: Printer, done: !!trx.waktuCetakNota },
    { label: "TTD GH", waktu: trx.waktuTTD, icon: PenLine, done: !!trx.waktuTTD },
    { label: "Menunggu OPB", waktu: trxStatus !== "Draft" && trxStatus !== "Cetak Nota" && trxStatus !== "TTD GH" ? trx.waktuTTD : null, icon: FileText, done: ["Menunggu OPB", "OPB Terbit", "Proses Invoice", "Selesai"].includes(trxStatus) },
    { label: "OPB Terbit", waktu: trx.opbId ? trx.waktuCetakNota : null, icon: FileText, done: ["OPB Terbit", "Proses Invoice", "Selesai"].includes(trxStatus) },
  ];

  const penambahan = all.filter((t) => t.parentId === trx.id);

  function advanceAdminStatus() {
    const next = nextTransaksiStatus(trxStatus, "admin");
    if (!next) return;
    const patch: Partial<TransaksiRow> = { status: next };
    if (next === "OPB Terbit" && opbInput.trim()) {
      patch.opbId = opbInput.trim();
    }
    update(row.id, patch);
    toast(`Status → ${next}`, "success");
  }

  return (
    <div>
      <PageHeader
        title={trx.warna}
        desc={`${trx.id} · ${trx.tanggal}${trx.parentId ? ` · Penambahan dari ${trx.parentId}` : ""}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Transaksi", href: "/operasional/transaksi" },
          { label: trx.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => {
                printSapOpbPreview();
                toast("OPB SAP dicetak", "success");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <FileText className="h-3.5 w-3.5" /> Cetak OPB SAP
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() => {
                printNotaPenjualanPreview();
                toast("Nota penjualan dicetak", "success");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <FileText className="h-3.5 w-3.5" /> Cetak Nota Penjualan
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() => {
                const isReprint = recordPrint(trx.id, trx.tinter, trx.cabang, "Admin HO");
                printNotaPreview();
                toast(isReprint ? "Cetak ulang tercatat di audit log" : "Nota pemakaian dicetak", isReprint ? "error" : "success");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak Nota Pemakaian
            </button>
            <StatusBadge status={trx.status} />
          </div>
        }
      />

      <Link href="/operasional/transaksi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      {(trxStatus === "Menunggu OPB" || canActorUpdateStatus(trxStatus, "admin")) && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
          <h3 className="text-[13px] font-bold text-amber-900">Admin / Supervisor · OPB & Status</h3>
          {trxStatus === "Menunggu OPB" && (
            <div className="flex gap-2 flex-wrap items-end">
              <label className="flex-1 min-w-[200px]">
                <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Nomor OPB (input manual)</span>
                <input
                  value={opbInput}
                  onChange={(e) => setOpbInput(e.target.value)}
                  placeholder="OPB-2026-xxxx"
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]"
                />
              </label>
            </div>
          )}
          {canActorUpdateStatus(trxStatus, "admin") && (
            <button
              type="button"
              data-no-toast
              onClick={advanceAdminStatus}
              disabled={trxStatus === "Menunggu OPB" && !opbInput.trim() && !trx.opbId}
              className="px-4 py-2 bg-brand text-white rounded-md text-[12px] font-semibold disabled:opacity-50"
            >
              {trxStatus === "Menunggu OPB" ? "Terbitkan OPB" : trxStatus === "OPB Terbit" ? "Proses Invoice" : "Tandai Selesai"}
            </button>
          )}
          {trx.receiptId && (
            <p className="text-[11px] text-slds-text-weak">Receipt ID: <span className="font-mono font-bold">{trx.receiptId}</span></p>
          )}
        </div>
      )}

      {canTambahBahan && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between gap-3">
          <p className="text-[12px] text-blue-800">Transaksi belum di-lock · bisa tambah bahan ke mobil yang sama</p>
          <Link
            href={`/app/transaksi/baru?parent=${encodeURIComponent(trx.id)}&mobil=${encodeURIComponent(trx.mobil)}&warna=${encodeURIComponent(trx.warna)}`}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-brand text-white rounded-md text-[12px] font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Bahan
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-brand" />
            <h3 className="text-[13px] font-bold text-slds-text">Durasi Pengerjaan</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slds-text-weak font-semibold">Durasi Mixing</p>
              <p className="text-2xl font-bold text-brand mt-1">{formatDurasi(trx.durasiMixingMenit)}</p>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slds-text-weak">Mulai</span>
              <span className="font-semibold">{formatWaktu(trx.waktuMulai)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slds-text-weak">Selesai Mixing</span>
              <span className="font-semibold">{formatWaktu(trx.waktuSelesaiMixing)}</span>
            </div>
            <div className="flex justify-between text-[13px] pt-2 border-t border-slds-border">
              <span className="text-slds-text-weak">Durasi Total</span>
              <span className="font-bold">{formatDurasi(trx.durasiTotalMenit)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
            <div><span className="text-slds-text-weak">Cabang</span><p className="font-semibold">{trx.cabang}</p></div>
            <div><span className="text-slds-text-weak">Tinter</span><p className="font-semibold">{trx.tinter}</p></div>
            <div><span className="text-slds-text-weak">Kode Warna</span><p className="font-mono font-bold">{trx.kodeWarna}</p></div>
            <div><span className="text-slds-text-weak">Kategori</span><p className="font-semibold">{trx.kategori}</p></div>
            <div className="sm:col-span-2 flex items-start gap-2 pt-2 border-t border-slds-border">
              <Car className="h-4 w-4 text-slds-text-weak shrink-0 mt-0.5" />
              <div><p className="font-semibold">{trx.mobil}</p><p className="text-[11px] text-slds-text-weak">{trx.platNomor}</p></div>
            </div>
            <div className="sm:col-span-2 flex justify-between pt-2 border-t border-slds-border font-bold">
              <span>Total Tagihan</span><span className="text-brand">{formatIDR(trx.total)}</span>
            </div>
            {trx.opbId && (
              <div className="sm:col-span-2 flex items-center gap-2 text-[12px]">
                <FileText className="h-3.5 w-3.5 text-slds-text-weak" />
                <Link href="/operasional/opb" className="text-brand font-semibold hover:underline">{trx.opbId}</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {penambahan.length > 0 && (
        <div className="mb-4 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Penambahan Bahan Terkait</h3>
          {penambahan.map((p) => (
            <Link key={p.id} href={`/operasional/transaksi/${p.id}`} className="flex justify-between py-2 border-b border-slds-border last:border-0 text-[13px] hover:text-brand">
              <span>{p.id} · {p.warna}</span>
              <span className="font-semibold">{formatDurasi(p.durasiMixingMenit)}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mb-4 overflow-x-auto">
        <h3 className="text-[13px] font-bold text-slds-text mb-2">Preview OPB SAP (One Time Material)</h3>
        <SapOpbPreview trx={trx} />
      </div>

      <div className="mb-4 overflow-x-auto">
        <h3 className="text-[13px] font-bold text-slds-text mb-2">Preview Nota Penjualan</h3>
        <NotaPenjualanPreview trx={trx} />
      </div>

      <div className="mb-4 overflow-x-auto">
        <h3 className="text-[13px] font-bold text-slds-text mb-2">Preview Nota Pemakaian (DOA Cabang Bogor)</h3>
        <NotaPreview trx={trx} />
      </div>

      <div className="mb-4 bg-white border border-slds-border rounded-lg p-4 max-w-xl">
        <h3 className="text-[13px] font-bold text-slds-text mb-2">Audit Cetak Nota</h3>
        <CetakNotaAudit logs={auditLogs} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Timeline Transaksi</h3>
          {timeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${step.done ? "bg-brand text-white" : "bg-slds-bg border border-slds-border text-slds-text-weak"}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {i < timeline.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] ${step.done ? "bg-brand/30" : "bg-slds-border"}`} />}
                </div>
                <div className="pb-4 pt-1">
                  <p className={`text-[13px] font-semibold ${step.done ? "text-slds-text" : "text-slds-text-weak"}`}>{step.label}</p>
                  <p className="text-[11px] text-slds-text-weak">{formatWaktu(step.waktu)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-slds-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-slds-text">Bahan Digunakan</h3>
            <span className="text-[11px] text-slds-text-weak">{totalGram} gr</span>
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {trx.bahan.map((b) => (
                <tr key={b.kode} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{b.kode}</td>
                  <td className="py-2 text-slds-text-weak">{b.nama}</td>
                  <td className="py-2 text-right font-semibold">{b.gram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

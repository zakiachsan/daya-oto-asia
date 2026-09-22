"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, X, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ajuanStatusBadge } from "@/lib/ajuan-stok-utils";
import { useAjuanStok } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function AjuanStokDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, updateStatus, update } = useAjuanStok();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Ajuan stok tidak ditemukan</p>
        <Link href="/operasional/ajuan-stok" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  const timeline = [
    { label: "Diajukan Tinter", done: true, detail: `${row.tanggal} · ${row.tinter}` },
    { label: "Menunggu Approval Pusat", done: row.status !== "Menunggu", active: row.status === "Menunggu" },
    {
      label: row.status === "Ditolak" ? "Ditolak" : "Disetujui",
      done: row.status === "Disetujui" || row.status === "Ditolak",
      active: row.status === "Disetujui" || row.status === "Ditolak",
    },
    { label: "PO / Distribusi", done: !!row.refPo || !!row.refDistribusi, detail: row.refPo ?? row.refDistribusi },
  ];

  function handleApprove() {
    const refPo = `PO-2026-${String(40 + items.length).padStart(3, "0")}`;
    updateStatus(row.id, "Disetujui");
    update(row.id, { catatanApprover: "Disetujui · stok cabang kritis", refPo });
    toast(`Ajuan disetujui · ${refPo} bisa diproses`, "success");
  }

  function handleReject() {
    updateStatus(row.id, "Ditolak");
    update(row.id, { catatanApprover: "Ditolak · stok pusat terbatas, tunggu distribusi minggu depan" });
    toast("Ajuan stok ditolak", "error");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.produk} · ${row.cabang}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Ajuan Stok", href: "/operasional/ajuan-stok" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={ajuanStatusBadge(row.status)} />}
      />

      <Link href="/operasional/ajuan-stok" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Detail Permintaan</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tinter</span><span className="font-semibold">{row.tinter}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span>{row.cabang}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Produk</span><span>{row.produk}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Qty Diminta</span><span className="font-bold">{row.qty} kaleng</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Stok Saat Ini</span><span className="text-red-600 font-semibold">{row.stokSaatIni}</span></div>
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Alasan</p>
            <p className="text-[12px]">{row.alasan}</p>
          </div>
          {row.catatanApprover && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan Approver</p>
              <p className="text-[12px]">{row.catatanApprover}</p>
            </div>
          )}
          {row.refPo && (
            <div className="flex justify-between pt-2 border-t border-slds-border">
              <span className="text-slds-text-weak">Ref. PO</span>
              <Link href={`/operasional/po/${row.refPo}`} className="font-mono font-semibold text-brand hover:underline">{row.refPo}</Link>
            </div>
          )}
          {row.refDistribusi && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ref. Distribusi</span>
              <Link href={`/operasional/distribusi/${row.refDistribusi}`} className="font-mono font-semibold text-brand hover:underline">{row.refDistribusi}</Link>
            </div>
          )}
          {row.status === "Menunggu" && (
            <div className="flex gap-2 pt-3 border-t border-slds-border">
              <button type="button" data-no-toast onClick={handleApprove} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-[12px] font-semibold">
                <Check className="h-3.5 w-3.5" /> Setujui
              </button>
              <button type="button" data-no-toast onClick={handleReject} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md text-[12px] font-semibold">
                <X className="h-3.5 w-3.5" /> Tolak
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-3">Timeline Approval</h3>
            <div className="space-y-3">
              {timeline.map((step) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${step.done ? "bg-green-100 text-green-700" : step.active ? "bg-amber-100 text-amber-700" : "bg-slds-bg text-slds-text-weak"}`}>
                    {step.done ? "✓" : "·"}
                  </div>
                  <div>
                    <p className={`text-[13px] font-semibold ${step.active ? "text-brand" : "text-slds-text"}`}>{step.label}</p>
                    {step.detail && <p className="text-[12px] text-slds-text-weak">{step.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slds-bg border border-slds-border rounded-lg p-4 text-[12px] text-slds-text-weak">
            <p className="font-semibold text-slds-text mb-1 flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Alur setelah disetujui</p>
            <p>Ajuan disetujui → PO ke supplier atau distribusi antar cabang → stok cabang terisi kembali.</p>
            <p className="mt-2 flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Mobile tinter bisa cek status ajuan dari halaman Ajukan Stok.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

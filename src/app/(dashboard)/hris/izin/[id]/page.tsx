"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, X, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useIzinList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function IzinDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, update } = useIzinList();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Pengajuan izin tidak ditemukan</p>
        <Link href="/hris/izin" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const canApprove = row.status === "Menunggu TTD" || row.status === "Draft";

  function handleApprove() {
    update(row.id, { status: "Selesai", approver: "HR Admin", catatanApprover: "Disetujui — cuti/izin valid" });
    toast("Pengajuan izin disetujui", "success");
  }

  function handleReject() {
    update(row.id, { status: "Ditolak", approver: "HR Admin", catatanApprover: "Ditolak — jadwal operasional padat" });
    toast("Pengajuan izin ditolak", "error");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.nama} · ${row.tipe}`}
        breadcrumb={[
          { label: "HRIS", href: "/hris" },
          { label: "Izin & Cuti", href: "/hris/izin" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/hris/izin" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Detail Pengajuan
          </h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Karyawan</span><span className="font-semibold">{row.nama}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span>{row.cabang}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tipe</span><span>{row.tipe}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Periode</span><span>{row.mulai} — {row.selesai}</span></div>
          <div className="pt-2 border-t border-slds-border">
            <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Alasan</p>
            <p className="text-[12px]">{row.alasan}</p>
          </div>
          {row.approver && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Approver</p>
              <p>{row.approver}{row.catatanApprover ? ` — ${row.catatanApprover}` : ""}</p>
            </div>
          )}
          {canApprove && (
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

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Timeline</h3>
          <div className="space-y-3">
            {[
              { label: "Diajukan via App", done: true, detail: row.diajukanPada?.slice(0, 10) ?? row.mulai },
              { label: "Review Head Cabang / HR", done: row.status !== "Draft", active: canApprove },
              { label: row.status === "Ditolak" ? "Ditolak" : "Disetujui", done: row.status === "Selesai" || row.status === "Ditolak" },
            ].map((step) => (
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
      </div>
    </div>
  );
}

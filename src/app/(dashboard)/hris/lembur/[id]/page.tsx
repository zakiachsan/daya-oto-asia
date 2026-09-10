"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, X, MapPin, Camera } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLemburList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function LemburDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, update } = useLemburList();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Pengajuan lembur tidak ditemukan</p>
        <Link href="/hris/lembur" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const canApprove = row.status === "Menunggu TTD";

  function handleApprove() {
    update(row.id, { status: "Selesai", approver: "Supervisor Cabang", catatanApprover: "Lembur valid — ada bukti foto & GPS" });
    toast("Pengajuan lembur disetujui", "success");
  }

  function handleReject() {
    update(row.id, { status: "Ditolak", approver: "Supervisor Cabang", catatanApprover: "Ditolak — durasi tidak sesuai kebijakan" });
    toast("Pengajuan lembur ditolak", "error");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.nama} · ${row.tanggal}`}
        breadcrumb={[
          { label: "HRIS", href: "/hris" },
          { label: "Lembur", href: "/hris/lembur" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/hris/lembur" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Detail Lembur</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Karyawan</span><span className="font-semibold">{row.nama}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Cabang</span><span>{row.cabang}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Jam</span><span>{row.jamMulai} — {row.jamSelesai} ({row.jam} jam)</span></div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-slds-text-weak shrink-0">GPS</span>
            <span className="text-right inline-flex items-start gap-1"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />{row.gps}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slds-text-weak">Foto Bukti</span>
            <span className={`inline-flex items-center gap-1 font-semibold ${row.fotoBukti ? "text-green-700" : "text-red-600"}`}>
              <Camera className="h-3.5 w-3.5" /> {row.fotoBukti ? "Tersedia" : "Belum ada"}
            </span>
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

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-3">Preview Bukti (mock)</h3>
            <div className="aspect-video bg-slds-bg rounded-lg flex items-center justify-center border border-dashed border-slds-border">
              {row.fotoBukti ? (
                <div className="text-center text-[12px] text-slds-text-weak">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-slds-text-weak" />
                  Foto lembur {row.tanggal} · {row.lokasi}
                </div>
              ) : (
                <p className="text-[12px] text-red-600">Foto bukti belum diunggah</p>
              )}
            </div>
          </div>
          <div className="bg-slds-bg border border-slds-border rounded-lg p-4 text-[12px] text-slds-text-weak">
            Lembur yang disetujui masuk perhitungan slip gaji bulan berjalan.
          </div>
        </div>
      </div>
    </div>
  );
}

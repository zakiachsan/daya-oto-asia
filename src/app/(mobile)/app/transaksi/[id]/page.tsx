"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR, formatDurasi } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useNotaPrint, useTransaksiList } from "@/lib/preview-store";
import { CetakNotaAudit } from "@/components/ui/cetak-nota-audit";
import { normalizeTransaksiId } from "@/lib/transaksi-id-utils";
import { resolveReceiptIdDisplay } from "@/lib/recipe-id-utils";
import { TransaksiFotoNotaSection } from "@/components/mobile/transaksi-foto-nota-section";
import { draftNeedsWizardSteps } from "@/lib/transaksi-foto-nota-utils";
import { buildDraftWizardSnapshot } from "@/lib/transaksi-draft-utils";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";
import { useMemo } from "react";

export default function TransaksiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = String(params.id);
  const id = normalizeTransaksiId(rawId);
  const { toast } = useToast();
  const { all, update } = useTransaksiList();
  const { recordPrint, byTrxId } = useNotaPrint();
  const trx = useMemo(
    () => all.find((t) => t.id === id || t.id === rawId),
    [all, id, rawId],
  );
  const auditLogs = byTrxId(trx?.id ?? id);

  if (!trx) {
    return (
      <div className="text-center py-8">
        <p className="text-slds-text-weak text-[13px]">Transaksi tidak ditemukan</p>
        <Link href="/app/transaksi" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = trx;
  const listTitle = [row.mobil?.trim(), row.platNomor?.trim()].filter(Boolean).join(" · ") || row.warna;
  const isDraft = row.status === "Draft";
  const needsWizard = draftNeedsWizardSteps(row);
  const editableDraft = isDraft && !row.waktuCetakNota;

  function handleSaveDraftDetail() {
    update(row.id, {
      status: "Draft",
      draftWizard: buildDraftWizardSnapshot({
        step: 2,
        layerCount: row.layers?.length ?? 1,
        activeLayer: 1,
        layerFormulas: { 1: row.bahan.map((b) => ({ kode: b.kode, gram: b.gram, nama: b.nama })) },
        gramOverrides: {},
        mfr: row.mobil.split(" ")[0] ?? "Toyota",
        modelYear: "",
        mobil: row.mobil,
        produkKategori: row.produkKategori ?? "basecoat",
        mixingVolume: row.mixingVolume ?? 50,
        fotoSample: row.fotoSample ?? false,
        waktuMulai: row.waktuMulai ? new Date(row.waktuMulai).getTime() : null,
        waktuSelesaiMixing: row.waktuSelesaiMixing ? new Date(row.waktuSelesaiMixing).getTime() : null,
      }),
    });
    toast("Draft tersimpan", "success");
    router.push("/app/transaksi");
  }

  return (
    <div className="space-y-4">
      <Link href="/app/transaksi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
        <div className="px-4 py-3 bg-brand text-white flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-snug">{listTitle}</p>
            <p className="text-[11px] opacity-90 font-mono break-all mt-1">{resolveReceiptIdDisplay(row)}</p>
          </div>
          <StatusBadge status={row.status} />
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
          <div>
            <p className="text-slds-text-weak text-[10px] uppercase font-semibold">Produk</p>
            <p className="font-semibold text-slds-text">{row.warna}</p>
          </div>
          <div>
            <p className="text-slds-text-weak text-[10px] uppercase font-semibold">Tanggal</p>
            <p className="font-semibold">{row.tanggal}</p>
          </div>
          <div>
            <p className="text-slds-text-weak text-[10px] uppercase font-semibold">Durasi mixing</p>
            <p className="font-bold text-brand">{formatDurasi(row.durasiMixingMenit)}</p>
          </div>
          <div>
            <p className="text-slds-text-weak text-[10px] uppercase font-semibold">Total</p>
            <p className="font-bold text-brand">{formatIDR(row.total)}</p>
          </div>
        </div>
      </div>

      {isDraft && (
        <p className="text-[11px] text-center text-slds-text-weak px-2">
          Fase 3 · Foto & Nota
          {editableDraft ? " · checklist bisa dilanjutkan di bawah" : ""}
        </p>
      )}

      {needsWizard ? (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-3">
          <p className="text-[12px] text-slds-text leading-snug">
            Mixing belum selesai. Lanjutkan mobil & produk lalu mixing — setelah itu halaman ini menampilkan checklist foto & nota.
          </p>
          <Link
            href={`/app/transaksi/baru?draft=${encodeURIComponent(row.id)}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand text-white rounded-xl font-bold text-[14px]"
          >
            Lanjutkan mixing
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <TransaksiFotoNotaSection
          trx={row}
          editable={editableDraft}
          onPatch={(patch) => {
            update(row.id, patch);
            if (patch.status === "Menunggu TTD") toast("Nota dicetak · Menunggu TTD", "success");
            if (patch.status === "Menunggu OPB") toast("Sudah ditandatangani · Menunggu OPB", "success");
          }}
          onTambahBahan={
            editableDraft
              ? () => router.push(`/app/transaksi/baru?draft=${encodeURIComponent(row.id)}&tambahBahan=1`)
              : undefined
          }
          onSaveDraft={editableDraft ? handleSaveDraftDetail : undefined}
          onRecordPrint={() => recordPrint(row.id, row.tinter ?? MOBILE_USER, row.cabang ?? MOBILE_CABANG)}
        />
      )}

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] font-bold text-slds-text mb-2">Audit cetak nota</p>
        <CetakNotaAudit logs={auditLogs} />
      </div>
    </div>
  );
}

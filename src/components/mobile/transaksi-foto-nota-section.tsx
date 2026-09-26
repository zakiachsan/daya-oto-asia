"use client";

import { useState } from "react";
import {
  Camera,
  Tag,
  Printer,
  PenLine,
  Plus,
  Check,
  Circle,
  Save,
} from "lucide-react";
import type { TransaksiRow } from "@/lib/mock-data";
import { formatDurasi } from "@/lib/mock-data";
import { TransaksiCatatanPanel } from "@/components/mobile/transaksi-catatan-panel";
import { LabelCatPreview } from "@/components/ui/label-cat-preview";
import { NotaPenjualanPreview, printNotaPenjualanPreview } from "@/components/ui/nota-penjualan-preview";
import type { TransaksiStatus } from "@/lib/transaksi-status-utils";

type Props = {
  trx: TransaksiRow;
  /** Draft · belum cetak nota */
  editable: boolean;
  onPatch: (patch: Partial<TransaksiRow> & { status?: TransaksiStatus }) => void;
  onTambahBahan?: () => void;
  onSaveDraft?: () => void;
  onRecordPrint?: () => boolean;
  showAuditLink?: boolean;
};

function CheckIcon({ done }: { done: boolean }) {
  return done ? (
    <Check className="h-5 w-5 text-green-600 shrink-0" />
  ) : (
    <Circle className="h-5 w-5 text-slds-text-weak shrink-0" />
  );
}

export function TransaksiFotoNotaSection({
  trx,
  editable,
  onPatch,
  onTambahBahan,
  onSaveDraft,
  onRecordPrint,
}: Props) {
  const printed = !!trx.waktuCetakNota;
  const signed =
    !!trx.waktuTTD ||
    trx.status === "Menunggu OPB" ||
    trx.status === "OPB Terbit" ||
    trx.status === "Proses Invoice" ||
    trx.status === "Selesai";
  const kirimDone =
    trx.status === "Menunggu OPB" ||
    trx.status === "OPB Terbit" ||
    trx.status === "Proses Invoice" ||
    trx.status === "Selesai";

  const [showNota, setShowNota] = useState(printed);

  const labelDone = !!trx.waktuCetakLabel;
  const showLabelPreview = labelDone;

  const canEditChecklist = editable && !printed;
  const canTtd = trx.status === "Menunggu TTD" && !signed;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slds-border bg-white px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase text-slds-text-weak">Mixing selesai</p>
          <p className="text-xl font-bold text-brand tabular-nums">{formatDurasi(trx.durasiMixingMenit)}</p>
        </div>
        <p className="text-[11px] text-slds-text-weak text-right leading-snug">
          {trx.mobil}
          <br />
          <span className="font-mono font-semibold text-slds-text">{trx.platNomor}</span>
        </p>
      </div>

      <TransaksiCatatanPanel trx={trx} compact />

      {editable && onTambahBahan && !printed && (
        <button
          type="button"
          data-no-toast
          onClick={onTambahBahan}
          className="w-full py-2.5 border border-dashed border-brand/60 text-brand rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 bg-brand/[0.03]"
        >
          <Plus className="h-4 w-4" /> Tambah bahan
        </button>
      )}

      <div className="rounded-xl border border-slds-border bg-white overflow-hidden divide-y divide-slds-border">
        <p className="px-4 py-2.5 text-[11px] font-bold uppercase text-slds-text-weak bg-slds-bg">Checklist selesai</p>

        {canEditChecklist ? (
          <button
            type="button"
            data-no-toast
            onClick={() => onPatch({ fotoSample: true })}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-slds-bg/80 transition-colors"
          >
            <CheckIcon done={!!trx.fotoSample} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slds-text">Foto sample plat</p>
              <p className="text-[11px] text-slds-text-weak">Wajib sebelum cetak nota</p>
            </div>
            <Camera className="h-4 w-4 text-slds-text-weak shrink-0" />
          </button>
        ) : (
          <div className="px-4 py-3.5 flex items-center gap-3">
            <CheckIcon done={!!trx.fotoSample} />
            <p className="text-[13px] font-semibold text-slds-text">Foto sample plat</p>
          </div>
        )}

        {canEditChecklist ? (
          <button
            type="button"
            data-no-toast
            onClick={() => onPatch({ waktuCetakLabel: new Date().toISOString() })}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-slds-bg/80 transition-colors"
          >
            <CheckIcon done={labelDone} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slds-text">Label cat</p>
              <p className="text-[11px] text-slds-text-weak">Preview di bawah setelah tap</p>
            </div>
            <Tag className="h-4 w-4 text-slds-text-weak shrink-0" />
          </button>
        ) : (
          <div className="px-4 py-3.5 flex items-center gap-3">
            <CheckIcon done={labelDone} />
            <p className="text-[13px] font-semibold text-slds-text">Label cat</p>
          </div>
        )}

        {canEditChecklist ? (
          <button
            type="button"
            data-no-toast
            disabled={!trx.fotoSample}
            onClick={() => {
              onRecordPrint?.();
              setShowNota(true);
              printNotaPenjualanPreview();
              onPatch({
                waktuCetakNota: new Date().toISOString(),
                status: "Menunggu TTD",
              });
            }}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-slds-bg/80 transition-colors disabled:opacity-50"
          >
            <CheckIcon done={printed} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slds-text">Cetak nota penjualan</p>
              <p className="text-[11px] text-slds-text-weak">Status → Menunggu TTD</p>
            </div>
            <Printer className="h-4 w-4 text-slds-text-weak shrink-0" />
          </button>
        ) : printed ? (
          <div className="px-4 py-3.5 flex items-center gap-3 bg-green-50/80">
            <Check className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-[13px] font-semibold text-green-900">Nota tercetak · Menunggu TTD</p>
          </div>
        ) : (
          <div className="px-4 py-3.5 flex items-center gap-3">
            <CheckIcon done={false} />
            <p className="text-[13px] font-semibold text-slds-text">Cetak nota penjualan</p>
          </div>
        )}

        {canTtd ? (
          <button
            type="button"
            data-no-toast
            onClick={() =>
              onPatch({
                status: "Menunggu OPB",
                waktuTTD: new Date().toISOString(),
                durasiTotalMenit: trx.durasiMixingMenit != null ? trx.durasiMixingMenit + 3 : null,
              })
            }
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-slds-bg/80 transition-colors"
          >
            <CheckIcon done={signed} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slds-text">Tanda tangan GH</p>
            </div>
            <PenLine className="h-4 w-4 text-slds-text-weak shrink-0" />
          </button>
        ) : (
          <div className="px-4 py-3.5 flex items-center gap-3">
            <CheckIcon done={signed} />
            <p className="text-[13px] font-semibold text-slds-text">Tanda tangan GH</p>
          </div>
        )}

        <div className="px-4 py-3.5 flex items-center gap-3">
          <CheckIcon done={kirimDone} />
          <p className="text-[13px] font-semibold text-slds-text">Kirim · Menunggu OPB</p>
        </div>
      </div>

      {showLabelPreview && <LabelCatPreview trx={trx} className="mx-auto shadow-sm" />}

      {(showNota || printed) && (
        <div className="rounded-xl border border-slds-border overflow-hidden">
          <p className="px-4 py-2 text-[11px] font-bold uppercase text-slds-text-weak bg-slds-bg">Preview nota</p>
          <div className="overflow-x-auto p-2">
            <NotaPenjualanPreview trx={trx} className="min-w-[320px] mx-auto" />
          </div>
        </div>
      )}

      {trx.status === "Menunggu TTD" && printed && (
        <button
          type="button"
          data-no-toast
          onClick={() => {
            onRecordPrint?.();
            setShowNota(true);
            printNotaPenjualanPreview();
          }}
          className="w-full py-3 border border-slds-border rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 bg-white"
        >
          <Printer className="h-4 w-4" /> Cetak ulang nota
        </button>
      )}

      {editable && onSaveDraft && (
        <div className="rounded-xl border border-dashed border-slds-border bg-slds-bg/60 p-3">
          <button
            type="button"
            data-no-toast
            onClick={onSaveDraft}
            className="w-full py-2.5 border border-brand text-brand bg-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Simpan draft
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { buildSlipForKaryawan, MONTHS } from "@/lib/slip-gaji-utils";
import { SlipGajiPreview, printSlipGajiPreview } from "@/components/ui/slip-gaji-preview";
import { useToast } from "@/components/ui/toast";

import { MOBILE_USER } from "@/lib/mobile-app-utils";
/** Demo: bulan berjalan September 2026 (index 8) */
const DEMO_CURRENT_MONTH = 8;

export default function AppSlipGajiPage() {
  const { toast } = useToast();
  const [month, setMonth] = useState(DEMO_CURRENT_MONTH);

  const finalized = month < DEMO_CURRENT_MONTH;
  const slip = useMemo(
    () => buildSlipForKaryawan(MOBILE_USER, month, finalized),
    [month, finalized],
  );

  if (!slip) {
    return (
      <div className="text-center py-8 text-[13px] text-slds-text-weak">
        Slip gaji tidak tersedia.
      </div>
    );
  }

  function handlePrint() {
    printSlipGajiPreview();
    toast("Slip gaji dicetak", "success");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white border border-slds-border rounded-xl p-2">
        <button
          type="button"
          data-no-toast
          onClick={() => setMonth((m) => Math.max(0, m - 1))}
          disabled={month === 0}
          className="p-2 rounded-lg hover:bg-slds-bg disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[14px] font-bold text-slds-text">{MONTHS[month]} 2026</p>
          <StatusBadge status={slip.status} />
        </div>
        <button
          type="button"
          data-no-toast
          onClick={() => setMonth((m) => Math.min(11, m + 1))}
          disabled={month === 11}
          className="p-2 rounded-lg hover:bg-slds-bg disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {month === DEMO_CURRENT_MONTH && slip.status === "Draft" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px] text-amber-800">
          Slip {MONTHS[month]} masih draft · menunggu HR finalize batch payroll.
        </div>
      )}

      <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
        <div className="px-4 py-3 bg-brand text-white">
          <p className="text-[12px] opacity-80">Slip Gaji</p>
          <p className="text-base font-bold">{slip.bulan}</p>
          <p className="text-[11px] opacity-90">{slip.nama} · {slip.cabangFull}</p>
        </div>
        <div className="p-4 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-slds-text-weak">Gaji Pokok</span>
            <span className="font-semibold">{formatIDR(slip.gajiPokok)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slds-text-weak">Tunjangan</span>
            <span className="font-semibold">{formatIDR(slip.tunjangan)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slds-text-weak">Upah Lembur ({slip.jamLembur} jam)</span>
            <span className="font-semibold">{formatIDR(slip.lembur)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slds-border">
            <span className="font-semibold">Bruto</span>
            <span>{formatIDR(slip.bruto)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-[12px]">Potongan ({slip.telat} telat, {slip.alpha} alpha)</span>
            <span className="font-semibold">-{formatIDR(slip.potongan)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slds-text-weak">PPh 21</span>
            <span className="font-semibold text-red-600">-{formatIDR(slip.pph21)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-slds-border text-[15px] font-bold">
            <span>Gaji Bersih</span>
            <span className="text-brand">{formatIDR(slip.bersih)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] font-bold text-slds-text mb-2">Riwayat Lembur Disetujui</p>
        {slip.lemburEntries.length === 0 ? (
          <p className="text-[12px] text-slds-text-weak">Tidak ada lembur bulan ini.</p>
        ) : (
          <div className="space-y-2">
            {slip.lemburEntries.map((l) => (
              <div key={l.id} className="flex justify-between text-[13px] py-1.5 border-b border-slds-border last:border-0">
                <div>
                  <p className="font-semibold">{l.tanggal}</p>
                  <p className="text-[11px] text-slds-text-weak">{l.lokasi}</p>
                </div>
                <span className="font-bold text-brand">{l.jam} jam</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template cetak · off-screen, dipakai printSlipGajiPreview() */}
      <div className="sr-only">
        <SlipGajiPreview slip={slip} />
      </div>

      <button
        type="button"
        data-no-toast
        onClick={handlePrint}
        className="w-full py-3.5 bg-slds-text text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2"
      >
        <Printer className="h-4 w-4" /> Cetak Slip Gaji
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { nameFromSlug } from "@/lib/preview-store";
import { buildSlipForKaryawan } from "@/lib/slip-gaji-utils";
import { useToast } from "@/components/ui/toast";

export default function SlipGajiDetailPage() {
  const params = useParams();
  const nama = nameFromSlug(String(params.slug));
  const { toast } = useToast();
  const slip = buildSlipForKaryawan(nama, 8, false);

  if (!slip) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Slip gaji tidak ditemukan</p>
        <Link href="/hris/slip-gaji" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = slip;

  return (
    <div>
      <PageHeader
        title={row.nama}
        desc={`Slip Gaji â ${row.bulan}`}
        breadcrumb={[
          { label: "HRIS", href: "/hris" },
          { label: "Slip Gaji", href: "/hris/slip-gaji" },
          { label: row.nama },
        ]}
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/hris/slip-gaji" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slds-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-brand text-white">
            <p className="text-[11px] opacity-80">PT Daya Oto Asia</p>
            <p className="text-base font-bold">Slip Gaji â {row.bulan}</p>
            <p className="text-[12px] opacity-90">{row.nama} Â· {row.cabangFull}</p>
          </div>
          <div className="p-4 space-y-2 text-[13px]">
            <div className="flex justify-between"><span className="text-slds-text-weak">Gaji Pokok</span><span className="font-semibold">{formatIDR(row.gajiPokok)}</span></div>
            <div className="flex justify-between"><span className="text-slds-text-weak">Tunjangan</span><span className="font-semibold">{formatIDR(row.tunjangan)}</span></div>
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Upah Lembur ({row.jamLembur} jam)</span>
              <span className="font-semibold">{formatIDR(row.lembur)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slds-border">
              <span className="font-semibold">Bruto</span><span>{formatIDR(row.bruto)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Potongan Telat ({row.telat}x) + Alpha ({row.alpha} hari)</span>
              <span className="font-semibold">-{formatIDR(row.potongan)}</span>
            </div>
            <div className="flex justify-between"><span className="text-slds-text-weak">PPh 21</span><span className="font-semibold">-{formatIDR(row.pph21)}</span></div>
            <div className="flex justify-between pt-3 border-t-2 border-slds-border text-[15px] font-bold">
              <span>Gaji Bersih</span><span className="text-brand">{formatIDR(row.bersih)}</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <button
              type="button"
              data-no-toast
              onClick={() => toast("Slip gaji dicetak (preview)", "success")}
              className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak Slip
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-2">Sumber Perhitungan</h3>
            <div className="text-[13px] space-y-2">
              <div className="flex justify-between"><span className="text-slds-text-weak">Kehadiran â Telat</span><span className="font-semibold">{row.telat} kali</span></div>
              <div className="flex justify-between"><span className="text-slds-text-weak">Kehadiran â Alpha</span><span className="font-semibold">{row.alpha} hari</span></div>
              <div className="flex justify-between"><span className="text-slds-text-weak">Tarif lembur</span><span>PP 35/2021 (1.5Ã-)</span></div>
            </div>
          </div>

          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-2">Riwayat Lembur Disetujui</h3>
            {row.lemburEntries.length === 0 ? (
              <p className="text-[12px] text-slds-text-weak">Tidak ada lembur bulan ini.</p>
            ) : (
              <table className="w-full text-[13px]">
                <tbody>
                  {row.lemburEntries.map((l) => (
                    <tr key={l.id} className="border-b border-slds-border last:border-0">
                      <td className="py-2">{l.tanggal}</td>
                      <td className="py-2 text-slds-text-weak">{l.lokasi}</td>
                      <td className="py-2 text-right font-semibold">{l.jam} jam</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

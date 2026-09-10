"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useIzinList } from "@/lib/preview-store";

const MOCK_ABSENSI = [
  { nama: "Andi Wijaya", cabang: "Surabaya", tanggal: "2026-09-10", checkIn: "07:58", checkOut: "17:05", telat: 0, status: "Aktif" },
  { nama: "Rudi Hartono", cabang: "Malang", tanggal: "2026-09-10", checkIn: "08:12", checkOut: "—", telat: 1, status: "Draft" },
  { nama: "Eko Prasetyo", cabang: "Jember", tanggal: "2026-09-10", checkIn: "07:55", checkOut: "17:00", telat: 0, status: "Aktif" },
];

const REKAP = [
  { nama: "Andi Wijaya", hadir: 20, telat: 1, alpha: 0, pct: 95 },
  { nama: "Rudi Hartono", hadir: 22, telat: 0, alpha: 0, pct: 100 },
  { nama: "Eko Prasetyo", hadir: 19, telat: 2, alpha: 1, pct: 90 },
];

const TABS = ["Harian", "Rekap Bulanan", "Approval", "Lokasi Absen"] as const;

export default function AbsensiPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Harian");
  const { items: izinItems } = useIzinList();
  const pendingIzin = izinItems.filter((i) => i.status === "Menunggu TTD" || i.status === "Draft");

  return (
    <div>
      <PageHeader
        title="Absensi"
        desc="Rekap kehadiran karyawan — port pt-gis (UI preview, mock data)"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Absensi" }]}
      />

      <div className="flex gap-1 mb-4 border-b border-slds-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            data-no-toast
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap
              ${tab === t ? "border-brand text-brand" : "border-transparent text-slds-text-weak hover:text-slds-text"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Harian" && (
        <DataTable
          columns={[
            { key: "nama", label: "Karyawan" },
            { key: "cabang", label: "Cabang" },
            { key: "tanggal", label: "Tanggal" },
            { key: "checkIn", label: "Check In" },
            { key: "checkOut", label: "Check Out" },
            { key: "telat", label: "Telat", render: (r) => (Number(r.telat) > 0 ? <span className="text-amber-600 font-bold">{String(r.telat)}x</span> : "—") },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
          ]}
          data={MOCK_ABSENSI}
        />
      )}

      {tab === "Rekap Bulanan" && (
        <div className="bg-white border border-slds-border rounded-lg overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slds-bg border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                <th className="px-4 py-2">Karyawan</th>
                <th className="px-4 py-2">Hadir</th>
                <th className="px-4 py-2">Telat</th>
                <th className="px-4 py-2">Alpha</th>
                <th className="px-4 py-2">Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {REKAP.map((r) => (
                <tr key={r.nama} className="border-b border-slds-border last:border-0">
                  <td className="px-4 py-2 font-semibold">{r.nama}</td>
                  <td className="px-4 py-2">{r.hadir} hari</td>
                  <td className="px-4 py-2">{r.telat}x</td>
                  <td className="px-4 py-2">{r.alpha}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slds-bg rounded-full overflow-hidden max-w-[100px]">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="font-bold">{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-2 text-[11px] text-slds-text-weak border-t border-slds-border">September 2026 · 22 hari kerja</p>
        </div>
      )}

      {tab === "Approval" && (
        <div className="space-y-2">
          {pendingIzin.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-[13px] text-green-800">Tidak ada pengajuan menunggu approval</div>
          ) : (
            pendingIzin.map((i) => (
              <Link key={i.id} href={`/hris/izin/${i.id}`} className="bg-white border border-slds-border rounded-lg p-3 flex items-center justify-between gap-3 hover:border-brand/40">
                <div>
                  <p className="text-[13px] font-bold">{i.nama} — {i.tipe}</p>
                  <p className="text-[11px] text-slds-text-weak">{i.mulai} · {i.alasan}</p>
                </div>
                <span className="text-[12px] font-semibold text-brand shrink-0">Review →</span>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === "Lokasi Absen" && (
        <DataTable
          columns={[
            { key: "cabang", label: "Cabang" },
            { key: "nama", label: "Karyawan" },
            { key: "checkIn", label: "Check In Terakhir" },
            { key: "status", label: "Dalam Radius", render: () => <StatusBadge status="Aktif" /> },
          ]}
          data={MOCK_ABSENSI}
        />
      )}
    </div>
  );
}

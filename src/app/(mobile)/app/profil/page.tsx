"use client";

import Link from "next/link";
import { User, FileText, Calendar, Clock, ChevronRight, LogOut, Paintbrush, Package } from "lucide-react";
import { MOBILE_USER, MOBILE_CABANG, useMobileHrPending, useMobileKinerjaRingkas } from "@/lib/mobile-app-utils";

function PendingBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">
      {count}
    </span>
  );
}

export default function ProfilPage() {
  const { izinPending, lemburPending } = useMobileHrPending();
  const kinerja = useMobileKinerjaRingkas();

  const menu = [
    { href: "/app/slip-gaji", icon: FileText, label: "Slip Gaji", badge: 0 },
    { href: "/app/izin", icon: Calendar, label: "Izin & Cuti", badge: izinPending },
    { href: "/app/lembur", icon: Clock, label: "Lembur", badge: lemburPending },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-xl">
          A
        </div>
        <div>
          <p className="text-base font-bold text-slds-text">{MOBILE_USER}</p>
          <p className="text-[12px] text-slds-text-weak">Tinter · {MOBILE_CABANG}</p>
          <p className="text-[11px] text-brand">andi@dayaoto.com</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-3">Kinerja Bulan Ini</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slds-bg p-3">
            <div className="flex items-center gap-1.5 text-brand mb-1">
              <Paintbrush className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase text-slds-text-weak">Transaksi</span>
            </div>
            <p className="text-xl font-bold text-slds-text">{kinerja.trxBulan}</p>
          </div>
          <div className="rounded-lg bg-slds-bg p-3">
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase text-slds-text-weak">Avg Mixing</span>
            </div>
            <p className="text-xl font-bold text-slds-text">{kinerja.avgDurasi}</p>
          </div>
          <div className="rounded-lg bg-slds-bg p-3">
            <div className="flex items-center gap-1.5 text-green-600 mb-1">
              <User className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase text-slds-text-weak">Kehadiran</span>
            </div>
            <p className="text-xl font-bold text-slds-text">{kinerja.kehadiran}</p>
          </div>
          <div className="rounded-lg bg-slds-bg p-3">
            <div className="flex items-center gap-1.5 text-orange-600 mb-1">
              <Package className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase text-slds-text-weak">Pemakaian</span>
            </div>
            <p className="text-xl font-bold text-slds-text">{kinerja.pemakaianBahan}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {menu.map(({ href, icon: Icon, label, badge }) => (
          <Link key={label} href={href} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-slds-border">
            <Icon className="h-5 w-5 text-brand" />
            <span className="flex-1 text-[14px] font-semibold text-slds-text">{label}</span>
            <PendingBadge count={badge} />
            <ChevronRight className="h-4 w-4 text-slds-text-weak" />
          </Link>
        ))}
      </div>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-3 text-red-600 rounded-xl border border-red-200 text-[14px] font-semibold"
      >
        <LogOut className="h-4 w-4" /> Keluar
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Paintbrush, MapPin, Scale, Package, ChevronRight, Clock, FlaskConical } from "lucide-react";

export default function AppHome() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] text-slds-text-weak">Selamat pagi,</p>
        <h2 className="text-lg font-bold text-slds-text">Andi Wijaya</h2>
        <p className="text-[12px] text-slds-text-weak">Tinter — Auto 2000 Surabaya</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Hadir Bulan Ini", value: "18 hari", color: "text-green-600" },
          { label: "Transaksi Hari Ini", value: "3 warna", color: "text-brand" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-slds-border">
            <p className="text-[10px] text-slds-text-weak uppercase font-semibold">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Link
        href="/app/transaksi/baru"
        className="flex items-center justify-center gap-2 w-full py-4 bg-brand text-white rounded-xl font-bold text-base shadow-md"
      >
        <Paintbrush className="h-5 w-5" />
        Buat Transaksi Warna
      </Link>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Menu Cepat</p>
        {[
          { href: "/app/absensi", icon: MapPin, label: "Absensi", sub: "Belum check-in hari ini" },
          { href: "/app/stock-opname", icon: Scale, label: "Stock Opname", sub: "Jadwal: Jumat" },
          { href: "/app/buka-kaleng", icon: FlaskConical, label: "Buka Kaleng", sub: "Timbang kaleng baru" },
          { href: "/app/ajukan-stok", icon: Package, label: "Ajukan Stok", sub: "2 item menipis" },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-slds-border"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slds-bg">
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-slds-text">{label}</p>
              <p className="text-[11px] text-slds-text-weak">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slds-text-weak" />
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[12px] font-bold text-amber-800">1 transaksi menunggu TTD</p>
          <p className="text-[11px] text-amber-700">TRX-2026-0141 — Merah Solid, minta tanda tangan kepala bengkel</p>
        </div>
      </div>
    </div>
  );
}

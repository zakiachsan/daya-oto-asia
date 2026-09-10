import Link from "next/link";
import { User, FileText, Calendar, Clock, ChevronRight, LogOut } from "lucide-react";

export default function ProfilPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-xl">
          A
        </div>
        <div>
          <p className="text-base font-bold text-slds-text">Andi Wijaya</p>
          <p className="text-[12px] text-slds-text-weak">Tinter · Auto 2000 Surabaya</p>
          <p className="text-[11px] text-brand">andi@dayaoto.com</p>
        </div>
      </div>

      <div className="space-y-1">
        {[
          { href: "/app/slip-gaji", icon: FileText, label: "Slip Gaji" },
          { href: "/app/izin", icon: Calendar, label: "Izin & Cuti" },
          { href: "/app/lembur", icon: Clock, label: "Lembur" },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={label} href={href} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-slds-border">
            <Icon className="h-5 w-5 text-brand" />
            <span className="flex-1 text-[14px] font-semibold text-slds-text">{label}</span>
            <ChevronRight className="h-4 w-4 text-slds-text-weak" />
          </Link>
        ))}
      </div>

      <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 text-red-600 rounded-xl border border-red-200 text-[14px] font-semibold">
        <LogOut className="h-4 w-4" /> Keluar
      </Link>
    </div>
  );
}

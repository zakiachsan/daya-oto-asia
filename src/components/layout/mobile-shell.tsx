"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Paintbrush, MapPin, Scale, User } from "lucide-react";

const NAV = [
  { href: "/app", label: "Beranda", icon: Home, exact: true },
  { href: "/app/transaksi", label: "Transaksi", icon: Paintbrush },
  { href: "/app/absensi", label: "Absensi", icon: MapPin },
  { href: "/app/stock-opname", label: "Opname", icon: Scale },
  { href: "/app/profil", label: "Profil", icon: User },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  return (
    <div className="flex flex-col min-h-screen bg-slds-bg max-w-md mx-auto">
      <header className="sticky top-0 z-20 bg-brand text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-80">Daya Oto Asia</p>
            <h1 className="text-base font-bold">App Tinter</h1>
          </div>
          <Link href="/modules" className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full">
            Web Admin
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slds-border px-2 py-1.5 z-30">
        <div className="flex justify-around">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors
                  ${active ? "text-brand" : "text-slds-text-weak"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Paintbrush, MapPin, Scale, User } from "lucide-react";
import { MOBILE_USER, useMobileHrPending } from "@/lib/mobile-app-utils";

const NAV = [
  { href: "/app", label: "Beranda", icon: Home, exact: true },
  { href: "/app/transaksi", label: "Transaksi", icon: Paintbrush },
  { href: "/app/absensi", label: "Absensi", icon: MapPin },
  { href: "/app/stock-opname", label: "Opname", icon: Scale },
  { href: "/app/profil", label: "Profil", icon: User },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const { totalPending } = useMobileHrPending();

  return (
    <div className="flex flex-col min-h-screen bg-slds-bg max-w-md mx-auto">
      <header className="sticky top-0 z-20 bg-brand text-white px-4 py-3 shadow-md">
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-80">Daya Oto Asia</p>
          <h1 className="text-base font-bold">{MOBILE_USER}</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slds-border px-2 py-1.5 z-30">
        <div className="flex justify-around">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            const showBadge = href === "/app/profil" && totalPending > 0;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors
                  ${active ? "text-brand" : "text-slds-text-weak"}`}
              >
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute top-0 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-bold">
                    {totalPending}
                  </span>
                )}
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

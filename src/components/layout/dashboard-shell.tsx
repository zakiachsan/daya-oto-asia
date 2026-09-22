"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Paintbrush, LogOut, Menu, X, LayoutGrid,
} from "lucide-react";
import { getModuleByPath, MODULES, type ModuleDef, type ModuleMenu } from "@/lib/modules";
import { MOCK_USER } from "@/lib/mock-data";

function MenuSectionHeader({ label }: { label: string }) {
  return (
    <div className="mt-4 mb-1.5 pt-3 border-t-2 border-slds-border">
      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slds-text-weak/80">
        {label}
      </p>
    </div>
  );
}

function ModuleMenuLinks({
  mod,
  isActive,
  onNavigate,
  showModuleHeader,
  moduleDivider,
}: {
  mod: ModuleDef;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  showModuleHeader?: boolean;
  moduleDivider?: boolean;
}) {
  let lastSection: string | undefined;

  return (
    <div>
      {showModuleHeader && (
        <div className={`mb-2 ${moduleDivider ? "mt-4 pt-3 border-t-2 border-slds-border" : "mt-1"}`}>
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slds-text">
            {mod.label}
          </p>
        </div>
      )}
      {mod.menus.map((menu: ModuleMenu) => {
        const active = isActive(menu.href);
        const showSection = menu.section && menu.section !== lastSection;
        if (menu.section) lastSection = menu.section;

        return (
          <div key={menu.href}>
            {showSection && (
              <MenuSectionHeader label={menu.section!} />
            )}
            <Link
              href={menu.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all
                ${active ? "bg-brand/10 text-brand font-bold" : "text-slds-text hover:bg-slds-bg"}`}
            >
              {menu.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeModule = getModuleByPath(pathname);
  const isMobileApp = pathname.startsWith("/app");
  const isGuidePage = pathname.endsWith("/panduan");

  const isActive = (href: string) =>
    pathname === href || (href !== `/${activeModule?.id}` && pathname.startsWith(href + "/"));

  function handleLogout() {
    router.push("/login");
  }

  if (isMobileApp) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slds-bg">
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slds-border flex flex-col transition-transform duration-200`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slds-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white shrink-0">
            <Paintbrush className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base text-slds-text">Daya Oto Asia</h1>
            <p className="text-[10px] uppercase tracking-wider text-slds-text-weak truncate">
              {activeModule ? `Modul ${activeModule.label}` : "Sistem Cat Body Repair"}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <Link
            href="/modules"
            data-no-toast onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all
              ${pathname === "/modules" ? "bg-brand/10 text-brand font-bold" : "text-slds-text hover:bg-slds-bg"}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Pilih Modul
          </Link>

          <div className="border-t-2 border-slds-border my-3" />

          {activeModule && activeModule.id !== "mobile" ? (
            <ModuleMenuLinks mod={activeModule} isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
          ) : (
            MODULES.map((mod, i) => (
              <ModuleMenuLinks
                key={mod.id}
                mod={mod}
                isActive={isActive}
                onNavigate={() => setSidebarOpen(false)}
                showModuleHeader
                moduleDivider={i > 0}
              />
            ))
          )}
        </nav>

        <div className="border-t border-slds-border p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-slds-bg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-sm">
              {MOCK_USER.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slds-text truncate">{MOCK_USER.name}</p>
              <p className="text-[10px] text-slds-text-weak uppercase">{MOCK_USER.role}</p>
            </div>
            <button type="button" onClick={handleLogout} className="p-1.5 text-slds-text-weak hover:text-slds-text">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" data-no-toast onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-slds-border px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button type="button"
              data-no-toast onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-slds-bg text-slds-text"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {activeModule && activeModule.id !== "mobile" && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 text-brand text-[11px] font-bold">
                <activeModule.icon className="h-3.5 w-3.5" />
                {activeModule.label}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slds-text-weak hidden sm:block">UI Preview · Mock Data</span>
        </header>
        <main
          className={
            isGuidePage
              ? "flex-1 overflow-hidden p-0 flex flex-col min-h-0"
              : "flex-1 overflow-y-auto p-4 md:p-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}

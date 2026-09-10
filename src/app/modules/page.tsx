"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Paintbrush, LogOut, LayoutGrid, Smartphone } from "lucide-react";
import { MODULES, MOBILE_MODULE } from "@/lib/modules";
import { MOCK_USER } from "@/lib/mock-data";

export default function ModulesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slds-bg flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-slds-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
              <Paintbrush className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slds-text">Daya Oto Asia</h1>
              <p className="text-[10px] uppercase tracking-wider text-slds-text-weak">Pilih Modul</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slds-bg rounded-md px-2.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-[13px]">
                {MOCK_USER.name[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-medium">{MOCK_USER.name}</p>
                <p className="text-[9px] uppercase text-slds-text-weak">{MOCK_USER.role}</p>
              </div>
            </div>
            <Link href="/login" className="p-2 text-slds-text-weak hover:text-slds-text">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="h-4 w-4 text-brand" />
            <h2 className="text-xl font-bold text-slds-text">Pilih Modul</h2>
          </div>
          <p className="text-[13px] text-slds-text-weak">Pilih modul untuk mulai — UI preview dengan mock data</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                type="button"
                key={mod.id}
                data-no-toast
                onClick={() => router.push(mod.firstMenu || mod.menus[0].href)}
                className={`group flex flex-col items-start rounded-lg border border-slds-border bg-white p-5 text-left shadow-sm transition-all ${mod.color.hover} hover:shadow-md`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${mod.color.bg}`}>
                  <Icon className={`h-5 w-5 ${mod.color.icon}`} />
                </div>
                <h3 className="text-base font-bold text-slds-text">{mod.label}</h3>
                <p className="mt-1 text-[12px] text-slds-text-weak line-clamp-2">{mod.desc}</p>
                <div className="mt-3 flex items-center justify-between w-full">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${mod.color.chip}`}>
                    {mod.menus.length} menu
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-brand">
                    Buka <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-lg border border-brand/30 bg-brand/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[13px] font-bold text-slds-text">Demo Walkthrough</p>
            <p className="text-[12px] text-slds-text-weak">Checklist interaktif untuk presentasi ke Pak David — progress tersimpan di browser</p>
          </div>
          <button
            type="button"
            data-no-toast
            onClick={() => router.push("/demo")}
            className="shrink-0 px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            Buka Checklist
          </button>
        </div>

        <div className="border-t border-slds-border pt-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-3">Aplikasi Lapangan</p>
          <button
            type="button"
            data-no-toast
            onClick={() => router.push("/app")}
            className="group flex items-center gap-4 w-full sm:w-auto rounded-lg border border-emerald-200 bg-emerald-50 p-4 hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100">
              <Smartphone className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-base font-bold text-slds-text">{MOBILE_MODULE.label}</h3>
              <p className="text-[12px] text-slds-text-weak">{MOBILE_MODULE.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </button>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ModuleMenu } from "@/lib/modules";

interface ModuleLandingProps {
  title: string;
  desc: string;
  menus: ModuleMenu[];
}

export function ModuleLanding({ title, desc, menus }: ModuleLandingProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slds-border rounded-lg p-5">
        <h1 className="text-xl font-bold text-slds-text">{title}</h1>
        <p className="text-[13px] text-slds-text-weak mt-1">{desc}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {menus.filter((m) => !m.href.endsWith("/panduan")).map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group bg-white border border-slds-border rounded-lg p-4 hover:shadow-md hover:border-brand transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {m.section && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slds-text-weak mb-0.5">{m.section}</p>
                )}
                <h3 className="text-base font-bold text-slds-text">{m.label}</h3>
                {m.desc && <p className="text-[11px] text-slds-text-weak mt-0.5">{m.desc}</p>}
              </div>
              <ChevronRight className="h-4 w-4 text-slds-text-weak group-hover:text-brand shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

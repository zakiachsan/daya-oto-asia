"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowDown, ChevronRight } from "lucide-react";
import type { FlowAction, GuideModuleId, ModuleGuideNav } from "@/lib/module-guides/types";

const MODULE_LABELS: Record<GuideModuleId, string> = {
  operasional: "Operasional",
  finance: "Finance",
  hris: "HRIS",
  mobile: "App Tinter",
};

const MODULE_THEME: Record<GuideModuleId, { border: string; badge: string; badgeText: string; link: string }> = {
  operasional: { border: "#fdba74", badge: "#ea580c", badgeText: "#fff", link: "text-orange-600" },
  finance: { border: "#fcd34d", badge: "#d97706", badgeText: "#fff", link: "text-amber-600" },
  hris: { border: "#93c5fd", badge: "#2563eb", badgeText: "#fff", link: "text-blue-600" },
  mobile: { border: "#6ee7b7", badge: "#059669", badgeText: "#fff", link: "text-emerald-600" },
};

const GUIDE_RAIL_ACCENT: Record<string, string> = {
  operasional: "#ea580c",
  finance: "#d97706",
  hris: "#2563eb",
};

interface ModuleGuidePageProps {
  nav: ModuleGuideNav;
}

function FlowNode({
  action,
  moduleLabel,
}: {
  action: FlowAction;
  moduleLabel: (id: GuideModuleId) => string;
}) {
  const theme = MODULE_THEME[action.module];
  return (
    <div
      className="w-full max-w-[280px] bg-white rounded-lg p-3.5 text-center border-2"
      style={{ borderColor: theme.border }}
    >
      <div
        className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2"
        style={{ background: theme.badge, color: theme.badgeText }}
      >
        {moduleLabel(action.module)}
      </div>
      {action.href ? (
        <Link href={action.href} className={`block text-sm font-semibold no-underline ${theme.link}`}>
          {action.label}
        </Link>
      ) : (
        <div className="text-sm font-semibold text-slds-text">{action.label}</div>
      )}
      {action.also && (
        <div className="text-[10px] text-slds-text-weak mt-1.5">
          ↳ Juga di{" "}
          {action.also.href ? (
            <Link
              href={action.also.href}
              className="font-semibold no-underline"
              style={{ color: MODULE_THEME[action.also.module].badge }}
            >
              {moduleLabel(action.also.module)}
            </Link>
          ) : (
            <span className="font-semibold" style={{ color: MODULE_THEME[action.also.module].badge }}>
              {moduleLabel(action.also.module)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ModuleGuidePageInner({ nav }: ModuleGuidePageProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const firstId = nav.sections[0]?.items[0]?.id ?? "";
  const paramId = searchParams.get("g") ?? "";
  const activeId = nav.guides[paramId] ? paramId : firstId;

  const guide = nav.guides[activeId];
  const railAccent = GUIDE_RAIL_ACCENT[nav.moduleId] ?? "#2563eb";
  const moduleLabel = (id: GuideModuleId) => MODULE_LABELS[id];
  const legendModules: GuideModuleId[] = ["operasional", "finance", "hris", "mobile"];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 pt-3 pb-0 bg-white border-b border-slds-border shrink-0">
        <h1 className="text-xl font-bold text-slds-text">{nav.title}</h1>
        <p className="text-[13px] text-slds-text-weak mt-0.5">{nav.subtitle}</p>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-[230px] shrink-0 bg-slds-bg border-r border-slds-border overflow-y-auto py-3 px-2">
          {nav.sections.map((section) => (
            <div key={section.key} className="mb-1">
              <div className="flex items-center gap-2 w-full px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-slds-text-weak">
                <ChevronRight size={14} className="text-slds-text-weak shrink-0 rotate-90" />
                <span className="flex-1 text-left">{section.label}</span>
                <span className="text-[10px] text-slds-text-weak">{section.items.length}</span>
              </div>
              {section.items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <Link
                    key={item.id}
                    href={`${pathname}?g=${encodeURIComponent(item.id)}`}
                    scroll={false}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center w-full ml-2 pl-5 pr-3 py-1.5 text-xs rounded-md mb-0.5 transition-colors no-underline ${
                      isActive ? "text-white font-semibold" : "text-slds-text-weak hover:bg-white hover:text-slds-text"
                    }`}
                    style={isActive ? { background: railAccent } : undefined}
                  >
                    <span className="flex-1 text-left leading-snug">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-slds-bg px-5 py-4" key={activeId}>
          {!guide ? (
            <div className="py-16 text-center text-[13px] text-slds-text-weak">Pilih menu di sidebar kiri.</div>
          ) : (
            <>
              <div className="mb-5">
                <div className="text-[11px] text-slds-text-weak mb-1">{guide.menuLabel}</div>
                <h2 className="text-lg font-bold text-slds-text">{guide.title}</h2>
                <p className="text-[13px] text-slds-text-weak mt-1 max-w-lg">{guide.summary}</p>
              </div>

              <div className="flex flex-col items-center gap-0 py-2 pb-6">
                {guide.actions.map((action, idx) => (
                  <div key={idx} className="flex flex-col items-center w-full">
                    {idx > 0 && (
                      <div className="flex flex-col items-center py-1.5 text-slds-border">
                        <div className="w-0.5 h-3 bg-slds-border" />
                        <ArrowDown size={16} className="text-slds-text-weak" />
                        <div className="w-0.5 h-3 bg-slds-border" />
                      </div>
                    )}
                    <FlowNode action={action} moduleLabel={moduleLabel} />
                  </div>
                ))}
              </div>

              <div className="max-w-[280px] mx-auto px-3 py-2.5 bg-white border border-slds-border rounded-lg text-[11px] text-slds-text-weak text-center">
                {legendModules.map((mod, i) => (
                  <span key={mod}>
                    {i > 0 && <span className="mx-2">·</span>}
                    <span style={{ color: MODULE_THEME[mod].badge }}>■ {moduleLabel(mod)}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ModuleGuidePage(props: ModuleGuidePageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slds-text-weak">Memuat panduan...</div>}>
      <ModuleGuidePageInner {...props} />
    </Suspense>
  );
}

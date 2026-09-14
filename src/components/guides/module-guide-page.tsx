"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ChevronRight } from "lucide-react";
import type { FlowAction, GuideModuleId, ModuleGuideNav } from "@/lib/module-guides/types";

const MODULE_LABELS: Record<GuideModuleId, string> = {
  operasional: "Operasional",
  finance: "Finance",
  hris: "HRIS",
  mobile: "App Tinter",
};

const MODULE_THEME: Record<GuideModuleId, { border: string; badge: string; badgeText: string }> = {
  operasional: { border: "#fdba74", badge: "#ea580c", badgeText: "#fff" },
  finance: { border: "#fcd34d", badge: "#d97706", badgeText: "#fff" },
  hris: { border: "#93c5fd", badge: "#2563eb", badgeText: "#fff" },
  mobile: { border: "#6ee7b7", badge: "#059669", badgeText: "#fff" },
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
      className="w-full max-w-[280px] bg-white rounded-[10px] p-3.5 text-center border-2"
      style={{ borderColor: theme.border }}
    >
      <div
        className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2"
        style={{ background: theme.badge, color: theme.badgeText }}
      >
        {moduleLabel(action.module)}
      </div>
      {action.href ? (
        <Link
          href={action.href}
          className="block text-sm font-semibold no-underline"
          style={{ color: theme.badge }}
        >
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

export function ModuleGuidePage({ nav }: ModuleGuidePageProps) {
  const firstId = nav.sections[0]?.items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstId);
  const [expandedSections, setExpandedSections] = useState<string[]>(nav.sections.map((s) => s.key));

  const guide = nav.guides[activeId];
  const railAccent = GUIDE_RAIL_ACCENT[nav.moduleId] ?? "#2563eb";
  const moduleLabel = (id: GuideModuleId) => MODULE_LABELS[id];
  const legendModules: GuideModuleId[] = ["operasional", "finance", "hris", "mobile"];

  const toggleSection = (key: string) => {
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 pt-3 pb-0 bg-white shrink-0">
        <h1 className="text-xl font-bold text-slds-text">{nav.title}</h1>
        <p className="text-[13px] text-slds-text-weak mt-0.5">{nav.subtitle}</p>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-[230px] shrink-0 bg-[#f8f9fa] border-r border-slds-border overflow-y-auto py-3 px-2">
          {nav.sections.map((section) => {
            const isExpanded = expandedSections.includes(section.key);
            return (
              <div key={section.key} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-slds-text bg-transparent border-none cursor-pointer"
                >
                  <ChevronRight
                    size={14}
                    className="text-slds-text-weak shrink-0 transition-transform duration-150"
                    style={{ transform: isExpanded ? "rotate(90deg)" : undefined }}
                  />
                  <span className="flex-1 text-left">{section.label}</span>
                  <span className="text-[10px] text-slds-text-weak">{section.items.length}</span>
                </button>
                {isExpanded &&
                  section.items.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className={`flex items-center w-full ml-2 pl-5 pr-3 py-1.5 text-xs rounded-md mb-0.5 transition-colors border-none cursor-pointer text-left ${
                          isActive ? "text-white font-semibold" : "text-slds-text-weak hover:bg-white hover:text-slds-text bg-transparent"
                        }`}
                        style={isActive ? { background: railAccent } : undefined}
                      >
                        <span className="flex-1 leading-snug">{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] px-5 py-4" key={activeId}>
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
                      <div className="flex flex-col items-center py-1.5 text-[#ddd]">
                        <div className="w-0.5 h-3 bg-[#ddd]" />
                        <ArrowDown size={16} className="text-slds-text-weak" />
                        <div className="w-0.5 h-3 bg-[#ddd]" />
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

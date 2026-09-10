"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, RotateCcw, Paintbrush } from "lucide-react";
import { DEMO_CHECKLIST } from "@/lib/stok-chain-utils";
import { useDemoChecklist } from "@/lib/preview-store";

export default function DemoChecklistPage() {
  const router = useRouter();
  const { checked, toggle, reset } = useDemoChecklist();
  const done = DEMO_CHECKLIST.filter((i) => checked[i.id]).length;
  const groups = [...new Set(DEMO_CHECKLIST.map((i) => i.group))];

  return (
    <div className="min-h-screen bg-slds-bg">
      <header className="sticky top-0 z-30 bg-white border-b border-slds-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
              <Paintbrush className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slds-text">Demo Walkthrough</h1>
              <p className="text-[10px] uppercase tracking-wider text-slds-text-weak">Presentasi ke Pak David</p>
            </div>
          </div>
          <button type="button" data-no-toast onClick={() => router.push("/modules")} className="text-[13px] text-brand font-semibold flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Modul
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white border border-slds-border rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-bold text-slds-text">Progress Demo</p>
            <span className="text-[13px] font-bold text-brand">{done}/{DEMO_CHECKLIST.length}</span>
          </div>
          <div className="h-2 bg-slds-bg rounded-full overflow-hidden">
            <div className="h-full bg-brand transition-all" style={{ width: `${(done / DEMO_CHECKLIST.length) * 100}%` }} />
          </div>
          <button type="button" data-no-toast onClick={reset} className="mt-3 text-[12px] text-slds-text-weak hover:text-slds-text flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> Reset checklist
          </button>
        </div>

        {groups.map((group) => (
          <div key={group} className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2">{group}</p>
            <div className="bg-white border border-slds-border rounded-lg divide-y divide-slds-border">
              {DEMO_CHECKLIST.filter((i) => i.group === group).map((item) => {
                const isDone = !!checked[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => toggle(item.id)}
                      className="shrink-0"
                      aria-label={isDone ? "Uncheck" : "Check"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slds-text-weak" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] ${isDone ? "text-slds-text-weak line-through" : "text-slds-text font-medium"}`}>
                        {item.label}
                      </p>
                    </div>
                    <Link href={item.href} className="text-[12px] font-semibold text-brand shrink-0 hover:underline">
                      Buka →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

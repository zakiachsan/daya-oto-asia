import Link from "next/link";
import { ArrowRight, Check, AlertTriangle, Circle } from "lucide-react";
import type { StokChainStep } from "@/lib/stok-chain-utils";

function StepIcon({ status }: { status: StokChainStep["status"] }) {
  if (status === "done") return <Check className="h-3.5 w-3.5 text-green-700" />;
  if (status === "alert") return <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />;
  if (status === "active") return <Circle className="h-3.5 w-3.5 text-brand fill-brand/20" />;
  return <Circle className="h-3.5 w-3.5 text-slds-text-weak" />;
}

export function StokChainVisual({ steps }: { steps: StokChainStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0
              ${step.status === "done" ? "bg-green-100" : step.status === "alert" ? "bg-amber-100" : step.status === "active" ? "bg-brand/10" : "bg-slds-bg"}`}>
              <StepIcon status={step.status} />
            </div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 min-h-[24px] bg-slds-border my-1" />}
          </div>
          <Link href={step.href} className="flex-1 pb-4 group">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-slds-text group-hover:text-brand">{step.label}</p>
                <p className="text-[12px] text-slds-text-weak mt-0.5">{step.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slds-text-weak group-hover:text-brand shrink-0 mt-0.5" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

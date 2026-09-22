import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Construction } from "lucide-react";
import type { FinancePlaceholderDef } from "@/lib/finance-placeholder-config";

export function FinancePlaceholderPage({ title, section, desc, features, mirrorHref, mirrorLabel }: FinancePlaceholderDef) {
  return (
    <div>
      <PageHeader
        title={title}
        desc={desc ?? `Modul ${section} · struktur Accurate (UI preview)`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: section },
          { label: title },
        ]}
      />
      <div className="bg-white border border-slds-border rounded-lg p-8 text-center">
        <Construction className="h-10 w-10 mx-auto text-slds-text-weak/40 mb-3" />
        <p className="text-base font-bold text-slds-text">UI Placeholder</p>
        <p className="text-[13px] text-slds-text-weak mt-1 max-w-md mx-auto">
          Halaman ini bagian restructure menu Accurate-style. Implementasi fungsional menyusul.
        </p>
        {features && features.length > 0 && (
          <ul className="mt-4 text-left max-w-sm mx-auto space-y-1.5">
            {features.map((f) => (
              <li key={f} className="text-[13px] text-slds-text flex items-start gap-2">
                <span className="text-brand mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        {mirrorHref && (
          <Link
            href={mirrorHref}
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 bg-brand/10 text-brand rounded-lg text-[13px] font-semibold hover:bg-brand/20"
          >
            <ExternalLink className="h-4 w-4" />
            {mirrorLabel ?? "Buka modul terkait"}
          </Link>
        )}
      </div>
    </div>
  );
}

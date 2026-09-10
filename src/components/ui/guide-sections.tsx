import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type GuideSection = {
  title: string;
  body: string;
  links?: { href: string; label: string }[];
};

export function GuideSections({ sections }: { sections: GuideSection[] }) {
  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <details key={s.title} className="bg-white border border-slds-border rounded-lg group" open>
          <summary className="px-4 py-3 cursor-pointer text-[14px] font-bold text-slds-text list-none flex items-center justify-between">
            {s.title}
            <ChevronRight className="h-4 w-4 text-slds-text-weak group-open:rotate-90 transition-transform" />
          </summary>
          <div className="px-4 pb-4 border-t border-slds-border pt-3">
            <p className="text-[13px] text-slds-text leading-relaxed whitespace-pre-line">{s.body}</p>
            {s.links && s.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {s.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-[12px] font-semibold text-brand hover:underline">
                    → {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

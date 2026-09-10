import { PageHeader } from "./page-header";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  desc?: string;
  moduleHref: string;
  features?: string[];
}

export function PlaceholderPage({ title, desc, moduleHref, features }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        desc={desc}
        breadcrumb={[
          { label: "Modul", href: moduleHref },
          { label: title },
        ]}
      />
      <div className="bg-white border border-slds-border rounded-lg p-8 text-center">
        <Construction className="h-10 w-10 mx-auto text-slds-text-weak/40 mb-3" />
        <p className="text-base font-bold text-slds-text">UI Placeholder</p>
        <p className="text-[13px] text-slds-text-weak mt-1 max-w-md mx-auto">
          Halaman ini akan diisi dengan komponen final. Struktur navigasi & layout sudah siap.
        </p>
        {features && features.length > 0 && (
          <ul className="mt-4 text-left max-w-sm mx-auto space-y-1.5">
            {features.map((f) => (
              <li key={f} className="text-[13px] text-slds-text flex items-start gap-2">
                <span className="text-brand mt-0.5">•</span>{f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Search } from "lucide-react";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: { label: string; options: string[] }[];
}

export function FilterBar({ searchPlaceholder = "Cari...", filters = [] }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
        <input
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
        />
      </div>
      {filters.map((f) => (
        <select
          key={f.label}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none bg-white"
        >
          {f.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

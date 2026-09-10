import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red" | "amber";
}

const COLORS = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
};

export function StatCard({ label, value, sub, icon: Icon, color = "blue" }: StatCardProps) {
  return (
    <div className="bg-white border border-slds-border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slds-text-weak">{label}</p>
          <p className="text-2xl font-bold text-slds-text mt-1">{value}</p>
          {sub && <p className="text-[11px] text-slds-text-weak mt-0.5">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${COLORS[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

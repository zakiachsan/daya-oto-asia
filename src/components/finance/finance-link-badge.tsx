import Link from "next/link";
import {
  FINANCE_STATUS_CLASS,
  FINANCE_STATUS_LABELS,
  type FinanceLinkStatus,
} from "@/lib/ops-finance-bridge";

export function FinanceLinkBadge({
  status,
  href,
}: {
  status: FinanceLinkStatus;
  href?: string;
}) {
  const label = FINANCE_STATUS_LABELS[status];
  const className = `inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${FINANCE_STATUS_CLASS[status]}`;

  if (href && status !== "none") {
    return (
      <Link href={href} className={`${className} hover:underline`}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}

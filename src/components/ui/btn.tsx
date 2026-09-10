"use client";

import Link from "next/link";
import { useToast } from "./toast";

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "success";

const VARIANTS: Record<BtnVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark border border-brand",
  secondary: "bg-white text-slds-text border border-slds-border hover:bg-slds-bg",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
  success: "bg-green-600 text-white hover:bg-green-700 border border-green-600",
  ghost: "bg-transparent text-brand border border-brand hover:bg-brand/5",
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  toastMsg?: string;
  toastType?: "success" | "error" | "info";
  href?: string;
}

export function Btn({
  variant = "primary",
  toastMsg,
  toastType = "success",
  href,
  onClick,
  className = "",
  children,
  disabled,
  ...rest
}: BtnProps) {
  const { toast } = useToast();
  const base = `inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && toastMsg) toast(toastMsg, toastType);
  };

  if (href && !disabled) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={base} onClick={handleClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

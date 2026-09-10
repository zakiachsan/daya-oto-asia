"use client";

import { ToastProvider } from "@/components/ui/toast";
import { PreviewClickHandler } from "./preview-click-handler";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PreviewClickHandler />
      {children}
    </ToastProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

function getButtonLabel(btn: HTMLButtonElement) {
  return (
    btn.getAttribute("aria-label") ||
    btn.getAttribute("title") ||
    btn.textContent?.trim().replace(/\s+/g, " ").slice(0, 50) ||
    ""
  );
}

function shouldSkipButton(btn: HTMLButtonElement) {
  if (btn.hasAttribute("disabled") || btn.getAttribute("aria-disabled") === "true") return true;
  if (btn.hasAttribute("data-no-toast")) return true;
  if (btn.type === "submit") return true;
  // Tab switches
  if (btn.className.includes("border-b-2")) return true;
  return false;
}

/** Global handler for UI preview · shows toast feedback on button clicks. */
export function PreviewClickHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const dataToastEl = target.closest("[data-toast]") as HTMLElement | null;
      if (dataToastEl && !dataToastEl.hasAttribute("data-no-toast")) {
        const msg = dataToastEl.getAttribute("data-toast");
        if (msg) {
          const type = (dataToastEl.getAttribute("data-toast-type") as "success" | "error" | "info") || "success";
          toast(msg, type);
          return;
        }
      }

      const btn = target.closest("button") as HTMLButtonElement | null;
      if (!btn || shouldSkipButton(btn)) return;

      const label = getButtonLabel(btn);
      if (!label) return;

      const lower = label.toLowerCase();
      if (lower === "batal" || lower === "kembali") return;

      toast(`"${label}" · berhasil (preview UI)`, "info");
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [toast]);

  return null;
}

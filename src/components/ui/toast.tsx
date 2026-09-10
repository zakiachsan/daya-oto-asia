"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{ toast: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2 min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg border text-[13px] toast-enter
              ${t.type === "success" ? "bg-white border-green-200 text-green-900" : ""}
              ${t.type === "error" ? "bg-white border-red-200 text-red-900" : ""}
              ${t.type === "info" ? "bg-white border-blue-200 text-blue-900" : ""}`}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />}
            {t.type === "error" && <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
            {t.type === "info" && <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />}
            <span className="flex-1">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="shrink-0 opacity-50 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

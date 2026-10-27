"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/** Lama tampil maksimal · permintaan user: notifikasi hilang sendiri, paling lama ~5 detik */
const TOAST_DURATION_MS = 4000;
/** Batas tumpukan supaya notifikasi tidak menutupi layar */
const MAX_TOASTS = 3;

const ToastContext = createContext<{ toast: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  /* id naik terus (bukan Date.now()) supaya dua toast di milidetik yang sama tidak bertabrakan */
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    idRef.current += 1;
    const id = idRef.current;

    setToasts((prev) => {
      /* pesan yang sama tidak ditumpuk, cukup satu */
      const tanpaDuplikat = prev.filter((t) => !(t.message === message && t.type === type));
      return [...tanpaDuplikat, { id, message, type }].slice(-MAX_TOASTS);
    });

    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
    timersRef.current.set(id, timer);
  }, []);

  /* bersihkan timer saat provider dilepas */
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* data-no-toast: klik di area notifikasi tidak boleh memicu handler preview global */}
      {/* bottom-20 di layar kecil supaya tidak menutupi bottom nav app tinter */}
      <div
        data-no-toast
        data-toast-region
        className="fixed bottom-20 sm:bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            data-no-toast
            role="status"
            className={`pointer-events-auto flex items-start gap-2 min-w-[260px] max-w-sm px-4 py-3 rounded-lg shadow-lg border text-[13px] toast-enter
              ${t.type === "success" ? "bg-white border-green-200 text-green-900" : ""}
              ${t.type === "error" ? "bg-white border-red-200 text-red-900" : ""}
              ${t.type === "info" ? "bg-white border-blue-200 text-blue-900" : ""}`}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />}
            {t.type === "error" && <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
            {t.type === "info" && <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />}
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              data-no-toast
              aria-label="Tutup notifikasi"
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-50 hover:opacity-100 p-0.5"
            >
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

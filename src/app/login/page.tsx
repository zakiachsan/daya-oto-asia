"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Paintbrush, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/modules"), 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slds-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-brand mb-4">
            <Paintbrush className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slds-text">Daya Oto Asia</h1>
          <p className="text-[13px] text-slds-text-weak mt-1">Sistem Cat Body Repair Terpadu</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slds-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] text-slds-text-weak mb-1">Email</label>
              <input
                type="email"
                defaultValue="admin@dayaoto.com"
                className="w-full px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] text-slds-text-weak mb-1">Password</label>
              <input
                type="password"
                defaultValue="demo123"
                className="w-full px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand text-white rounded-md font-semibold text-[13px] hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Masuk"}
            </button>
          </form>
          <p className="text-[11px] text-slds-text-weak text-center mt-4">
            UI Preview — klik Masuk untuk lanjut (tanpa backend)
          </p>
        </div>
      </div>
    </div>
  );
}

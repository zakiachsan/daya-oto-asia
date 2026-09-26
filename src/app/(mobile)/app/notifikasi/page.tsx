"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { useAdminNotifications } from "@/lib/preview-store";
import { MOBILE_USER } from "@/lib/mobile-app-utils";

export default function NotifikasiPage() {
  const { items, markRead } = useAdminNotifications(MOBILE_USER);

  return (
    <div className="space-y-4">
      <Link href="/app" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Beranda
      </Link>
      <h1 className="text-lg font-bold text-slds-text flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand" /> Notifikasi Admin
      </h1>
      {items.map((n) => {
        const unread = !n.readBy.includes(MOBILE_USER);
        return (
          <button
            key={n.id}
            type="button"
            data-no-toast
            onClick={() => markRead(n.id)}
            className={`w-full text-left bg-white rounded-xl p-4 border ${unread ? "border-brand/30 bg-brand/5" : "border-slds-border"}`}
          >
            <p className="text-[13px] font-bold text-slds-text">{n.title}</p>
            <p className="text-[12px] text-slds-text-weak mt-1 leading-snug">{n.body}</p>
            <p className="text-[10px] text-slds-text-weak mt-2">{new Date(n.createdAt).toLocaleString("id-ID")}</p>
            {unread && <p className="text-[10px] font-bold text-brand mt-1">Tap untuk tandai dibaca</p>}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { MapPin, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AppAbsensiPage() {
  const { toast } = useToast();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  function handleCheckIn() {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(now);
    toast(`Check-in berhasil pukul ${now}`, "success");
  }

  function handleCheckOut() {
    setCheckedIn(false);
    setCheckInTime(null);
    toast("Check-out berhasil", "success");
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border text-center">
        <p className="text-[12px] text-slds-text-weak">Kamis, 10 September 2026</p>
        <p className="text-3xl font-bold text-slds-text mt-1">13:34</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-[11px] text-slds-text-weak">
          <MapPin className="h-3.5 w-3.5" />
          Auto 2000 Surabaya — dalam radius
        </div>
        {checkedIn && checkInTime && (
          <p className="mt-2 text-[12px] font-semibold text-green-700">Sudah check-in: {checkInTime}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          data-no-toast
          onClick={handleCheckIn}
          disabled={checkedIn}
          className="flex flex-col items-center gap-2 py-5 bg-green-600 text-white rounded-xl font-bold disabled:opacity-50"
        >
          <LogIn className="h-6 w-6" />
          <span className="text-[13px]">Check In</span>
        </button>
        <button
          type="button"
          data-no-toast
          onClick={handleCheckOut}
          disabled={!checkedIn}
          className="flex flex-col items-center gap-2 py-5 bg-white border-2 border-slds-border text-slds-text rounded-xl font-bold disabled:opacity-50 disabled:text-slds-text-weak"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-[13px]">Check Out</span>
        </button>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat Minggu Ini</p>
        <div className="space-y-2">
          {[
            { hari: "Sen, 8 Sep", in: "07:55", out: "17:02", status: "Hadir" },
            { hari: "Sel, 9 Sep", in: "08:05", out: "17:10", status: "Telat" },
          ].map((r) => (
            <div key={r.hari} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slds-border">
              <div>
                <p className="text-[13px] font-semibold text-slds-text">{r.hari}</p>
                <p className="text-[11px] text-slds-text-weak">{r.in} — {r.out}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                ${r.status === "Hadir" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

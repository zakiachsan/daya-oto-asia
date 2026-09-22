"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, LogIn, LogOut, Clock, Calendar, AlertTriangle, X, MapPinOff, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  MOCK_GEOFENCE,
  absensiStatusClass,
  checkGeofence,
  filterRiwayatMingguIni,
  formatAbsensiHari,
  geofenceStatusLabel,
  isAbsensiLuarRadius,
  resolveMockGps,
  todayIso,
} from "@/lib/absensi-utils";
import { useAbsensiRiwayat } from "@/lib/preview-store";

function AppAbsensiContent() {
  const { toast } = useToast();
  const router = useRouter();
  const { items: riwayatItems, recordCheckIn, recordCheckOut, reset } = useAbsensiRiwayat();
  const searchParams = useSearchParams();
  const [simulateOutside, setSimulateOutside] = useState(true);
  const didAutoReset = useRef(false);
  const didAutoOpenModal = useRef(false);

  useEffect(() => {
    const luar = searchParams.get("luar");
    if (luar === "1") setSimulateOutside(true);
    else if (luar === "0" || searchParams.get("dalam") === "1") setSimulateOutside(false);
  }, [searchParams]);

  const gps = useMemo(() => resolveMockGps(simulateOutside), [simulateOutside]);
  const geofence = useMemo(
    () => checkGeofence(gps.lat, gps.lng, MOCK_GEOFENCE),
    [gps.lat, gps.lng],
  );
  const riwayatMingguIni = useMemo(() => filterRiwayatMingguIni(riwayatItems), [riwayatItems]);
  const todayRecord = useMemo(
    () => riwayatItems.find((r) => r.tanggal === todayIso()),
    [riwayatItems],
  );

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkInLuarRadius, setCheckInLuarRadius] = useState(false);
  const [alasanCheckIn, setAlasanCheckIn] = useState<string | null>(null);
  const [showLuarRadiusModal, setShowLuarRadiusModal] = useState(false);
  const [keteranganLuar, setKeteranganLuar] = useState("");

  useEffect(() => {
    if (searchParams.get("reset") !== "1" || didAutoReset.current) return;
    didAutoReset.current = true;
    reset();
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckInLuarRadius(false);
    setAlasanCheckIn(null);
    setShowLuarRadiusModal(false);
    setKeteranganLuar("");
    toast("Data absensi direset · siap untuk test", "info");
    setSimulateOutside(true);
    didAutoOpenModal.current = false;
    setShowLuarRadiusModal(true);
    router.replace("/app/absensi?luar=1");
  }, [searchParams, reset, router, toast]);

  useEffect(() => {
    if (didAutoOpenModal.current || geofence.withinRadius) return;
    const activeToday = Boolean(todayRecord && todayRecord.checkOut === null);
    if (activeToday) return;
    didAutoOpenModal.current = true;
    setShowLuarRadiusModal(true);
  }, [geofence.withinRadius, todayRecord]);

  useEffect(() => {
    if (!todayRecord) {
      setCheckedIn(false);
      setCheckInTime(null);
      setCheckInLuarRadius(false);
      setAlasanCheckIn(null);
      return;
    }
    const active = todayRecord.checkOut === null;
    setCheckedIn(active);
    setCheckInTime(active ? todayRecord.checkIn : null);
    setCheckInLuarRadius(isAbsensiLuarRadius(todayRecord));
    setAlasanCheckIn(todayRecord.keteranganLuar ?? null);
  }, [todayRecord]);

  function completeCheckIn(luarRadius: boolean, keterangan?: string) {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(true);
    setCheckInTime(now);
    setCheckInLuarRadius(luarRadius);
    setAlasanCheckIn(keterangan ?? null);
    setShowLuarRadiusModal(false);
    setKeteranganLuar("");
    recordCheckIn({
      checkIn: now,
      status: luarRadius ? "Luar Radius" : "Hadir",
      keteranganLuar: keterangan,
    });
    toast(
      luarRadius && keterangan
        ? `Check-in luar radius · ${keterangan} (${now})`
        : `Check-in berhasil pukul ${now}`,
      luarRadius ? "info" : "success",
    );
  }

  function handleCheckIn() {
    if (checkedIn) return;
    if (!geofence.withinRadius) {
      setShowLuarRadiusModal(true);
      return;
    }
    completeCheckIn(false);
  }

  function handleConfirmLuarRadius() {
    if (!keteranganLuar.trim()) {
      toast("Alasan wajib diisi untuk check-in di luar radius", "error");
      return;
    }
    completeCheckIn(true, keteranganLuar.trim());
  }

  function handleCheckOut() {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckInLuarRadius(false);
    setAlasanCheckIn(null);
    recordCheckOut(now);
    toast("Check-out berhasil", "success");
  }

  function closeLuarRadiusModal() {
    setShowLuarRadiusModal(false);
    setKeteranganLuar("");
  }

  function handleResetDemo() {
    reset();
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckInLuarRadius(false);
    setAlasanCheckIn(null);
    setKeteranganLuar("");
    setSimulateOutside(true);
    didAutoOpenModal.current = false;
    setShowLuarRadiusModal(true);
    toast("Data absensi direset · simulasi luar radius aktif", "info");
  }

  function toggleSimulasiGps() {
    setSimulateOutside((prev) => {
      const next = !prev;
      if (next && !checkedIn) {
        didAutoOpenModal.current = true;
        setShowLuarRadiusModal(true);
      } else {
        setShowLuarRadiusModal(false);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border text-center">
        <p className="text-[12px] text-slds-text-weak">Kamis, 10 September 2026</p>
        <p className="text-3xl font-bold text-slds-text mt-1">13:34</p>
        <div
          className={`flex items-center justify-center gap-1 mt-2 text-[11px]
            ${geofence.withinRadius ? "text-slds-text-weak" : "text-amber-700 font-semibold"}`}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {geofenceStatusLabel(geofence.withinRadius)}
        </div>
        {!geofence.withinRadius && !checkedIn && (
          <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
            Lokasi GPS ~{geofence.distanceM}m dari titik cabang · isi alasan di modal untuk check-in
          </p>
        )}
        <button
          type="button"
          data-no-toast
          onClick={toggleSimulasiGps}
          className={`mt-3 w-full py-2 rounded-lg text-[11px] font-semibold border transition-colors
            ${simulateOutside
              ? "bg-orange-50 border-orange-200 text-orange-800"
              : "bg-green-50 border-green-200 text-green-800"}`}
        >
          Simulasi GPS: {simulateOutside ? "Luar radius cabang (demo)" : "Dalam radius cabang"}
        </button>
        {checkedIn && checkInTime && (
          <div className="mt-3 space-y-2 text-left">
            <p className={`text-[12px] font-semibold text-center ${checkInLuarRadius ? "text-orange-700" : "text-green-700"}`}>
              {checkInLuarRadius ? "Check-in luar radius" : "Sudah check-in"}: {checkInTime}
            </p>
            {checkInLuarRadius && alasanCheckIn && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-orange-800 tracking-wide">
                  <MapPinOff className="h-3.5 w-3.5 shrink-0" />
                  Di luar geofence cabang
                </div>
                <p className="text-[12px] text-orange-900 mt-1.5 leading-snug">
                  <span className="font-semibold">Alasan: </span>
                  {alasanCheckIn}
                </p>
              </div>
            )}
          </div>
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

      <div className="grid grid-cols-2 gap-2">
        <Link href="/app/izin" className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slds-border">
          <Calendar className="h-5 w-5 text-brand" />
          <span className="text-[13px] font-semibold">Izin & Cuti</span>
        </Link>
        <Link href="/app/lembur" className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slds-border">
          <Clock className="h-5 w-5 text-brand" />
          <span className="text-[13px] font-semibold">Lembur</span>
        </Link>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat Minggu Ini</p>
        <div className="space-y-2">
          {riwayatMingguIni.length === 0 ? (
            <p className="text-[13px] text-slds-text-weak text-center py-4 bg-white rounded-xl border border-slds-border">
              Belum ada riwayat minggu ini
            </p>
          ) : (
            riwayatMingguIni.map((r) => {
              const luarRadius = isAbsensiLuarRadius(r);
              return (
                <div
                  key={r.id}
                  className={`rounded-xl p-3 border flex items-start justify-between gap-3
                    ${luarRadius ? "bg-orange-50/60 border-orange-200" : "bg-white border-slds-border"}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {luarRadius && <MapPinOff className="h-3.5 w-3.5 text-orange-600 shrink-0" />}
                      <p className="text-[13px] font-semibold text-slds-text">{formatAbsensiHari(r.tanggal)}</p>
                    </div>
                    <p className="text-[11px] text-slds-text-weak mt-0.5">
                      {r.checkIn} · {r.checkOut ?? "-"}
                    </p>
                    {luarRadius && r.keteranganLuar && (
                      <p className="text-[11px] text-orange-800 mt-1.5 leading-snug">
                        <span className="font-semibold">Alasan luar radius:</span> {r.keteranganLuar}
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${absensiStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        type="button"
        data-no-toast
        onClick={handleResetDemo}
        className="w-full py-2.5 text-[12px] font-semibold text-slds-text-weak border border-dashed border-slds-border rounded-xl flex items-center justify-center gap-1.5 hover:text-brand hover:border-brand/40"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset data demo
      </button>

      {showLuarRadiusModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="luar-radius-title"
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 pb-8 sm:pb-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-amber-100 rounded-full shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h2 id="luar-radius-title" className="text-[15px] font-bold text-slds-text">
                    Check-in di Luar Radius
                  </h2>
                  <p className="text-[12px] text-slds-text-weak mt-1">
                    GPS terdeteksi ~{geofence.distanceM}m dari {MOCK_GEOFENCE.cabangNama} (radius {MOCK_GEOFENCE.radiusM}m).
                    Isi alasan sebelum melanjutkan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-no-toast
                onClick={closeLuarRadiusModal}
                className="p-1 text-slds-text-weak hover:text-slds-text"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="block">
              <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Alasan check-in di luar radius *</span>
              <textarea
                value={keteranganLuar}
                onChange={(e) => setKeteranganLuar(e.target.value)}
                rows={3}
                autoFocus
                placeholder="Contoh: backup ke cabang Sunter karena mesin Pluit maintenance"
                className="w-full mt-1.5 px-3 py-2.5 border border-slds-border rounded-lg text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </label>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                data-no-toast
                onClick={closeLuarRadiusModal}
                className="flex-1 py-2.5 border border-slds-border rounded-xl font-semibold text-[13px]"
              >
                Batal
              </button>
              <button
                type="button"
                data-no-toast
                onClick={handleConfirmLuarRadius}
                disabled={!keteranganLuar.trim()}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold text-[13px] disabled:opacity-50"
              >
                Konfirmasi Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppAbsensiPage() {
  return (
    <Suspense fallback={<div className="p-4 text-[13px] text-slds-text-weak">Memuat...</div>}>
      <AppAbsensiContent />
    </Suspense>
  );
}

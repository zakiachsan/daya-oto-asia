"use client";

import Link from "next/link";
import { Paintbrush, MapPin, Scale, Package, ChevronRight, Clock, FlaskConical, Calendar, Palette } from "lucide-react";
import { useTransaksiList } from "@/lib/preview-store";
import { MOBILE_USER, MOBILE_CABANG, useMobileHrPending } from "@/lib/mobile-app-utils";

function salam() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  return "Selamat sore";
}

export default function AppHome() {
  const { all } = useTransaksiList();
  const { izinItems, lemburItems, totalPending } = useMobileHrPending();
  const today = new Date().toISOString().slice(0, 10);
  const bulan = today.slice(0, 7);

  const myTrx = all.filter((t) => t.tinter === MOBILE_USER);
  const trxHariIni = myTrx.filter((t) => t.tanggal === today);
  const selesaiBulanIni = myTrx.filter((t) => t.tanggal.startsWith(bulan) && t.status === "Selesai");
  const menungguTTD = myTrx.filter((t) => t.status === "Menunggu TTD");

  const stats = [
    {
      label: "Transaksi Hari Ini",
      value: trxHariIni.length === 0 ? "0 warna" : `${trxHariIni.length} warna`,
      color: "text-brand",
    },
    {
      label: menungguTTD.length > 0 ? "Menunggu TTD" : "Selesai Bulan Ini",
      value: menungguTTD.length > 0 ? `${menungguTTD.length} trx` : `${selesaiBulanIni.length} trx`,
      color: menungguTTD.length > 0 ? "text-amber-600" : "text-green-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] text-slds-text-weak">{salam()},</p>
        <h2 className="text-lg font-bold text-slds-text">{MOBILE_USER}</h2>
        <p className="text-[12px] text-slds-text-weak">Tinter — {MOBILE_CABANG}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-slds-border">
            <p className="text-[10px] text-slds-text-weak uppercase font-semibold">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Link
        href="/app/transaksi/baru"
        className="flex items-center justify-center gap-2 w-full py-4 bg-brand text-white rounded-xl font-bold text-base shadow-md"
      >
        <Paintbrush className="h-5 w-5" />
        Buat Transaksi Warna
      </Link>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Menu Cepat</p>
        {[
          { href: "/app/absensi", icon: MapPin, label: "Absensi", sub: "Check-in GPS cabang" },
          { href: "/app/stock-opname", icon: Scale, label: "Stock Opname", sub: "Input timbang mingguan" },
          { href: "/app/buka-kaleng", icon: FlaskConical, label: "Buka Kaleng", sub: "Timbang kaleng baru" },
          { href: "/app/ajukan-stok", icon: Package, label: "Ajukan Stok", sub: "Permintaan bahan ke pusat" },
          { href: "/app/klaim-warna", icon: Palette, label: "Klaim Warna", sub: "Laporkan pekerjaan belum tercatat" },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-slds-border"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slds-bg">
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-slds-text">{label}</p>
              <p className="text-[11px] text-slds-text-weak">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slds-text-weak" />
          </Link>
        ))}
      </div>

      {(menungguTTD.length > 0 || totalPending > 0) && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Perlu Perhatian</p>
          {menungguTTD.map((trx) => (
            <Link
              key={trx.id}
              href={`/app/transaksi/${trx.id}`}
              className="block bg-amber-50 border border-amber-200 rounded-xl p-3 hover:bg-amber-100/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-amber-800">Menunggu TTD kepala bengkel</p>
                  <p className="text-[11px] text-amber-700">
                    {trx.id} — {trx.warna}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-600 ml-auto shrink-0" />
              </div>
            </Link>
          ))}
          {izinItems.map((iz) => (
            <Link
              key={iz.id}
              href={`/app/izin/${iz.id}`}
              className="block bg-blue-50 border border-blue-200 rounded-xl p-3 hover:bg-blue-100/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-blue-800">Izin menunggu approval</p>
                  <p className="text-[11px] text-blue-700">
                    {iz.tipe} · {iz.mulai} — {iz.selesai}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-600 ml-auto shrink-0" />
              </div>
            </Link>
          ))}
          {lemburItems.map((lb) => (
            <Link
              key={lb.id}
              href={`/app/lembur/${lb.id}`}
              className="block bg-violet-50 border border-violet-200 rounded-xl p-3 hover:bg-violet-100/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-violet-800">Lembur menunggu approval</p>
                  <p className="text-[11px] text-violet-700">
                    {lb.tanggal} · {lb.jam} jam
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-violet-600 ml-auto shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

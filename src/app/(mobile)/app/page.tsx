"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Paintbrush, MapPin, Scale, Package, ChevronRight, Clock, Calendar, Palette, Wallet, Bell } from "lucide-react";
import { useAdminNotifications, useTransaksiList } from "@/lib/preview-store";
import { MOBILE_USER, MOBILE_CABANG, useMobileHrPending } from "@/lib/mobile-app-utils";

function salam() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  return "Selamat sore";
}

export default function AppHome() {
  const { all } = useTransaksiList();
  const { unread, items: notifs } = useAdminNotifications(MOBILE_USER);
  const [notifIdx, setNotifIdx] = useState(0);
  const { izinItems, lemburItems, kasbonItems, totalPending } = useMobileHrPending();

  const carousel = unread.length > 0 ? unread : notifs;

  useEffect(() => {
    if (carousel.length <= 1) return;
    const t = setInterval(() => setNotifIdx((i) => (i + 1) % carousel.length), 10000);
    return () => clearInterval(t);
  }, [carousel.length]);
  const today = new Date().toISOString().slice(0, 10);
  const bulan = today.slice(0, 7);

  const myTrx = all.filter((t) => t.tinter === MOBILE_USER);
  const trxHariIni = myTrx.filter((t) => t.tanggal === today);
  const selesaiBulanIni = myTrx.filter((t) => t.tanggal.startsWith(bulan) && t.status === "Selesai");
  const menungguOpb = myTrx.filter((t) => t.status === "Menunggu OPB" || t.status === "Menunggu TTD");

  const stats = [
    {
      label: "Transaksi Hari Ini",
      value: trxHariIni.length === 0 ? "0 trx" : `${trxHariIni.length} trx`,
      color: "text-brand",
    },
    {
      label: menungguOpb.length > 0 ? "Perlu Tindak Lanjut" : "Selesai Bulan Ini",
      value: menungguOpb.length > 0 ? `${menungguOpb.length} trx` : `${selesaiBulanIni.length} trx`,
      color: menungguOpb.length > 0 ? "text-amber-600" : "text-green-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-slds-border">
        <p className="text-[12px] text-slds-text-weak">{salam()},</p>
        <h2 className="text-lg font-bold text-slds-text">{MOBILE_USER}</h2>
        <p className="text-[12px] text-slds-text-weak">Tinter · {MOBILE_CABANG}</p>
      </div>

      {carousel.length > 0 && (
        <Link
          href="/app/notifikasi"
          className="block bg-amber-50 border border-amber-200 rounded-xl p-3"
        >
          <p className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1">
            <Bell className="h-3.5 w-3.5" /> Admin · {unread.length > 0 ? `${unread.length} baru` : "Info"}
          </p>
          <p className="text-[13px] font-bold text-amber-950 mt-1">{carousel[notifIdx % carousel.length]?.title}</p>
          <p className="text-[11px] text-amber-900/80 mt-0.5 line-clamp-2">{carousel[notifIdx % carousel.length]?.body}</p>
        </Link>
      )}

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
        Buat Transaksi
      </Link>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Menu Cepat</p>
        {[
          { href: "/app/absensi", icon: MapPin, label: "Absensi", sub: "Check-in GPS cabang" },
          { href: "/app/stok", icon: Package, label: "Stok Cabang", sub: "Kaleng utuh + gram terbuka" },
          { href: "/app/stock-opname", icon: Scale, label: "Stock Opname", sub: "Timbang mingguan" },
          { href: "/app/ajukan-stok", icon: Package, label: "Ajukan Stok", sub: "Permintaan bahan ke pusat" },
          { href: "/app/klaim-nota", icon: Palette, label: "Klaim Nota", sub: "Batalkan nota tercetak" },
          { href: "/app/tukar-nota", icon: Palette, label: "Tukar-Tambah Nota", sub: "Gabung nota batal" },
          { href: "/app/terima-barang", icon: Package, label: "Terima Barang", sub: "Inbound distribusi" },
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

      {(menungguOpb.length > 0 || totalPending > 0) && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak px-1">Perlu Perhatian</p>
          {menungguOpb.map((trx) => (
            <Link
              key={trx.id}
              href={`/app/transaksi/${trx.id}`}
              className="block bg-amber-50 border border-amber-200 rounded-xl p-3 hover:bg-amber-100/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-amber-800">{trx.status} · perlu tindak lanjut</p>
                  <p className="text-[11px] text-amber-700">
                    {trx.id} · {trx.warna}
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
                    {iz.tipe} · {iz.mulai} · {iz.selesai}
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
          {kasbonItems.map((kb) => (
            <Link
              key={kb.id}
              href="/app/kasbon"
              className="block bg-emerald-50 border border-emerald-200 rounded-xl p-3 hover:bg-emerald-100/80 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Wallet className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-emerald-800">Kasbon menunggu approval</p>
                  <p className="text-[11px] text-emerald-700">
                    {kb.id} · Rp {kb.nominal.toLocaleString("id-ID")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-600 ml-auto shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

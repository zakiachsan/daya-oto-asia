"use client";

import { useMemo } from "react";
import { MOCK_KINERJA, formatDurasi } from "./mock-data";
import { useIzinList, useKasbon, useLemburList, useTransaksiList } from "./preview-store";
import { MOBILE_CABANG, MOBILE_USER } from "./mobile-app-constants";

export { MOBILE_CABANG, MOBILE_USER };

export function isPendingHrStatus(status: string) {
  return status === "Menunggu TTD" || status === "Draft";
}

export function useMobileHrPending() {
  const { items: izin } = useIzinList();
  const { items: lembur } = useLemburList();
  const { items: kasbon } = useKasbon();

  return useMemo(() => {
    const izinItems = izin.filter((i) => i.nama === MOBILE_USER && isPendingHrStatus(i.status));
    const lemburItems = lembur.filter((l) => l.nama === MOBILE_USER && isPendingHrStatus(l.status));
    const kasbonItems = kasbon.filter((k) => k.nama === MOBILE_USER && k.status === "Menunggu TTD");
    return {
      izinPending: izinItems.length,
      lemburPending: lemburItems.length,
      kasbonPending: kasbonItems.length,
      totalPending: izinItems.length + lemburItems.length + kasbonItems.length,
      izinItems,
      lemburItems,
      kasbonItems,
    };
  }, [izin, lembur, kasbon]);
}

export function useMobileKinerjaRingkas() {
  const { all } = useTransaksiList();
  const bulan = new Date().toISOString().slice(0, 7);
  const mock = MOCK_KINERJA.find((k) => k.nama === MOBILE_USER);

  return useMemo(() => {
    const trxBulan = all.filter((t) => t.tinter === MOBILE_USER && t.tanggal.startsWith(bulan));
    const withDurasi = trxBulan.filter((t) => t.durasiMixingMenit != null);
    const avgMenit =
      withDurasi.length > 0
        ? Math.round(withDurasi.reduce((s, t) => s + (t.durasiMixingMenit ?? 0), 0) / withDurasi.length)
        : null;

    return {
      trxBulan: trxBulan.length > 0 ? trxBulan.length : (mock?.trxBulan ?? 0),
      avgDurasi: avgMenit != null ? formatDurasi(avgMenit) : (mock?.avgDurasi ?? "-"),
      kehadiran: mock?.kehadiran ?? "-",
      pemakaianBahan: mock?.pemakaianBahan ?? "-",
    };
  }, [all, bulan, mock]);
}

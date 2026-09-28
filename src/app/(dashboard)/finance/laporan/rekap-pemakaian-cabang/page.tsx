"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { formatIDR, MOCK_CABANG } from "@/lib/mock-data";
import { useDistribusiList, useKategoriHarga, useTransaksiList } from "@/lib/preview-store";
import { distribusiStatus } from "@/lib/distribusi-utils";
import { hargaUnitProduk, literPerUnit } from "@/lib/kategori-harga-utils";

/**
 * Rekap Pemakaian Cabang per bulan (IDR) · feedback #60:
 * bandingkan nilai barang yang DITERIMA cabang dari pusat vs omset dari nota di bulan yang sama.
 * Nilai barang pakai tarif jual master Kategori Harga (kategori tarif tiap produk).
 */
export default function RekapPemakaianCabangPage() {
  const { all: transaksi } = useTransaksiList();
  const { items: distribusi } = useDistribusiList();
  const { items: kategoriHarga } = useKategoriHarga();
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7));

  const rows = useMemo(
    () =>
      MOCK_CABANG.map((c) => {
        const kota = c.nama.replace(/^Bengkel /, "");
        const kunci = kota.split(" ").pop() ?? kota;

        /* kiriman yang benar-benar diterima cabang di bulan itu (pakai tanggal terima) */
        const diterima = distribusi.filter(
          (d) => d.ke.includes(kunci) && distribusiStatus(d) === "Selesai" && (d.waktuTerima ?? "").startsWith(bulan),
        );
        const jalan = distribusi.filter((d) => d.ke.includes(kunci) && distribusiStatus(d) === "Dalam Perjalanan");

        let nilaiTerima = 0;
        let liter = 0;
        let unit = 0;
        diterima.forEach((d) => {
          const lines = d.terima
            ? d.terima.lines.map((l) => ({ kode: l.kode, qty: l.qtyTerima }))
            : d.lines.map((l) => ({ kode: l.kode, qty: l.qty }));
          lines.forEach((l) => {
            nilaiTerima += l.qty * hargaUnitProduk(l.kode, kategoriHarga);
            liter += l.qty * literPerUnit(l.kode);
            unit += l.qty;
          });
        });

        const nota = transaksi.filter(
          (t) =>
            t.cabang.includes(kunci) &&
            t.tanggal.startsWith(bulan) &&
            t.status !== "Draft" &&
            t.status !== "Dibatalkan",
        );
        const omset = nota.reduce((s, t) => s + t.total, 0);

        return {
          cabang: kota,
          nilaiTerima,
          jmlKiriman: diterima.length,
          jalan: jalan.length,
          liter,
          unit,
          omset,
          jmlNota: nota.length,
          selisih: nilaiTerima - omset,
          rasio: nilaiTerima > 0 ? omset / nilaiTerima : 0,
        };
      }),
    [distribusi, transaksi, kategoriHarga, bulan],
  );

  const totalTerima = rows.reduce((s, r) => s + r.nilaiTerima, 0);
  const totalOmset = rows.reduce((s, r) => s + r.omset, 0);
  const jmlKiriman = rows.reduce((s, r) => s + r.jmlKiriman, 0);

  return (
    <div>
      <PageHeader
        title="Rekap Pemakaian Cabang"
        desc="Nilai barang yang diterima cabang dari pusat vs omset dari nota, per bulan (IDR)"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Rekap Pemakaian Cabang" }]}
      />

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="block text-[12px]">
          <span className="text-[11px] text-slds-text-weak uppercase font-semibold">Bulan</span>
          <input
            type="month"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="block mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]"
          />
        </label>
        <p className="text-[12px] text-slds-text-weak pb-2">
          Nilai barang dihitung dari tanggal <strong>diterima cabang</strong> · tarif dari{" "}
          <Link href="/operasional/kategori-harga" className="text-brand font-semibold hover:underline">
            master Kategori Harga
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slds-text-weak">Barang Diterima</p>
          <p className="text-2xl font-bold text-slds-text mt-1">{formatIDR(totalTerima)}</p>
          <p className="text-[11px] text-slds-text-weak">{jmlKiriman} kiriman diterima</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slds-text-weak">Omset Nota</p>
          <p className="text-2xl font-bold text-brand mt-1">{formatIDR(totalOmset)}</p>
          <p className="text-[11px] text-slds-text-weak">{rows.reduce((s, r) => s + r.jmlNota, 0)} nota</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slds-text-weak">Selisih</p>
          <p className={`text-2xl font-bold mt-1 ${totalTerima - totalOmset > 0 ? "text-amber-700" : "text-green-700"}`}>
            {formatIDR(totalTerima - totalOmset)}
          </p>
          <p className="text-[11px] text-slds-text-weak">barang masuk − omset</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slds-text-weak">Tercapai</p>
          <p className="text-2xl font-bold text-slds-text mt-1">
            {totalTerima > 0 ? `${Math.round((totalOmset / totalTerima) * 100)}%` : "-"}
          </p>
          <p className="text-[11px] text-slds-text-weak">omset / barang diterima</p>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "cabang", label: "Cabang", render: (r) => <span className="font-semibold">{String(r.cabang)}</span> },
          {
            key: "nilaiTerima",
            label: "Barang Diterima",
            render: (r) => (
              <div className="text-right">
                <p className="font-semibold tabular-nums">{formatIDR(Number(r.nilaiTerima))}</p>
                <p className="text-[11px] text-slds-text-weak">
                  {r.jmlKiriman} kiriman · {Math.round(Number(r.liter))} L · {r.unit} unit
                </p>
              </div>
            ),
          },
          {
            key: "omset",
            label: "Omset Nota",
            render: (r) => (
              <div className="text-right">
                <p className="font-semibold tabular-nums text-brand">{formatIDR(Number(r.omset))}</p>
                <p className="text-[11px] text-slds-text-weak">{r.jmlNota} nota</p>
              </div>
            ),
          },
          {
            key: "selisih",
            label: "Selisih",
            render: (r) => (
              <span
                className={`block text-right font-bold tabular-nums ${Number(r.selisih) > 0 ? "text-amber-700" : "text-green-700"}`}
              >
                {formatIDR(Number(r.selisih))}
              </span>
            ),
          },
          {
            key: "rasio",
            label: "Tercapai",
            render: (r) =>
              Number(r.nilaiTerima) > 0 ? (
                <span className="block text-right tabular-nums">{Math.round(Number(r.rasio) * 100)}%</span>
              ) : (
                <span className="block text-right text-slds-text-weak">-</span>
              ),
          },
          {
            key: "jalan",
            label: "Info",
            render: (r) =>
              Number(r.jmlKiriman) === 0 && Number(r.jalan) === 0 ? (
                <span className="text-[11px] text-slds-text-weak">belum ada kiriman</span>
              ) : Number(r.jmlKiriman) === 0 ? (
                <span className="text-[11px] text-amber-700">{r.jalan} kiriman belum diterima</span>
              ) : (
                <span className="text-[11px] text-slds-text-weak">{r.jalan > 0 ? `${r.jalan} masih di jalan` : "—"}</span>
              ),
          },
        ]}
        data={rows}
      />

      <p className="mt-4 text-[11px] text-slds-text-weak">
        Barang diterima = surat jalan yang sudah dikonfirmasi cabang (tanggal terima) · nilainya memakai tarif per liter
        kategori tarif produk. Omset = nota cabang bulan itu (Draft &amp; Dibatalkan tidak dihitung).
      </p>
    </div>
  );
}

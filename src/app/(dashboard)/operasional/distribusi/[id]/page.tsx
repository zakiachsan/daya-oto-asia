"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Truck, Check, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatWaktu } from "@/lib/mock-data";
import { distribusiStatus, suratJalanId, suratJalanTerbit } from "@/lib/distribusi-utils";
import { useDistribusiList, useInventoriStok } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

/** Nilai awal input datetime-local pakai waktu lokal (bukan UTC) */
function localDatetimeValue(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DistribusiDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, update } = useDistribusiList();
  const { addManual } = useInventoriStok();
  const found = items.find((r) => r.id === id);
  const [showKirim, setShowKirim] = useState(false);
  const [driver, setDriver] = useState("");
  const [waktuKirimInput, setWaktuKirimInput] = useState(localDatetimeValue());

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Distribusi tidak ditemukan</p>
        <Link href="/operasional/distribusi" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const status = distribusiStatus(row);
  const sjId = suratJalanId(row.id);
  const terbit = suratJalanTerbit(row);

  function handleKirim() {
    const parsed = new Date(waktuKirimInput);
    const waktu = Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
    update(row.id, { waktuKirim: waktu, driver: driver.trim() || "Kurir Pusat" });
    setShowKirim(false);
    toast(`${row.id} dikirim · surat jalan ${sjId} terbit`, "success");
  }

  function handleTerima() {
    update(row.id, {
      status: "Selesai",
      waktuTerima: new Date().toISOString(),
      driver: row.driver ?? "Kurir Cabang",
    });
    for (const line of row.lines) {
      addManual({
        kodeProduk: line.kode,
        cabang: row.ke,
        kaleng: line.qty,
        gram: 0,
        keterangan: `Distribusi ${row.id} dari ${row.dari}`,
        oleh: "Admin Gudang",
      });
    }
    toast(`${row.id} diterima · stok ${row.ke} +${row.items} kaleng`, "success");
  }

  const timeline = [
    { label: "Distribusi Dibuat", waktu: `${row.tanggal}T08:00:00`, done: true, note: "Gudang Pusat" },
    { label: "Dikirim dari Pusat", waktu: row.waktuKirim ?? null, done: !!row.waktuKirim, note: row.driver },
    {
      label: "Surat Jalan Terbit",
      waktu: terbit ? (row.waktuKirim ?? null) : null,
      done: terbit,
      note: terbit ? sjId : "menunggu dikirim",
    },
    { label: "Diterima Cabang", waktu: row.waktuTerima ?? null, done: status === "Selesai", note: row.terima?.oleh },
  ];

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.dari} → ${row.ke}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Distribusi Cabang", href: "/operasional/distribusi" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={status} />}
      />

      <Link href="/operasional/distribusi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      {showKirim && (
        <ActionFormPanel
          title={`Kirim ${row.id}`}
          onClose={() => setShowKirim(false)}
          onSave={handleKirim}
          saveLabel="Kirim Distribusi"
        >
          <p className="text-[12px] text-slds-text-weak mb-3">
            Setelah dikirim, status jadi <strong>Dalam Perjalanan</strong> dan surat jalan{" "}
            <span className="font-mono">{sjId}</span> otomatis terbit. Cabang mengonfirmasi terima dari app.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Driver / Kurir</label>
              <input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Nama kurir" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Waktu Kirim</label>
              <input type="datetime-local" value={waktuKirimInput} onChange={(e) => setWaktuKirimInput(e.target.value)} className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2 flex items-center gap-2">
            <Truck className="h-4 w-4" /> Info Pengiriman
          </h3>
          <div className="flex justify-between items-center"><span className="text-slds-text-weak">Status</span><StatusBadge status={status} /></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Dari</span><span className="font-semibold">{row.dari}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Ke Cabang</span><span className="font-semibold">{row.ke}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Driver</span><span>{row.driver ?? "-"}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Jenis Produk</span><span>{row.lines.length} item</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Total Qty</span><span>{row.items} kaleng</span></div>
          {row.refAjuan && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ajuan Asal</span>
              <Link href={`/operasional/ajuan-stok/${row.refAjuan}`} className="font-mono font-semibold text-brand hover:underline">{row.refAjuan}</Link>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slds-text-weak">Surat Jalan</span>
            {terbit ? (
              <Link href={`/operasional/surat-jalan/${sjId}`} className="font-mono font-semibold text-brand hover:underline">{sjId}</Link>
            ) : (
              <span className="text-slds-text-weak">belum terbit</span>
            )}
          </div>

          {status === "Draft" && (
            <button
              type="button"
              data-no-toast
              onClick={() => setShowKirim(true)}
              className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold hover:bg-brand-dark"
            >
              <Send className="h-3.5 w-3.5" /> Kirim Distribusi
            </button>
          )}
          {status === "Dalam Perjalanan" && (
            <button
              type="button"
              data-no-toast
              onClick={handleTerima}
              className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold hover:bg-brand-dark"
            >
              <Check className="h-3.5 w-3.5" /> Konfirmasi Diterima Cabang
            </button>
          )}
          {status === "Selesai" && (
            <p className="mt-3 text-[12px] text-green-700 font-semibold">
              Diterima {formatWaktu(row.waktuTerima ?? null)}
              {row.terima?.oleh ? ` · ${row.terima.oleh}` : ""}
            </p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Item Distribusi</h3>
          <table className="w-full text-[13px] mb-4">
            <thead>
              <tr className="border-b border-slds-border text-left text-[10px] uppercase text-slds-text-weak">
                <th className="pb-2 font-semibold">Kode</th>
                <th className="pb-2 font-semibold">Produk</th>
                <th className="pb-2 font-semibold text-right">Qty</th>
              </tr>
            </thead>
            <tbody>
              {row.lines.map((l) => (
                <tr key={l.kode} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{l.kode}</td>
                  <td className="py-2 text-slds-text-weak">{l.nama}</td>
                  <td className="py-2 text-right font-semibold">{l.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-[13px] font-bold text-slds-text mb-2">Timeline</h3>
          {timeline.map((step) => (
            <div key={step.label} className="flex justify-between gap-3 py-1.5 border-b border-slds-border last:border-0 text-[13px]">
              <span className={step.done ? "text-slds-text font-semibold" : "text-slds-text-weak"}>{step.label}</span>
              <span className="text-slds-text-weak text-right">
                {formatWaktu(step.waktu)}
                {step.note ? <span className="block text-[11px]">{step.note}</span> : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

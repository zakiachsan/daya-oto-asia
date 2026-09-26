"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { useOpbList, useFakturJual, useHutangPiutang, useTransaksiList } from "@/lib/preview-store";
import { formatIDR } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { buildBatchFaktur } from "@/lib/finance-invoice-batch-utils";

/** Alur Finance #56: OPB terbit → Proses Invoice → cetak 2 format → rekonsiliasi → kirim → Lunas */
const STEPS = ["OPB Terbit", "Proses Invoice", "Cetak 2 Invoice", "Rekonsiliasi", "Kirim", "Lunas"] as const;

export default function ProsesInvoicePage() {
  const { toast } = useToast();
  const { items: opb, patch } = useOpbList();
  const { all: trx } = useTransaksiList();
  const { all: faktur, add: addFaktur } = useFakturJual();
  const { items: hutang } = useHutangPiutang();
  const [cabang, setCabang] = useState("Auto 2000 Surabaya");
  const [dari, setDari] = useState("2026-09-01");
  const [sampai, setSampai] = useState("2026-09-30");
  const [stepIdx, setStepIdx] = useState(1);

  const opbCabang = opb.filter((o) => o.cabang.includes(cabang.split(" ").pop() ?? cabang));

  function prosesInvoice() {
    const pair = buildBatchFaktur({ cabang, dari, sampai, transaksi: trx, seq: faktur.length });
    pair.forEach((f) => addFaktur(f));
    opbCabang.forEach((o) => patch(o.id, { status: "Rekonsiliasi" }));
    setStepIdx(2);
    toast(`2 dokumen invoice digenerate untuk ${cabang}`, "success");
  }

  function tandaiLunas() {
    setStepIdx(5);
    toast("Status cabang → Lunas (preview)", "success");
  }

  return (
    <div>
      <PageHeader
        title="Proses Invoice per Cabang"
        desc="Pipeline Finance: OPB → invoice ganda → rekonsiliasi → lunas"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Proses Invoice" }]}
      />
      <div className="flex gap-1 mb-4 flex-wrap">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`px-2 py-1 rounded text-[11px] font-semibold ${i <= stepIdx ? "bg-brand text-white" : "bg-slds-bg text-slds-text-weak"}`}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="bg-white border border-slds-border rounded-lg p-4 max-w-xl space-y-3 mb-4">
        <label className="block text-[12px]">
          Cabang
          <select value={cabang} onChange={(e) => setCabang(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md text-[13px]">
            <option>Auto 2000 Surabaya</option>
            <option>Cakrawala Malang</option>
            <option>Prima Jember</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12px]">
            Dari
            <input type="date" value={dari} onChange={(e) => setDari(e.target.value)} className="w-full mt-1 px-2 py-1.5 border rounded-md" />
          </label>
          <label className="text-[12px]">
            Sampai
            <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} className="w-full mt-1 px-2 py-1.5 border rounded-md" />
          </label>
        </div>
        <p className="text-[11px] text-slds-text-weak">OPB cabang: {opbCabang.length} · Piutang aktif: {hutang.length}</p>
        <button type="button" data-no-toast onClick={prosesInvoice} className="w-full py-2.5 bg-brand text-white rounded-md font-semibold text-[13px]">
          Proses Invoice · Generate 2 Format
        </button>
        <button type="button" data-no-toast onClick={tandaiLunas} className="w-full py-2 border border-green-600 text-green-700 rounded-md font-semibold text-[13px]">
          Tandai Lunas
        </button>
      </div>
      <Link href="/finance/penjualan/faktur-penjualan" className="text-brand text-[13px] font-semibold">
        Lihat faktur penjualan →
      </Link>
      <p className="text-[11px] text-slds-text-weak mt-2">Total OPB cabang: {formatIDR(opbCabang.reduce((s, o) => s + o.total, 0))}</p>
    </div>
  );
}

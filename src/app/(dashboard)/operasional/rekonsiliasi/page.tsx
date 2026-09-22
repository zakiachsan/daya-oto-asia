"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterBar } from "@/components/ui/filter-bar";
import { MOCK_REKONSILIASI, type OpbRow } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useOpbList } from "@/lib/preview-store";

export default function RekonsiliasiPage() {
  const { toast } = useToast();
  const { items: opbList, setSap } = useOpbList();
  const [tab, setTab] = useState<"ringkasan" | "detail" | "leakage">("ringkasan");
  const [sapDraft, setSapDraft] = useState<Record<string, string>>({});

  function handleSaveSap(id: string) {
    const sap = sapDraft[id]?.trim();
    if (!sap) {
      toast("No. SAP wajib diisi", "error");
      return;
    }
    setSap(id, sap);
    toast(`SAP ${sap} tersimpan untuk ${id}`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Rekonsiliasi OPB"
        desc="Cocokkan OPB, nota tercetak, dan pemakaian stok · deteksi leakage"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Rekonsiliasi" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => toast("Laporan rekonsiliasi diekspor (preview PDF)", "success")}
            className="px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            Export Laporan
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Cabang Match" value="1" sub="Dari 3 cabang Agustus" icon={CheckCircle2} color="green" />
        <StatCard label="Perlu Review" value="2" sub="Ada selisih OPB vs stok" icon={AlertTriangle} color="orange" />
        <StatCard label="OPB Belum Terbentuk" value="1" sub="Stok habis, OPB kosong" icon={FileText} color="red" />
      </div>

      <div className="flex gap-1 mb-4 border-b border-slds-border">
        {(["ringkasan", "detail", "leakage"] as const).map((t) => (
          <button type="button"
            key={t}
            data-no-toast onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors capitalize
              ${tab === t ? "border-brand text-brand" : "border-transparent text-slds-text-weak hover:text-slds-text"}`}
          >
            {t === "ringkasan" ? "Ringkasan Cabang" : t === "detail" ? "Detail OPB" : "Deteksi Leakage"}
          </button>
        ))}
      </div>

      {tab === "ringkasan" && (
        <>
          <FilterBar
            searchPlaceholder="Cari cabang..."
            filters={[{ label: "periode", options: ["Agustus 2026", "Juli 2026"] }]}
          />
          <DataTable
            columns={[
              { key: "cabang", label: "Cabang" },
              { key: "opb", label: "OPB", render: (r) => `${r.opb} trx` },
              { key: "notaCetak", label: "Nota Cetak", render: (r) => `${r.notaCetak} trx` },
              { key: "stokPakai", label: "Stok Terpakai", render: (r) => `${r.stokPakai} trx` },
              {
                key: "selisih",
                label: "Selisih",
                render: (r) => (
                  <span className={Number(r.selisih) > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                    {Number(r.selisih) > 0 ? `+${r.selisih}` : r.selisih}
                  </span>
                ),
              },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
            ]}
            data={MOCK_REKONSILIASI}
          />
        </>
      )}

      {tab === "detail" && (
        <DataTable
          columns={[
            { key: "id", label: "No. OPB" },
            { key: "cabang", label: "Cabang" },
            { key: "periode", label: "Periode" },
            { key: "jumlahTrx", label: "Jumlah Trx" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
            {
              key: "sap",
              label: "No. SAP",
              render: (r) => {
                const row = r as OpbRow;
                if (row.sap) return <span className="font-mono text-[12px]">{row.sap}</span>;
                if (row.status !== "Rekonsiliasi") return <span className="text-slds-text-weak">-</span>;
                return (
                  <div className="flex items-center gap-1">
                    <input
                      placeholder="SAP-2026-..."
                      value={sapDraft[row.id] ?? ""}
                      onChange={(e) => setSapDraft((prev) => ({ ...prev, [row.id]: e.target.value }))}
                      className="px-2 py-1 border border-slds-border rounded text-[12px] w-28 font-mono"
                    />
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => handleSaveSap(row.id)}
                      className="px-2 py-1 bg-brand text-white rounded text-[11px] font-semibold"
                    >
                      Simpan
                    </button>
                  </div>
                );
              },
            },
          ]}
          data={opbList}
        />
      )}

      {tab === "leakage" && (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-[13px] font-bold text-red-800">Stok habis tapi OPB tidak terbentuk</p>
            <p className="text-[12px] text-red-700 mt-1">
              Prima Jember · 3 transaksi stok terpakai (TRX-0135, 0136, 0137) belum masuk OPB Agustus.
              Kemungkinan: admin cabang belum forward ke HO.
            </p>
            <button
              type="button"
              data-no-toast
              onClick={() => toast("Follow-up terkirim ke admin Prima Jember", "success")}
              className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-[12px] font-semibold hover:bg-red-700"
            >
              Follow Up Admin Cabang
            </button>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-[13px] font-bold text-amber-800">Nota cetak &gt; OPB</p>
            <p className="text-[12px] text-amber-700 mt-1">
              Auto 2000 Surabaya · 45 nota tercetak vs 47 OPB. Selisih 2 kemungkinan transaksi penambahan bahan belum di-lock.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

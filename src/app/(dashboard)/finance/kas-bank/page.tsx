"use client";

import { useState } from "react";
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_KAS_BANK, formatIDR } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

type KasRow = (typeof MOCK_KAS_BANK)[number];

export default function KasBankPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"semua" | "penerimaan" | "pembayaran">("semua");
  const [formMode, setFormMode] = useState<"penerimaan" | "pembayaran" | null>(null);
  const [items, setItems] = useState<KasRow[]>(MOCK_KAS_BANK);
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState(1000000);
  const [akun, setAkun] = useState("Bank BCA");

  const filtered = items.filter((r) => {
    if (tab === "penerimaan") return r.tipe === "Penerimaan";
    if (tab === "pembayaran") return r.tipe === "Pembayaran";
    return true;
  });

  function handleSave() {
    if (!keterangan.trim() || jumlah <= 0) {
      toast("Keterangan dan jumlah wajib diisi", "error");
      return;
    }
    const isIn = formMode === "penerimaan";
    const newRow: KasRow = {
      id: `PMB/2026/09/${String(14 + items.length).padStart(3, "0")}`,
      tanggal: new Date().toISOString().slice(0, 10),
      tipe: isIn ? "Penerimaan" : "Pembayaran",
      akun,
      keterangan: keterangan.trim(),
      jumlah: isIn ? jumlah : -jumlah,
    };
    setItems((prev) => [newRow, ...prev]);
    setFormMode(null);
    setKeterangan("");
    toast(`Voucher ${newRow.id} tercatat`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Kas & Bank"
        desc="Pembayaran masuk, keluar, dan transfer antar rekening"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Kas & Bank" }]}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => setFormMode(formMode === "penerimaan" ? null : "penerimaan")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-md text-[13px] font-semibold hover:bg-green-700"
            >
              <Plus className="h-4 w-4" /> Penerimaan
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() => setFormMode(formMode === "pembayaran" ? null : "pembayaran")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" /> Pembayaran
            </button>
          </div>
        }
      />

      {formMode && (
        <ActionFormPanel
          title={formMode === "penerimaan" ? "Penerimaan Kas/Bank" : "Pembayaran Kas/Bank"}
          onClose={() => setFormMode(null)}
          onSave={handleSave}
          saveLabel="Simpan Voucher"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Akun</label>
              <select value={akun} onChange={(e) => setAkun(e.target.value)} className={`${fieldClass} bg-white`}>
                <option>Kas</option>
                <option>Bank BCA</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Jumlah (Rp)</label>
              <input type="number" min={1} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className={fieldClass} />
            </div>
            <div className="sm:col-span-1">
              <label className={labelClass}>Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Keterangan transaksi" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Saldo Kas" value={formatIDR(450000000)} icon={ArrowDownLeft} color="green" />
        <StatCard label="Saldo Bank BCA" value={formatIDR(400000000)} icon={ArrowDownLeft} color="blue" />
        <StatCard label="Mutasi Bulan Ini" value={formatIDR(-200000)} sub="Neto masuk/keluar" icon={ArrowUpRight} color="amber" />
      </div>

      <div className="flex gap-1 mb-4 border-b border-slds-border">
        {(["semua", "penerimaan", "pembayaran"] as const).map((t) => (
          <button
            type="button"
            key={t}
            data-no-toast
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors capitalize
              ${tab === t ? "border-brand text-brand" : "border-transparent text-slds-text-weak hover:text-slds-text"}`}
          >
            {t === "semua" ? "Semua Mutasi" : t}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          { key: "id", label: "No. Voucher", className: "font-mono" },
          { key: "tanggal", label: "Tanggal" },
          { key: "tipe", label: "Tipe" },
          { key: "akun", label: "Akun" },
          { key: "keterangan", label: "Keterangan" },
          {
            key: "jumlah",
            label: "Jumlah",
            render: (r) => {
              const n = Number(r.jumlah);
              return (
                <span className={n >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {formatIDR(n)}
                </span>
              );
            },
            className: "text-right",
          },
        ]}
        data={filtered}
      />
    </div>
  );
}

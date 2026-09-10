"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_PRODUK } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useBukaKaleng } from "@/lib/preview-store";

type ProdukRow = (typeof MOCK_PRODUK)[number];
const TABS = ["Semua", "1K SOLID COLORS", "1K SILVER COLORS", "1K PEARL COLORS", "CLEAR COAT", "THINNER"] as const;

export default function ProdukPage() {
  const { toast } = useToast();
  const { items: bukaKalengLog } = useBukaKaleng();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const [items, setItems] = useState<ProdukRow[]>(MOCK_PRODUK);
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Toner");
  const [beratKaleng, setBeratKaleng] = useState(1000);

  const filtered = tab === "Semua" ? items : items.filter((p) => p.kategori === tab);

  function handleSave() {
    if (!kode.trim() || !nama.trim()) {
      toast("Kode dan nama produk wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { kode: kode.trim(), nama: nama.trim(), kategori, kategoriTarif: "Lainnya", satuan: "gram", beratKaleng, status: "Aktif" }]);
    setShowForm(false);
    setKode("");
    setNama("");
    toast(`Produk ${kode} ditambahkan`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Master Produk"
        desc="76 produk Axalta (AXT) — import dari List Produk AXT.xlsx. Satuan gram setelah kaleng dibuka."
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Master Produk" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Produk
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Produk Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>Kode</label>
              <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="HS-31" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Nama Produk</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama produk" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Kategori</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={`${fieldClass} bg-white`}>
                {["Toner", "Cat", "Pernis", "Alat"].map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Berat Kaleng (gram)</label>
              <input type="number" min={1} value={beratKaleng} onChange={(e) => setBeratKaleng(Number(e.target.value))} className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            data-no-toast
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors
              ${tab === t ? "bg-brand text-white" : "bg-white border border-slds-border text-slds-text hover:bg-slds-bg"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          { key: "kode", label: "Kode" },
          { key: "nama", label: "Nama Produk" },
          { key: "kategori", label: "Kategori Axalta", render: (r) => <span className="text-[11px]">{r.kategori}</span> },
          { key: "kategoriTarif", label: "Tarif" },
          { key: "satuan", label: "Satuan" },
          { key: "beratKaleng", label: "Berat Kaleng", render: (r) => `${r.beratKaleng} gr` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-[12px] font-bold text-blue-800">Workflow Buka Kaleng</p>
        <p className="text-[11px] text-blue-700 mt-1">
          Kaleng belum dibuka = inventori (satuan kaleng). Setelah dibuka & ditimbang = produk gram di stok cabang.
          Tinter wajib timbang kaleng kosong saat buka kaleng baru.
        </p>
      </div>

      {bukaKalengLog.length > 0 && (
        <div className="mt-4 bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[13px] font-bold text-slds-text mb-3">Log Buka Kaleng (App Tinter)</p>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slds-border text-left text-slds-text-weak text-[11px] uppercase">
                <th className="pb-2 font-semibold">Tanggal</th>
                <th className="pb-2 font-semibold">Produk</th>
                <th className="pb-2 font-semibold">Tinter</th>
                <th className="pb-2 font-semibold text-right">Netto</th>
              </tr>
            </thead>
            <tbody>
              {bukaKalengLog.slice(0, 10).map((r) => (
                <tr key={r.id} className="border-b border-slds-border last:border-0">
                  <td className="py-2">{r.tanggal}</td>
                  <td className="py-2">{r.produk}</td>
                  <td className="py-2 text-slds-text-weak">{r.tinter} · {r.cabang}</td>
                  <td className="py-2 text-right font-bold text-green-700">{r.netGram} gr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

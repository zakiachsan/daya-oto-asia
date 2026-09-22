"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_KODE_WARNA, MOCK_KATEGORI_HARGA } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

type KodeRow = (typeof MOCK_KODE_WARNA)[number];

export default function KodeWarnaPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [items, setItems] = useState<KodeRow[]>(MOCK_KODE_WARNA);

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState(MOCK_KATEGORI_HARGA[0].kategori);
  const [formula, setFormula] = useState("");

  function handleSave() {
    if (!kode.trim() || !nama.trim()) {
      toast("Kode dan nama warna wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { kode: kode.trim(), nama: nama.trim(), kategori, formula: formula || "-" }]);
    setShowForm(false);
    setKode("");
    setNama("");
    setFormula("");
    toast(`Kode warna ${kode} ditambahkan`, "success");
  }

  function handleImport() {
    setShowImport(false);
    toast("3 kode warna diimport dari Excel (preview)", "success");
    setItems((prev) => [
      ...prev,
      { kode: "BL1", nama: "Biru Solid", kategori: "Standard", formula: "AXT-207 + AXT-302" },
      { kode: "GR2", nama: "Grey Metallic", kategori: "Silver", formula: "AXT-207 + AXT-843" },
      { kode: "GD3", nama: "Gold Pearl", kategori: "Pearl", formula: "AXT-101 + AXT-950" },
    ]);
  }

  return (
    <div>
      <PageHeader
        title="Kode Warna"
        desc="Database kombinasi warna + mapping ke kategori harga"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Kode Warna" }]}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => { setShowImport(!showImport); setShowForm(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold hover:bg-slds-bg transition-colors"
            >
              <Upload className="h-4 w-4" /> Import Excel
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() => { setShowForm(!showForm); setShowImport(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark transition-colors"
            >
              <Plus className="h-4 w-4" /> Tambah Kode
            </button>
          </div>
        }
      />

      {showImport && (
        <ActionFormPanel title="Import Excel Kode Warna" onClose={() => setShowImport(false)} onSave={handleImport} saveLabel="Import Sekarang">
          <div className="border-2 border-dashed border-slds-border rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-slds-text-weak mb-2" />
            <p className="text-[13px] text-slds-text">Drag & drop file .xlsx atau klik untuk pilih</p>
            <p className="text-[11px] text-slds-text-weak mt-1">Format: Kode | Nama | Kategori | Formula</p>
            <button type="button" className="mt-3 px-4 py-2 border border-brand text-brand rounded-md text-[12px] font-semibold">
              Pilih File
            </button>
          </div>
        </ActionFormPanel>
      )}

      {showForm && (
        <ActionFormPanel title="Kode Warna Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Kode Warna</label>
              <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="1G3" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Nama Warna</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Silver Metallic" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Kategori Harga</label>
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={`${fieldClass} bg-white`}>
                {MOCK_KATEGORI_HARGA.map((k) => (
                  <option key={k.kategori} value={k.kategori}>{k.kategori}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Formula / Kombinasi</label>
              <input value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="HS-30 + SL-M01" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          { key: "kode", label: "Kode Warna", className: "font-mono font-bold" },
          { key: "nama", label: "Nama Warna" },
          { key: "kategori", label: "Kategori Harga" },
          { key: "formula", label: "Formula / Kombinasi Toner" },
        ]}
        data={items}
      />
    </div>
  );
}

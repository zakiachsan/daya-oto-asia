"use client";

import { useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_CABANG } from "@/lib/mock-data";
import { formatProdukOptionLabel, formatStokBreakdown, listProdukAktif } from "@/lib/inventori-utils";
import { useInventoriStok } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

const LOKASI = ["Semua Lokasi", "Pusat", "Surabaya", "Malang", "Jember", "Kediri"] as const;
const PRODUK_AKTIF = listProdukAktif();

export default function InventoriPage() {
  const { toast } = useToast();
  const { rows, addManual } = useInventoriStok();
  const [tab, setTab] = useState<(typeof LOKASI)[number]>("Semua Lokasi");
  const [showForm, setShowForm] = useState(false);
  const [kodeProduk, setKodeProduk] = useState(PRODUK_AKTIF[0]?.kode ?? "AXT-60");
  const [cabang, setCabang] = useState("Surabaya");
  const [kaleng, setKaleng] = useState(0);
  const [gram, setGram] = useState(0);
  const [keterangan, setKeterangan] = useState("");

  const filtered = useMemo(() => {
    if (tab === "Semua Lokasi") return rows;
    return rows.filter((s) => s.cabang === tab);
  }, [rows, tab]);

  const alertCount = rows.filter((s) => s.status !== "Aman").length;

  function handleSave() {
    if (kaleng === 0 && gram === 0) {
      toast("Isi minimal kaleng atau gram", "error");
      return;
    }
    addManual({
      kodeProduk,
      cabang,
      kaleng,
      gram,
      keterangan: keterangan.trim() || "Tambah stok manual",
      oleh: "Admin HO",
    });
    setShowForm(false);
    setKaleng(0);
    setGram(0);
    setKeterangan("");
    toast("Stok berhasil ditambahkan", "success");
  }

  return (
    <div>
      <PageHeader
        title="Inventori & Stok"
        desc="Stok keseluruhan per lokasi · kaleng utuh dan gram terbuka (mesin + gudang cabang)"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Inventori" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Stok Manual
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Tambah Stok Manual" onClose={() => setShowForm(false)} onSave={handleSave} saveLabel="Simpan Stok">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Produk</label>
              <select value={kodeProduk} onChange={(e) => setKodeProduk(e.target.value)} className={`${fieldClass} bg-white`}>
                {PRODUK_AKTIF.map((p) => (
                  <option key={p.kode} value={p.kode}>
                    {formatProdukOptionLabel(p.kode, p.nama)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Lokasi / Cabang</label>
              <select value={cabang} onChange={(e) => setCabang(e.target.value)} className={`${fieldClass} bg-white`}>
                <option value="Pusat">Pusat</option>
                {MOCK_CABANG.map((c) => (
                  <option key={c.id} value={c.kota}>{c.kota}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Kaleng Utuh (+)</label>
              <input type="number" min={0} value={kaleng} onChange={(e) => setKaleng(Number(e.target.value) || 0)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Gram Terbuka (+)</label>
              <input type="number" min={0} value={gram} onChange={(e) => setGram(Number(e.target.value) || 0)} className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Mis. stock awal, koreksi opname" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total SKU", value: String(rows.length) },
          { label: "Perlu Perhatian", value: String(alertCount) },
          { label: "Lokasi Aktif", value: String(new Set(rows.map((r) => r.cabang)).size) },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slds-border rounded-lg p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Package className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold">{s.label}</p>
              <p className="text-xl font-bold text-slds-text">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {LOKASI.map((t) => (
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
          {
            key: "kodeProduk",
            label: "Kode",
            render: (r) => <span className="font-mono font-semibold text-[12px]">{r.kodeProduk}</span>,
          },
          { key: "produk", label: "Produk" },
          { key: "cabang", label: "Lokasi" },
          {
            key: "kalengUtuh",
            label: "Kaleng Utuh",
            render: (r) => <span className="font-semibold tabular-nums">{r.kalengUtuh}</span>,
          },
          {
            key: "gramTerbuka",
            label: "Gram Terbuka",
            render: (r) => <span className="font-semibold tabular-nums">{r.gramTerbuka.toLocaleString("id-ID")} gr</span>,
          },
          {
            key: "breakdown",
            label: "Ringkasan",
            render: (r) => <span className="text-[12px] text-slds-text-weak">{formatStokBreakdown(r)}</span>,
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

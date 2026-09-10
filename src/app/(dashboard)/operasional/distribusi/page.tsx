"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Truck, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_CABANG, MOCK_PRODUK } from "@/lib/mock-data";
import type { DistribusiDetail } from "@/lib/distribusi-utils";
import { useDistribusiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function DistribusiPage() {
  const { toast } = useToast();
  const { items, add } = useDistribusiList();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [ke, setKe] = useState(MOCK_CABANG[0].kota);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [produk, setProduk] = useState(MOCK_PRODUK[0].kode);
  const [qty, setQty] = useState(12);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (statusFilter !== "Semua Status" && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.id.toLowerCase().includes(q) || r.ke.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);

  function handleSave() {
    const p = MOCK_PRODUK.find((x) => x.kode === produk);
    const newRow: DistribusiDetail = {
      id: `DIST-2026-${String(21 + items.length).padStart(3, "0")}`,
      tanggal,
      dari: "Pusat",
      ke,
      items: qty,
      status: "Draft",
      lines: [{ kode: produk, nama: p?.nama ?? produk, qty }],
    };
    add(newRow);
    setShowForm(false);
    toast(`Distribusi ${newRow.id} dibuat`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Distribusi Cabang"
        desc="Kirim barang pusat → cabang — klik no. distribusi untuk detail item"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Distribusi Cabang" }]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark">
            <Plus className="h-4 w-4" /> Buat Distribusi
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Distribusi Baru" onClose={() => setShowForm(false)} onSave={handleSave} saveLabel="Kirim Distribusi">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>Dari</label>
              <input disabled value="Gudang Pusat" className={`${fieldClass} bg-slds-bg`} />
            </div>
            <div>
              <label className={labelClass}>Ke Cabang</label>
              <select value={ke} onChange={(e) => setKe(e.target.value)} className={`${fieldClass} bg-white`}>
                {MOCK_CABANG.map((c) => (
                  <option key={c.id} value={c.kota}>{c.kota}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tanggal</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Produk</label>
              <select value={produk} onChange={(e) => setProduk(e.target.value)} className={`${fieldClass} bg-white`}>
                {MOCK_PRODUK.slice(0, 15).map((p) => (
                  <option key={p.kode} value={p.kode}>{p.kode}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Jumlah</label>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: "Distribusi Bulan Ini", value: String(items.length) },
          { label: "Dalam Perjalanan", value: String(items.filter((i) => i.status === "Draft").length) },
          { label: "Selesai Diterima", value: String(items.filter((i) => i.status === "Selesai").length) },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slds-border rounded-lg p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Truck className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold">{s.label}</p>
              <p className="text-xl font-bold text-slds-text">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari no. distribusi, cabang..." className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
          {["Semua Status", "Draft", "Selesai"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Distribusi",
            render: (r) => (
              <Link href={`/operasional/distribusi/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "ke", label: "Ke Cabang" },
          { key: "tanggal", label: "Tanggal" },
          { key: "items", label: "Items", render: (r) => `${r.items}` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

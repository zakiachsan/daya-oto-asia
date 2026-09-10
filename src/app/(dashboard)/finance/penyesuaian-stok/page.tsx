"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { penyesuaianSlug, type PenyesuaianDetail } from "@/lib/penyesuaian-stok-utils";
import { usePenyesuaianStok } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function PenyesuaianStokPage() {
  const { toast } = useToast();
  const { items, add } = usePenyesuaianStok();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [cabang, setCabang] = useState("Surabaya");
  const [alasan, setAlasan] = useState("");
  const [nilai, setNilai] = useState(250000);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.cabang.toLowerCase().includes(q) ||
        r.alasan.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function handleSave() {
    if (!alasan.trim()) {
      toast("Alasan wajib diisi", "error");
      return;
    }
    const id = `ADJ-2026-${String(13 + items.length).padStart(3, "0")}`;
    const row: PenyesuaianDetail = {
      id,
      tanggal: new Date().toISOString().slice(0, 10),
      cabang,
      alasan: alasan.trim(),
      nilai,
      status: "Draft",
      lines: [{ kode: "AXT-000", produk: "Koreksi manual", selisihGram: 0, nilai }],
    };
    add(row);
    setShowForm(false);
    setAlasan("");
    toast("Penyesuaian tersimpan — buka detail untuk posting", "success");
  }

  return (
    <div>
      <PageHeader
        title="Penyesuaian Stok"
        desc="Koreksi stok dari stock opname — klik no. adj untuk detail & jurnal"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Penyesuaian Stok" }]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">
            <Plus className="h-4 w-4" /> Buat Penyesuaian
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Penyesuaian Stok Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Cabang</label>
              <select value={cabang} onChange={(e) => setCabang(e.target.value)} className={`${fieldClass} bg-white`}>
                <option>Surabaya</option>
                <option>Malang</option>
                <option>Jember</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Alasan</label>
              <input value={alasan} onChange={(e) => setAlasan(e.target.value)} placeholder="Stock opname selisih..." className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Nilai (Rp)</label>
              <input type="number" min={1} value={nilai} onChange={(e) => setNilai(Number(e.target.value))} className={fieldClass} />
            </div>
          </div>
          <p className="text-[11px] text-slds-text-weak mt-2">Auto-jurnal: Dr Beban Penyesuaian Stok / Cr Persediaan Bahan Cat</p>
        </ActionFormPanel>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari cabang, alasan..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Adj",
            render: (r) => (
              <Link href={`/finance/penyesuaian-stok/${penyesuaianSlug(String(r.id))}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "cabang", label: "Cabang" },
          { key: "nilai", label: "Nilai", render: (r) => formatIDR(Number(r.nilai)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

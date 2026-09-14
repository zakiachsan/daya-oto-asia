"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { penyesuaianSlug, type PenyesuaianDetail } from "@/lib/penyesuaian-stok-utils";
import { buildPenyesuaianFromOpname, penyesuaianForOpname } from "@/lib/ops-finance-bridge";
import { usePenyesuaianStok, useStockOpname } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

function PenyesuaianPersediaanContent() {
  const searchParams = useSearchParams();
  const opnameId = searchParams.get("opname") ?? "";
  const { toast } = useToast();
  const { items, add } = usePenyesuaianStok();
  const { items: opnameList } = useStockOpname();
  const [showForm, setShowForm] = useState(Boolean(opnameId));
  const [search, setSearch] = useState("");
  const [cabang, setCabang] = useState("Surabaya");
  const [alasan, setAlasan] = useState("");
  const [nilai, setNilai] = useState(250000);
  const [refOpname, setRefOpname] = useState(opnameId);

  const sourceOpname = opnameList.find((o) => o.id === refOpname);

  useEffect(() => {
    if (!opnameId || !sourceOpname) return;
    if (penyesuaianForOpname(opnameId, items)) return;
    const draft = buildPenyesuaianFromOpname(sourceOpname, items.length + 1);
    setCabang(draft.cabang);
    setAlasan(draft.alasan);
    setNilai(draft.nilai);
    setRefOpname(draft.refOpname ?? "");
    setShowForm(true);
  }, [opnameId, sourceOpname, items.length]);

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
    if (refOpname && penyesuaianForOpname(refOpname, items)) {
      toast("Stock opname ini sudah punya penyesuaian", "error");
      return;
    }
    const row: PenyesuaianDetail = sourceOpname
      ? buildPenyesuaianFromOpname(sourceOpname, items.length + 1)
      : {
          id: `ADJ-2026-${String(13 + items.length).padStart(3, "0")}`,
          tanggal: new Date().toISOString().slice(0, 10),
          cabang,
          alasan: alasan.trim(),
          nilai,
          status: "Draft",
          lines: [{ kode: "AXT-000", produk: "Koreksi manual", selisihGram: 0, nilai }],
        };
    if (!sourceOpname) {
      row.alasan = alasan.trim();
      row.cabang = cabang;
      row.nilai = nilai;
    }
    add(row);
    setShowForm(false);
    setAlasan("");
    setRefOpname("");
    toast(`Penyesuaian ${row.id} tersimpan - buka detail untuk posting`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Penyesuaian Persediaan"
        desc="Koreksi stok dari stock opname - klik no. adj untuk detail & jurnal"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Persediaan" },
          { label: "Penyesuaian Persediaan" },
        ]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">
            <Plus className="h-4 w-4" /> Buat Penyesuaian
          </button>
        }
      />

      {sourceOpname && showForm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-[12px]">
          <p className="font-semibold text-blue-900">Prefill dari Stock Opname {sourceOpname.id}</p>
          <p className="text-blue-800 mt-0.5">
            {sourceOpname.produk} | selisih {sourceOpname.selisih}gr |{" "}
            <Link href={`/operasional/stock-opname/${sourceOpname.id}`} className="underline font-semibold">Lihat opname</Link>
          </p>
        </div>
      )}

      {showForm && (
        <ActionFormPanel title="Penyesuaian Persediaan Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
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
            {refOpname && (
              <div>
                <label className={labelClass}>Ref. Opname</label>
                <input disabled value={refOpname} className={`${fieldClass} bg-slds-bg font-mono`} />
              </div>
            )}
          </div>
          <p className="text-[11px] text-slds-text-weak mt-2">Auto-jurnal saat post: Dr HPP / Cr Persediaan</p>
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
              <Link href={`/finance/persediaan/penyesuaian-persediaan/${penyesuaianSlug(String(r.id))}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "cabang", label: "Cabang" },
          {
            key: "refOpname",
            label: "Ref. Opname",
            render: (r) =>
              r.refOpname ? (
                <Link href={`/operasional/stock-opname/${String(r.refOpname)}`} className="font-mono text-[12px] text-brand hover:underline">
                  {String(r.refOpname)}
                </Link>
              ) : (
                "-"
              ),
          },
          { key: "nilai", label: "Nilai", render: (r) => formatIDR(Number(r.nilai)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

export default function PenyesuaianPersediaanPage() {
  return (
    <Suspense fallback={<div className="p-4 text-[13px] text-slds-text-weak">Memuat...</div>}>
      <PenyesuaianPersediaanContent />
    </Suspense>
  );
}

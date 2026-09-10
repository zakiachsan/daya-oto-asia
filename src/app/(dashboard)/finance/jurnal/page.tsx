"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_COA, formatIDR } from "@/lib/mock-data";
import { jurnalSlug, linesFromDraft, type JurnalDetail } from "@/lib/jurnal-utils";
import { useToast } from "@/components/ui/toast";
import { useJurnalList } from "@/lib/preview-store";

type LineDraft = { accountKode: string; debit: number; credit: number };

export default function JurnalPage() {
  const { toast } = useToast();
  const { all: items, add } = useJurnalList();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<LineDraft[]>([
    { accountKode: "110301", debit: 0, credit: 0 },
    { accountKode: "410101", debit: 0, credit: 0 },
  ]);

  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const balanced = totalDebit === totalCredit && totalDebit > 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((j) => {
      if (statusFilter !== "Semua" && j.status !== statusFilter) return false;
      if (!q) return true;
      return j.id.toLowerCase().includes(q) || j.keterangan.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);

  function handlePost() {
    if (!keterangan.trim()) {
      toast("Keterangan wajib diisi", "error");
      return;
    }
    if (!balanced) {
      toast("Jurnal harus balanced (debit = kredit)", "error");
      return;
    }

    const newJurnal: JurnalDetail = {
      id: `JU/2026/09/${String(4 + items.length).padStart(3, "0")}`,
      tanggal,
      keterangan: keterangan.trim(),
      debit: totalDebit,
      kredit: totalCredit,
      status: "Posted",
      lines: linesFromDraft(lines),
    };
    add(newJurnal);
    setShowForm(false);
    setKeterangan("");
    setLines([
      { accountKode: "110301", debit: 0, credit: 0 },
      { accountKode: "410101", debit: 0, credit: 0 },
    ]);
    toast(`Jurnal ${newJurnal.id} posted (preview)`, "success");
  }

  function updateLine(i: number, patch: Partial<LineDraft>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  return (
    <div>
      <PageHeader
        title="Jurnal Umum"
        desc="Double-entry multi-line — klik no. jurnal untuk detail baris akun"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Jurnal Umum" }]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">
            <Plus className="h-4 w-4" /> Buat Jurnal
          </button>
        }
      />

      {showForm && (
        <div className="mb-4 bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[13px] font-bold text-slds-text mb-3">Jurnal Baru</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Tanggal</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Keterangan jurnal..." className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
          </div>
          <table className="w-full text-[13px] mb-3">
            <thead>
              <tr className="border-b border-slds-border text-[10px] uppercase text-slds-text-weak">
                <th className="text-left py-2 px-2">Akun</th>
                <th className="text-right py-2 px-2 w-32">Debit</th>
                <th className="text-right py-2 px-2 w-32">Kredit</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {lines.map((row, i) => (
                <tr key={i} className="border-b border-slds-border">
                  <td className="py-2 px-2">
                    <select value={row.accountKode} onChange={(e) => updateLine(i, { accountKode: e.target.value })} className="w-full px-2 py-1 border border-slds-border rounded text-[12px] bg-white">
                      {MOCK_COA.map((a) => (
                        <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input type="number" min={0} value={row.debit || ""} onChange={(e) => updateLine(i, { debit: Number(e.target.value) || 0 })} className="w-full px-2 py-1 border border-slds-border rounded text-right text-[12px]" />
                  </td>
                  <td className="py-2 px-2">
                    <input type="number" min={0} value={row.credit || ""} onChange={(e) => updateLine(i, { credit: Number(e.target.value) || 0 })} className="w-full px-2 py-1 border border-slds-border rounded text-right text-[12px]" />
                  </td>
                  <td className="py-2 px-1">
                    {lines.length > 2 && (
                      <button type="button" data-no-toast onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mb-3 text-[12px]">
            <button type="button" data-no-toast onClick={() => setLines((p) => [...p, { accountKode: MOCK_COA[0].kode, debit: 0, credit: 0 }])} className="text-brand font-semibold">+ Tambah baris</button>
            <span className={balanced ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
              Debit {formatIDR(totalDebit)} = Kredit {formatIDR(totalCredit)}
            </span>
          </div>
          <div className="flex gap-2">
            <button type="button" data-no-toast onClick={handlePost} disabled={!balanced} className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold disabled:opacity-50">Post Jurnal</button>
            <button type="button" data-no-toast onClick={() => setShowForm(false)} className="px-4 py-2 border border-slds-border rounded-md text-[13px]">Batal</button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. jurnal, keterangan..."
            className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
        >
          {["Semua", "Posted", "Draft"].map((o) => (
            <option key={o} value={o}>{o === "Semua" ? "Semua Status" : o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Jurnal",
            className: "font-mono",
            render: (r) => (
              <Link href={`/finance/jurnal/${jurnalSlug(String(r.id))}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "keterangan", label: "Keterangan", className: "max-w-[240px]" },
          { key: "debit", label: "Total", render: (r) => formatIDR(Number(r.debit)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

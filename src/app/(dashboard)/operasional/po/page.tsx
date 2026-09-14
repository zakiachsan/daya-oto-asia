"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRODUK, formatIDR } from "@/lib/mock-data";
import { HARGA_EST, PO_SUPPLIERS, type PoDetail, type PoLine } from "@/lib/po-utils";
import { FinanceLinkBadge } from "@/components/finance/finance-link-badge";
import { useFakturBeli, useFinancePayments, useHutangPiutang, usePoList } from "@/lib/preview-store";
import { getPoFinanceStatus } from "@/lib/ops-finance-bridge";
import { useToast } from "@/components/ui/toast";

type LineItem = { kode: string; qty: number; harga: number };

function emptyLine(): LineItem {
  return { kode: MOCK_PRODUK[0].kode, qty: 1, harga: HARGA_EST[MOCK_PRODUK[0].kode] ?? 400000 };
}

function toLines(validLines: LineItem[]): PoLine[] {
  return validLines.map((l) => ({
    kode: l.kode,
    nama: MOCK_PRODUK.find((p) => p.kode === l.kode)?.nama ?? l.kode,
    qty: l.qty,
    harga: l.harga,
  }));
}

export default function POPage() {
  const { toast } = useToast();
  const { items, add } = usePoList();
  const { all: fakturBeli } = useFakturBeli();
  const { items: hutang } = useHutangPiutang();
  const { items: payments } = useFinancePayments();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const [supplier, setSupplier] = useState(PO_SUPPLIERS[0]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [catatan, setCatatan] = useState("");
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);

  const lineTotal = lines.reduce((sum, l) => sum + l.qty * l.harga, 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (statusFilter !== "Semua Status" && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.id.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);

  function resetForm() {
    setSupplier(PO_SUPPLIERS[0]);
    setTanggal(new Date().toISOString().slice(0, 10));
    setCatatan("");
    setLines([emptyLine()]);
  }

  function updateLine(i: number, patch: Partial<LineItem>) {
    setLines((prev) =>
      prev.map((l, idx) => {
        if (idx !== i) return l;
        const next = { ...l, ...patch };
        if (patch.kode) next.harga = HARGA_EST[patch.kode] ?? l.harga;
        return next;
      }),
    );
  }

  function handleSave() {
    const validLines = lines.filter((l) => l.qty > 0);
    if (validLines.length === 0) {
      toast("Minimal 1 item dengan qty > 0", "error");
      return;
    }

    const seq = items.length + 1;
    const newPO: PoDetail = {
      id: `PO-2026-${String(37 + seq).padStart(3, "0")}`,
      tanggal,
      supplier,
      items: validLines.length,
      total: validLines.reduce((s, l) => s + l.qty * l.harga, 0),
      status: "Draft",
      gr: "",
      catatan: catatan || undefined,
      lines: toLines(validLines),
    };

    add(newPO);
    setShowForm(false);
    resetForm();
    toast(`PO ${newPO.id} berhasil dibuat`, "success");
  }

  return (
    <div>
      <PageHeader
        title="PO & Penerimaan"
        desc="Purchase Order ke pabrik — klik no. PO untuk detail item & goods received"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "PO & Penerimaan" }]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark">
            <Plus className="h-4 w-4" /> Buat PO
          </button>
        }
      />

      {showForm && (
        <div className="mb-5 bg-white border border-slds-border rounded-lg p-4 shadow-sm">
          <p className="text-[13px] font-bold text-slds-text mb-4">Purchase Order Baru</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Supplier</label>
              <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
                {PO_SUPPLIERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Tanggal PO</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Catatan</label>
              <input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Opsional" className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
          </div>
          <table className="w-full text-[13px] mb-3 border border-slds-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slds-bg border-b border-slds-border">
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase">Produk</th>
                <th className="px-3 py-2 w-24">Qty</th>
                <th className="px-3 py-2 w-32 text-right">Subtotal</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="border-b border-slds-border last:border-0">
                  <td className="px-3 py-2">
                    <select value={line.kode} onChange={(e) => updateLine(i, { kode: e.target.value })} className="w-full px-2 py-1.5 border border-slds-border rounded-md text-[13px] bg-white">
                      {MOCK_PRODUK.slice(0, 20).map((p) => (
                        <option key={p.kode} value={p.kode}>{p.kode} — {p.nama.slice(0, 30)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min={1} value={line.qty} onChange={(e) => updateLine(i, { qty: Number(e.target.value) || 0 })} className="w-full px-2 py-1.5 border border-slds-border rounded-md text-right text-[13px]" />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{formatIDR(line.qty * line.harga)}</td>
                  <td className="px-2 py-2">
                    {lines.length > 1 && (
                      <button type="button" data-no-toast onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-3">
            <button type="button" data-no-toast onClick={() => setLines((p) => [...p, emptyLine()])} className="text-[13px] font-semibold text-brand">+ Tambah Item</button>
            <p className="text-[13px] font-bold">Total: <span className="text-brand">{formatIDR(lineTotal)}</span></p>
          </div>
          <div className="flex gap-2">
            <button type="button" data-no-toast onClick={handleSave} className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">Simpan PO</button>
            <button type="button" data-no-toast onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border border-slds-border rounded-md text-[13px]">Batal</button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari no. PO, supplier..." className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
          {["Semua Status", "Draft", "Menunggu TTD", "Selesai"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="self-center text-[12px] text-slds-text-weak">{filtered.length} dari {items.length}</span>
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. PO",
            render: (r) => (
              <Link href={`/operasional/po/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "supplier", label: "Supplier" },
          { key: "total", label: "Total", render: (r) => formatIDR(Number(r.total)) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
          {
            key: "gr",
            label: "GR",
            render: (r) => (r.gr ? <span className="font-mono text-green-700 text-[12px]">{String(r.gr)}</span> : <span className="text-slds-text-weak">—</span>),
          },
          {
            key: "finance",
            label: "Finance",
            render: (r) => {
              const status = getPoFinanceStatus(String(r.id), fakturBeli, hutang, payments);
              const faktur = fakturBeli.find((f) => f.po === r.id);
              return (
                <FinanceLinkBadge
                  status={status}
                  href={
                    faktur
                      ? `/finance/pembelian/faktur-pembelian`
                      : r.gr
                        ? `/finance/pembelian/faktur-pembelian`
                        : undefined
                  }
                />
              );
            },
          },
        ]}
        data={filtered}
      />
    </div>
  );
}

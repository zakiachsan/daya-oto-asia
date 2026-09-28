"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Truck, Search, Trash2, Package, CheckCircle2, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_CABANG } from "@/lib/mock-data";
import {
  DISTRIBUSI_STATUS,
  distribusiStatus,
  nextDistribusiId,
  suratJalanId,
  suratJalanTerbit,
  type DistLine,
  type DistribusiDetail,
} from "@/lib/distribusi-utils";
import { listProdukAktif } from "@/lib/inventori-utils";
import { useDistribusiList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";
import { ProductSearchSelect } from "@/components/ui/product-search-select";

const PRODUK_AKTIF = listProdukAktif();

function emptyLine(kode?: string): DistLine {
  const p = PRODUK_AKTIF.find((x) => x.kode === kode) ?? PRODUK_AKTIF[0];
  return { kode: p.kode, nama: p.nama, qty: 1 };
}

export default function DistribusiPage() {
  const { toast } = useToast();
  const { items, add } = useDistribusiList();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [ke, setKe] = useState(MOCK_CABANG[0].kota);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<DistLine[]>([
    emptyLine(),
    emptyLine(PRODUK_AKTIF[1]?.kode ?? "AXT-814"),
  ]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) => {
      if (statusFilter !== "Semua Status" && distribusiStatus(r) !== statusFilter) return false;
      if (!q) return true;
      return r.id.toLowerCase().includes(q) || r.ke.toLowerCase().includes(q);
    });
  }, [items, search, statusFilter]);

  function updateLine(idx: number, patch: Partial<DistLine>) {
    setLines((prev) =>
      prev.map((ln, i) => {
        if (i !== idx) return ln;
        const next = { ...ln, ...patch };
        if (patch.kode) {
          const p = PRODUK_AKTIF.find((x) => x.kode === patch.kode);
          next.nama = p?.nama ?? patch.kode;
        }
        if (patch.nama) next.nama = patch.nama;
        return next;
      }),
    );
  }

  function handleSave() {
    const valid = lines.filter((l) => l.qty > 0);
    if (valid.length === 0) {
      toast("Tambahkan minimal 1 item produk", "error");
      return;
    }
    const totalQty = valid.reduce((s, l) => s + l.qty, 0);
    const newRow: DistribusiDetail = {
      id: nextDistribusiId(items),
      tanggal,
      dari: "Pusat",
      ke,
      items: totalQty,
      /* Draft = belum dikirim; status berikutnya muncul dari waktuKirim/waktuTerima */
      status: "Draft",
      lines: valid,
    };
    add(newRow);
    setShowForm(false);
    setLines([emptyLine()]);
    toast(`Distribusi ${newRow.id} · ${valid.length} jenis produk`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Distribusi Cabang"
        desc="Kirim item dari pusat ke cabang · status otomatis: Draft → Dalam Perjalanan → Selesai; surat jalan terbit saat dikirim"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Distribusi Cabang" }]}
        actions={
          <button type="button" data-no-toast onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark">
            <Plus className="h-4 w-4" /> Buat Distribusi
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Distribusi Baru · Multi Item" onClose={() => setShowForm(false)} onSave={handleSave} saveLabel="Kirim Distribusi">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
          </div>

          <p className="text-[12px] font-bold text-slds-text mb-2">Item Produk ({lines.length})</p>
          <div className="space-y-2 mb-3">
            {lines.map((ln, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_100px_40px] gap-2 items-end">
                <div>
                  {idx === 0 && <label className={labelClass}>Produk</label>}
                  <ProductSearchSelect
                    value={ln.kode}
                    onChange={(kode, nama) => updateLine(idx, { kode, nama })}
                    className={idx > 0 ? "mt-1" : ""}
                  />
                </div>
                <div>
                  {idx === 0 && <label className={labelClass}>Qty (kaleng)</label>}
                  <input
                    type="number"
                    min={1}
                    value={ln.qty}
                    onChange={(e) => updateLine(idx, { qty: Number(e.target.value) || 1 })}
                    className={`${fieldClass} ${idx > 0 ? "mt-1" : ""}`}
                  />
                </div>
                <button
                  type="button"
                  data-no-toast
                  disabled={lines.length <= 1}
                  onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))}
                  className="h-10 flex items-center justify-center text-red-500 disabled:opacity-30"
                  aria-label="Hapus baris"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            data-no-toast
            onClick={() => setLines((prev) => [...prev, emptyLine()])}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Produk
          </button>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Distribusi Bulan Ini", value: String(items.length), icon: Truck },
          { label: "Belum Dikirim", value: String(items.filter((i) => distribusiStatus(i) === "Draft").length), icon: Undo2 },
          { label: "Dalam Perjalanan", value: String(items.filter((i) => distribusiStatus(i) === "Dalam Perjalanan").length), icon: Package },
          { label: "Selesai Diterima", value: String(items.filter((i) => distribusiStatus(i) === "Selesai").length), icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slds-border rounded-lg p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <s.icon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold">{s.label}</p>
              <p className="text-2xl font-bold text-slds-text">{s.value}</p>
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
          {["Semua Status", ...DISTRIBUSI_STATUS].map((o) => (
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
              <div>
                <Link href={`/operasional/distribusi/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                  {String(r.id)}
                </Link>
                {r.refAjuan && (
                  <p className="text-[11px] text-slds-text-weak mt-0.5">
                    dari{" "}
                    <Link href={`/operasional/ajuan-stok/${r.refAjuan}`} className="text-brand hover:underline">
                      {r.refAjuan}
                    </Link>
                  </p>
                )}
              </div>
            ),
          },
          { key: "ke", label: "Ke Cabang" },
          { key: "tanggal", label: "Tanggal" },
          {
            key: "items",
            label: "Items",
            render: (r) => {
              const detail = items.find((i) => i.id === r.id);
              const kinds = detail?.lines.length ?? 0;
              return `${kinds} jenis · ${r.items} kaleng`;
            },
          },
          {
            key: "sj",
            label: "Surat Jalan",
            render: (r) =>
              suratJalanTerbit(r) ? (
                <Link href={`/operasional/surat-jalan/${suratJalanId(r.id)}`} className="font-mono text-brand hover:underline">
                  {suratJalanId(r.id)}
                </Link>
              ) : (
                <span className="text-slds-text-weak">belum terbit</span>
              ),
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={distribusiStatus(r)} /> },
        ]}
        data={filtered}
      />
    </div>
  );
}

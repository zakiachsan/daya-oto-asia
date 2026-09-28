"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR, MOCK_PRODUK } from "@/lib/mock-data";
import { useKategoriHarga } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function KategoriHargaPage() {
  const { toast } = useToast();
  const { items, add, patch } = useKategoriHarga();
  const [showForm, setShowForm] = useState(false);
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState(250000);
  const [contoh, setContoh] = useState("");

  /* berapa produk di master yang pakai tarif kategori ini */
  const pemakai = (nama: string) => MOCK_PRODUK.filter((p) => p.kategoriTarif === nama).length;

  function handleSave() {
    if (!kategori.trim()) {
      toast("Nama kategori wajib diisi", "error");
      return;
    }
    add({ kategori: kategori.trim(), harga, satuan: "liter", contoh: contoh || "-" });
    setShowForm(false);
    setKategori("");
    setHarga(250000);
    setContoh("");
    toast(`Preset ${kategori} ditambahkan`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Kategori Harga"
        desc="Tarif referensi per liter, per kategori warna · dipakai Master Produk & hitungan nilai barang kirim ke cabang."
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Kategori Harga" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark transition-colors"
          >
            <Plus className="h-4 w-4" /> Tambah Preset
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Preset Harga Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Kategori</label>
              <input value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="Contoh: Candy" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Harga (Rp)</label>
              <input type="number" min={0} value={harga} onChange={(e) => setHarga(Number(e.target.value))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Contoh Warna</label>
              <input value={contoh} onChange={(e) => setContoh(e.target.value)} placeholder="Contoh: Candy Red" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {items.map((k) => (
          <div key={k.kategori} className="bg-white border border-slds-border rounded-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak">{k.kategori}</p>
            <p className="text-2xl font-bold text-brand mt-1">{formatIDR(k.harga)}</p>
            <p className="text-[11px] text-slds-text-weak mt-2">{k.contoh}</p>
            <p className="text-[11px] text-slds-text-weak mt-1">{pemakai(k.kategori)} produk pakai tarif ini</p>
          </div>
        ))}
      </div>

      <DataTable
        columns={[
          { key: "kategori", label: "Kategori" },
          {
            key: "harga",
            label: "Harga / Liter",
            render: (r) => (
              <input
                type="number"
                min={0}
                defaultValue={Number(r.harga)}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (!v || v === Number(r.harga)) return;
                  patch(String(r.kategori), { harga: v });
                  toast(`Tarif ${r.kategori} jadi ${formatIDR(v)}`, "success");
                }}
                className="w-32 px-2 py-1 border border-slds-border rounded-md text-[12px] text-right tabular-nums"
              />
            ),
          },
          {
            key: "pemakai",
            label: "Dipakai Produk",
            render: (r) => {
              const n = pemakai(String(r.kategori));
              return n === 0 ? <span className="text-slds-text-weak">belum dipakai</span> : <span className="tabular-nums">{n} produk</span>;
            },
          },
          { key: "contoh", label: "Contoh Warna" },
        ]}
        data={items}
      />

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-[12px] font-bold text-amber-800">Logic Pricing Otomatis</p>
        <ul className="text-[11px] text-amber-700 mt-2 space-y-1 list-disc list-inside">
          <li>Jika ada 1 kode silver dalam mix → harga Silver</li>
          <li>Pearl / Special di-mapping per kode item</li>
          <li>Base color (HS-30, dll.) di-ignore untuk pricing</li>
          <li>
            Kolom Tarif di Master Produk = kategori di halaman ini · ubah harga di sini, harga Master Produk dan Rekap
            Pemakaian Cabang ikut berubah
          </li>
        </ul>
      </div>
    </div>
  );
}

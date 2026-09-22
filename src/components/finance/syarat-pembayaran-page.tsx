"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { syaratBayarLabel, type SyaratPembayaranRow } from "@/lib/finance-master-data";
import { useSyaratPembayaran } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export function SyaratPembayaranPage() {
  const { toast } = useToast();
  const { items, add, update, remove } = useSyaratPembayaran();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [hari, setHari] = useState(30);
  const [keterangan, setKeterangan] = useState("");
  const [aktif, setAktif] = useState(true);

  function resetForm() {
    setKode("");
    setNama("");
    setHari(30);
    setKeterangan("");
    setAktif(true);
    setEditId(null);
  }

  function openAdd() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(id: string) {
    const row = items.find((r) => r.id === id);
    if (!row) return;
    setEditId(id);
    setKode(row.kode);
    setNama(row.nama);
    setHari(row.hari);
    setKeterangan(row.keterangan ?? "");
    setAktif(row.aktif);
    setFormOpen(true);
  }

  function handleSave() {
    if (!kode.trim() || !nama.trim()) {
      toast("Kode dan nama wajib diisi", "error");
      return;
    }
    if (hari < 0) {
      toast("Hari jatuh tempo tidak valid", "error");
      return;
    }

    const duplicate = items.find((r) => r.kode.toLowerCase() === kode.trim().toLowerCase() && r.id !== editId);
    if (duplicate) {
      toast("Kode syarat pembayaran sudah dipakai", "error");
      return;
    }

    if (editId) {
      update(editId, {
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        hari,
        keterangan: keterangan.trim() || undefined,
        aktif,
      });
      toast("Syarat pembayaran diperbarui", "success");
    } else {
      add({
        id: `sp-${Date.now()}`,
        kode: kode.trim().toUpperCase(),
        nama: nama.trim(),
        hari,
        keterangan: keterangan.trim() || undefined,
        aktif,
      });
      toast("Syarat pembayaran ditambahkan", "success");
    }

    setFormOpen(false);
    resetForm();
  }

  function toggleAktif(id: string, current: boolean) {
    update(id, { aktif: !current });
    toast(`Syarat ${!current ? "diaktifkan" : "dinonaktifkan"}`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Syarat Pembayaran"
        desc="Master syarat bayar · Net 30, COD, dll. Dipakai di pelanggan & pemasok"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Perusahaan" },
          { label: "Syarat Pembayaran" },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Syarat
          </button>
        }
      />

      {formOpen && (
        <ActionFormPanel
          title={editId ? "Edit Syarat Pembayaran" : "Syarat Pembayaran Baru"}
          onClose={() => { setFormOpen(false); resetForm(); }}
          onSave={handleSave}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>Kode</label>
              <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="NET30" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Net 30" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Hari Jatuh Tempo</label>
              <input type="number" min={0} value={hari} onChange={(e) => setHari(Number(e.target.value))} className={fieldClass} />
              <p className="text-[11px] text-slds-text-weak mt-1">0 = COD / bayar langsung</p>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={aktif ? "aktif" : "nonaktif"} onChange={(e) => setAktif(e.target.value === "aktif")} className={`${fieldClass} bg-white`}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className={labelClass}>Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Opsional" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Total Syarat</p>
          <p className="text-xl font-bold text-slds-text mt-1">{items.length}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Aktif</p>
          <p className="text-xl font-bold text-green-600 mt-1">{items.filter((s) => s.aktif).length}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Standar Bengkel</p>
          <p className="text-[13px] font-semibold text-brand mt-1">Net 30 hari</p>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "kode", label: "Kode", className: "font-mono font-semibold" },
          { key: "nama", label: "Nama" },
          {
            key: "hari",
            label: "Jatuh Tempo",
            render: (r) => (Number(r.hari) === 0 ? "COD" : `${r.hari} hari`),
          },
          {
            key: "keterangan",
            label: "Keterangan",
            render: (r) => r.keterangan ?? "-",
          },
          {
            key: "aktif",
            label: "Status",
            render: (r) => (
              <button
                type="button"
                data-no-toast
                onClick={() => toggleAktif(String(r.id), Boolean(r.aktif))}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.aktif ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slds-bg text-slds-text-weak hover:bg-slds-border"}`}
              >
                {r.aktif ? "Aktif" : "Nonaktif"}
              </button>
            ),
          },
          {
            key: "id",
            label: "",
            render: (r) => (
              <div className="flex items-center gap-2">
                <button type="button" data-no-toast onClick={() => openEdit(String(r.id))} className="text-[12px] text-brand font-semibold hover:underline">
                  Edit
                </button>
                {items.length > 1 && (
                  <button
                    type="button"
                    data-no-toast
                    onClick={() => {
                      remove(String(r.id));
                      toast(`Syarat ${syaratBayarLabel(r as SyaratPembayaranRow)} dihapus`, "success");
                    }}
                    className="text-[12px] text-red-600 font-semibold hover:underline"
                  >
                    Hapus
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={items}
      />
    </div>
  );
}

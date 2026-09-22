"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_CABANG, MOCK_KARYAWAN } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

type CabangRow = (typeof MOCK_CABANG)[number];

export default function CabangPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<CabangRow[]>(MOCK_CABANG);
  const [editId, setEditId] = useState<string | null>(null);
  const [radius, setRadius] = useState(100);

  const [nama, setNama] = useState("");
  const [kota, setKota] = useState("");

  function handleSaveCabang() {
    if (!nama.trim() || !kota.trim()) {
      toast("Nama dan kota wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { id: String(prev.length + 1), nama: nama.trim(), kota: kota.trim(), tinter: 0, stokAlert: 0 }]);
    setShowForm(false);
    setNama("");
    setKota("");
    toast("Cabang baru ditambahkan", "success");
  }

  function handleSaveGeofence() {
    if (!editId) return;
    toast(`Geofence diperbarui · radius ${radius}m`, "success");
    setEditId(null);
  }

  const editing = items.find((c) => c.id === editId);

  return (
    <div>
      <PageHeader
        title="Master Cabang"
        desc="Daftar bengkel mitra, lokasi geofence, dan assignment tinter"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Master Cabang" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Cabang
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Cabang Baru" onClose={() => setShowForm(false)} onSave={handleSaveCabang}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nama Bengkel</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Bengkel ..." className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Kota</label>
              <input value={kota} onChange={(e) => setKota(e.target.value)} placeholder="Surabaya" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      {editId && editing && (
        <ActionFormPanel title={`Edit Geofence · ${editing.nama}`} onClose={() => setEditId(null)} onSave={handleSaveGeofence} saveLabel="Simpan Lokasi">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Radius Geofence (meter)</label>
              <input type="number" min={50} max={500} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Koordinat (mock)</label>
              <input disabled value="-7.250445, 112.768845" className={`${fieldClass} bg-slds-bg`} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataTable
          columns={[
            { key: "nama", label: "Nama Bengkel" },
            { key: "kota", label: "Kota" },
            { key: "tinter", label: "Tinter", render: (r) => `${r.tinter} orang` },
            {
              key: "stokAlert",
              label: "Alert Stok",
              render: (r) =>
                Number(r.stokAlert) > 0 ? (
                  <span className="text-red-600 font-bold">{r.stokAlert} item</span>
                ) : (
                  <span className="text-green-600">OK</span>
                ),
            },
          ]}
          data={items}
        />

        <div className="bg-white border border-slds-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-brand" />
            <h3 className="text-[13px] font-bold text-slds-text">Geofence Absensi</h3>
          </div>
          <div className="space-y-2">
            {items.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slds-border last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-slds-text">{c.nama}</p>
                  <p className="text-[11px] text-slds-text-weak">{c.kota} · Radius 100m</p>
                </div>
                <button
                  type="button"
                  data-no-toast
                  onClick={() => { setEditId(c.id); setRadius(100); }}
                  className="text-[11px] text-brand font-semibold hover:underline"
                >
                  Edit Lokasi
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold text-slds-text mb-2">Assignment Tinter per Cabang</h3>
        <DataTable
          columns={[
            { key: "nama", label: "Nama" },
            { key: "jabatan", label: "Jabatan" },
            { key: "cabang", label: "Cabang" },
          ]}
          data={MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter")}
        />
      </div>
    </div>
  );
}

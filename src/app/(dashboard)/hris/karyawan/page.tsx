"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_KARYAWAN, MOCK_CABANG } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

type KaryawanRow = (typeof MOCK_KARYAWAN)[number];

export default function KaryawanPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<KaryawanRow[]>(MOCK_KARYAWAN);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("Tinter");
  const [cabang, setCabang] = useState(MOCK_CABANG[0].nama);

  function handleSave() {
    if (!nama.trim()) {
      toast("Nama wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { id: String(prev.length + 1), nama: nama.trim(), jabatan, cabang, status: "Aktif" }]);
    setShowForm(false);
    setNama("");
    toast(`${nama} ditambahkan sebagai karyawan`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Karyawan"
        desc="Data karyawan / manpower — self-service via App Tinter"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Karyawan" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Karyawan
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="Karyawan Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Jabatan</label>
              <select value={jabatan} onChange={(e) => setJabatan(e.target.value)} className={`${fieldClass} bg-white`}>
                {["Tinter", "Supervisor", "Admin Cabang", "HR"].map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Cabang</label>
              <select value={cabang} onChange={(e) => setCabang(e.target.value)} className={`${fieldClass} bg-white`}>
                <option value="Pusat">Pusat</option>
                {MOCK_CABANG.map((c) => <option key={c.id} value={c.nama}>{c.nama}</option>)}
              </select>
            </div>
          </div>
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          { key: "nama", label: "Nama" },
          { key: "jabatan", label: "Jabatan" },
          { key: "cabang", label: "Cabang" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={items}
      />
    </div>
  );
}

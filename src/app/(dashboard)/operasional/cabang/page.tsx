"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Building2, MapPin, Pencil, Plus, Store, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_KARYAWAN } from "@/lib/mock-data";
import { CABANG_BARU, KOORDINAT_CONTOH, cabangShort, type CabangRow } from "@/lib/cabang-utils";
import { useAssignment, useCabangList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

/** Field cabang yang bisa diubah user (tinter & alert stok dihitung, bukan diinput) */
type FormCabang = {
  id: string;
  nama: string;
  kota: string;
  alamat: string;
  telepon: string;
  minStokGram: number;
  radiusMeter: number;
  koordinat: string;
  status: CabangRow["status"];
};

export default function CabangPage() {
  const { toast } = useToast();
  const { items, add, update, remove } = useCabangList();
  const { map } = useAssignment();
  const [form, setForm] = useState<FormCabang | null>(null);
  const [hapusId, setHapusId] = useState<string | null>(null);

  const tinterList = useMemo(() => MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter"), []);
  const tinterCabang = (nama: string) =>
    tinterList.filter((t) => (map[t.id] ?? t.cabang) === cabangShort(nama)).length;

  const totalTinter = items.reduce((s, c) => s + tinterCabang(c.nama), 0);
  const totalAlert = items.reduce((s, c) => s + Number(c.stokAlert ?? 0), 0);
  const cabangAlert = items.filter((c) => Number(c.stokAlert ?? 0) > 0).length;

  function openTambah() {
    setHapusId(null);
    setForm({ id: "", ...CABANG_BARU });
  }

  function openEdit(c: CabangRow) {
    setHapusId(null);
    setForm({
      id: c.id,
      nama: c.nama,
      kota: c.kota,
      alamat: c.alamat ?? "",
      telepon: c.telepon ?? "",
      minStokGram: c.minStokGram ?? 400,
      radiusMeter: c.radiusMeter ?? 100,
      koordinat: c.koordinat ?? "",
      status: c.status ?? "Aktif",
    });
  }

  function handleSave() {
    if (!form) return;
    if (!form.nama.trim() || !form.kota.trim()) {
      toast("Nama dan kota wajib diisi", "error");
      return;
    }
    const data = {
      nama: form.nama.trim(),
      kota: form.kota.trim(),
      alamat: form.alamat.trim(),
      telepon: form.telepon.trim(),
      minStokGram: Number(form.minStokGram) || 400,
      radiusMeter: Number(form.radiusMeter) || 100,
      koordinat: form.koordinat.trim() || KOORDINAT_CONTOH,
      status: form.status,
    };
    if (form.id) {
      update(form.id, data);
      toast(`${data.nama} diperbarui`, "success");
    } else {
      add({ ...data, tinter: 0, stokAlert: 0 });
      toast(`${data.nama} ditambahkan`, "success");
    }
    setForm(null);
  }

  function handleHapus(c: CabangRow) {
    const jumlah = tinterCabang(c.nama);
    if (jumlah > 0) {
      setHapusId(null);
      toast(`${cabangShort(c.nama)} masih punya ${jumlah} tinter · pindahkan dulu di HRIS → Assignment`, "error");
      return;
    }
    remove(c.id);
    setHapusId(null);
    toast(`${c.nama} dihapus`, "success");
  }

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
            onClick={openTambah}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah Cabang
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Cabang"
          value={String(items.length)}
          sub={`${items.filter((c) => c.status === "Aktif").length} aktif`}
          icon={Building2}
          color="blue"
        />
        <StatCard
          label="Tinter Terdaftar"
          value={String(totalTinter)}
          sub={`${tinterList.length} orang di data HRIS`}
          icon={Users}
          color="green"
        />
        <StatCard
          label="Cabang Alert Stok"
          value={String(cabangAlert)}
          sub={cabangAlert ? "perlu restock" : "semua stok aman"}
          icon={AlertTriangle}
          color={cabangAlert ? "red" : "green"}
        />
        <StatCard
          label="Item di Bawah Minimum"
          value={String(totalAlert)}
          sub="akumulasi semua cabang"
          icon={Store}
          color="amber"
        />
      </div>

      {form && (
        <ActionFormPanel
          title={form.id ? `Edit Cabang · ${form.nama}` : "Cabang Baru"}
          onClose={() => setForm(null)}
          onSave={handleSave}
          saveLabel={form.id ? "Simpan Perubahan" : "Simpan Cabang"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Nama Bengkel *</label>
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Bengkel ..."
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kota *</label>
              <input
                value={form.kota}
                onChange={(e) => setForm({ ...form, kota: e.target.value })}
                placeholder="Surabaya"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CabangRow["status"] })}
                className={fieldClass}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Alamat</label>
              <input
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Jl. Raya ..."
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Telepon</label>
              <input
                value={form.telepon}
                onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                placeholder="(031) 700123"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Min. Stok (gram)</label>
              <input
                type="number"
                min={0}
                value={form.minStokGram}
                onChange={(e) => setForm({ ...form, minStokGram: Number(e.target.value) })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Radius Geofence (meter)</label>
              <input
                type="number"
                min={50}
                max={1000}
                value={form.radiusMeter}
                onChange={(e) => setForm({ ...form, radiusMeter: Number(e.target.value) })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Koordinat Geofence</label>
              <input
                value={form.koordinat}
                onChange={(e) => setForm({ ...form, koordinat: e.target.value })}
                placeholder={KOORDINAT_CONTOH}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tinter di cabang ini</label>
              <input
                disabled
                value={form.id ? `${tinterCabang(form.nama)} orang` : "0 orang"}
                className={`${fieldClass} bg-slds-bg text-slds-text-weak`}
              />
            </div>
          </div>
          <p className="text-[11px] text-slds-text-weak mt-3">
            Tinter & alert stok ikut data assignment HRIS dan inventory · tidak diisi manual di sini.
          </p>
        </ActionFormPanel>
      )}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-slds-text">Master Cabang</h3>
        <p className="text-[11px] text-slds-text-weak">{items.length} cabang</p>
      </div>
      <DataTable
        columns={[
          {
            key: "nama",
            label: "Nama Bengkel",
            render: (r) => (
              <div>
                <p className="font-semibold">{r.nama}</p>
                <p className="text-[11px] text-slds-text-weak">
                  {r.alamat || "-"} · {r.telepon || "-"}
                </p>
              </div>
            ),
          },
          { key: "kota", label: "Kota" },
          { key: "minStokGram", label: "Min. Stok", render: (r) => `${r.minStokGram ?? 400} gr` },
          { key: "radiusMeter", label: "Geofence", render: (r) => `${r.radiusMeter ?? 100} m` },
          { key: "tinter", label: "Tinter", render: (r) => `${tinterCabang(r.nama)} orang` },
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
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status ?? "Aktif"} /> },
          {
            key: "aksi",
            label: "Aksi",
            render: (r) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-no-toast
                  onClick={() => openEdit(r)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold text-brand hover:bg-slds-bg"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                {hapusId === r.id ? (
                  <>
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => handleHapus(r)}
                      className="px-2 py-1 rounded-md bg-red-600 text-white text-[11px] font-semibold"
                    >
                      Yakin hapus?
                    </button>
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => setHapusId(null)}
                      className="px-2 py-1 rounded-md border border-slds-border text-[11px]"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    data-no-toast
                    onClick={() => setHapusId(r.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" /> Hapus
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={items}
        emptyMessage="Belum ada cabang"
      />

      <div className="mt-5">
        <h3 className="text-[13px] font-bold text-slds-text mb-2">Geofence Absensi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((c) => (
            <div key={c.id} className="bg-white border border-slds-border rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-slds-text">{c.nama}</p>
                    <p className="text-[11px] text-slds-text-weak">
                      {c.kota} · Radius {c.radiusMeter ?? 100} m · absensi tinter wajib di dalam area ini
                    </p>
                    <p className="text-[11px] text-slds-text-weak font-mono mt-1">{c.koordinat || KOORDINAT_CONTOH}</p>
                  </div>
                </div>
                <button
                  type="button"
                  data-no-toast
                  onClick={() => openEdit(c)}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold text-brand hover:bg-slds-bg"
                >
                  <Pencil className="h-3 w-3" /> Ubah
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-bold text-slds-text">Assignment Tinter per Cabang</h3>
          <Link href="/hris/assignment" className="text-[11px] font-semibold text-brand hover:underline">
            Kelola di HRIS → Assignment Cabang
          </Link>
        </div>
        <DataTable
          columns={[
            { key: "nama", label: "Nama" },
            { key: "jabatan", label: "Jabatan" },
            {
              key: "cabang",
              label: "Cabang",
              render: (r) => <span className="font-semibold">{map[String(r.id)] ?? String(r.cabang)}</span>,
            },
          ]}
          data={tinterList}
          emptyMessage="Belum ada tinter terdaftar"
        />
      </div>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Building2, MapPin, Pencil, Plus, Store, Users, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { MOCK_KARYAWAN } from "@/lib/mock-data";
import { CABANG_BARU, KOORDINAT_CONTOH, cabangShort, normalizeKodeCabang, type CabangRow } from "@/lib/cabang-utils";
import { karyawanDiCabang } from "@/lib/karyawan-utils";
import { useAssignment, useCabangList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

/** Field cabang yang bisa diubah user (tinter & alert stok dihitung, bukan diinput) */
type FormCabang = {
  id: string;
  kode: string;
  kepalaBengkel: string;
  ghHeadVendor: string;
  tukangCat: string;
  adminAstra: string;
  nama: string;
  kota: string;
  alamat: string;
  telepon: string;
  minStokGram: number;
  radiusMeter: number;
  koordinat: string;
  status: CabangRow["status"];
};

function formDari(c: CabangRow): FormCabang {
  return {
    id: c.id,
    kode: normalizeKodeCabang(c.kode, c.nama),
    kepalaBengkel: c.kepalaBengkel ?? "",
    ghHeadVendor: c.ghHeadVendor ?? "",
    tukangCat: c.tukangCat ?? "",
    adminAstra: c.adminAstra ?? "",
    nama: c.nama,
    kota: c.kota,
    alamat: c.alamat ?? "",
    telepon: c.telepon ?? "",
    minStokGram: c.minStokGram ?? 400,
    radiusMeter: c.radiusMeter ?? 100,
    koordinat: c.koordinat ?? "",
    status: c.status ?? "Aktif",
  };
}

export default function CabangPage() {
  return (
    <Suspense fallback={null}>
      <CabangContent />
    </Suspense>
  );
}

function CabangContent() {
  const { toast } = useToast();
  const params = useSearchParams();
  const { items, add, update } = useCabangList();
  const { map } = useAssignment();
  const [form, setForm] = useState<FormCabang | null>(null);
  const [showGeofence, setShowGeofence] = useState(false);
  const editDibukaRef = useRef("");

  const tinterList = useMemo(() => MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter"), []);
  const tinterCabang = (nama: string) =>
    tinterList.filter((t) => (map[t.id] ?? t.cabang) === cabangShort(nama)).length;

  const totalTinter = items.reduce((s, c) => s + tinterCabang(c.nama), 0);
  const totalAlert = items.reduce((s, c) => s + Number(c.stokAlert ?? 0), 0);
  const cabangAlert = items.filter((c) => Number(c.stokAlert ?? 0) > 0).length;
  /* Penerima komisi hanya karyawan yang bekerja di bengkel ini (assignment HRIS menimpa cabang master) */
  const karyawanCabang = useMemo(() => (form ? karyawanDiCabang(MOCK_KARYAWAN, map, form.nama) : []), [form, map]);

  /* Halaman detail bengkel membuka form edit lewat ?edit=<id> */
  const editId = params.get("edit");
  useEffect(() => {
    if (!editId || editDibukaRef.current === editId) return;
    const c = items.find((x) => x.id === editId);
    if (!c) return;
    editDibukaRef.current = editId;
    setForm(formDari(c));
  }, [editId, items]);

  function openTambah() {
    editDibukaRef.current = "";
    setForm({ id: "", ...CABANG_BARU });
  }

  function openEdit(c: CabangRow) {
    editDibukaRef.current = c.id;
    setShowGeofence(false);
    setForm(formDari(c));
  }

  function handleSave() {
    if (!form) return;
    if (!form.nama.trim() || !form.kota.trim()) {
      toast("Nama dan kota wajib diisi", "error");
      return;
    }
    const kode = normalizeKodeCabang(form.kode, form.nama);
    if (!/^[A-Z]{3}$/.test(kode)) {
      toast("Kode cabang wajib 3 huruf, mis. STR", "error");
      return;
    }
    const bentrok = items.find((c) => c.id !== form.id && normalizeKodeCabang(c.kode, c.nama) === kode);
    if (bentrok) {
      toast(`Kode ${kode} sudah dipakai ${cabangShort(bentrok.nama)}`, "error");
      return;
    }
    const data = {
      kode,
      kepalaBengkel: form.kepalaBengkel,
      ghHeadVendor: form.ghHeadVendor,
      tukangCat: form.tukangCat,
      adminAstra: form.adminAstra,
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

  const selectPenerima = (field: "kepalaBengkel" | "ghHeadVendor" | "tukangCat" | "adminAstra", label: string) => {
    const nilai = form ? form[field] : "";
    const terdaftar = karyawanCabang.some((k) => k.nama === nilai);
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <select
          value={nilai}
          onChange={(e) => form && setForm({ ...form, [field]: e.target.value })}
          className={`${fieldClass} bg-white`}
        >
          <option value="">— pilih karyawan bengkel —</option>
          {karyawanCabang.map((k) => (
            <option key={k.id} value={k.nama}>
              {k.nama} · {k.jabatan}
            </option>
          ))}
          {nilai && !terdaftar && (
            <option value={nilai}>{nilai} · tidak terdaftar di bengkel ini</option>
          )}
        </select>
        {karyawanCabang.length === 0 && (
          <p className="text-[10px] text-amber-600 mt-1">Belum ada karyawan di bengkel ini</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Master Cabang"
        desc="Daftar bengkel mitra, lokasi geofence, dan penerima komisi"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Master Cabang" }]}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => setShowGeofence(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold hover:bg-slds-bg"
            >
              <MapPin className="h-4 w-4" /> Geofence Absensi
            </button>
            <button
              type="button"
              data-no-toast
              onClick={openTambah}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" /> Tambah Cabang
            </button>
          </div>
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
              <label className={labelClass}>Kode Cabang *</label>
              <input
                value={form.kode}
                onChange={(e) =>
                  setForm({ ...form, kode: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) })
                }
                placeholder="STR"
                maxLength={3}
                className={`${fieldClass} font-mono uppercase tracking-widest`}
              />
              <p className="text-[10px] text-slds-text-weak mt-1">3 huruf · dipakai di ID transaksi DOA-STR-020326-001</p>
            </div>
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
            {selectPenerima("kepalaBengkel", "Kepala Bengkel")}
            {selectPenerima("ghHeadVendor", "Penerima Komisi · GH Head Vendor")}
            {selectPenerima("tukangCat", "Penerima Komisi · Tukang Cat")}
            {selectPenerima("adminAstra", "Penerima Komisi · Admin Astra")}
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CabangRow["status"] })}
                className={`${fieldClass} bg-white`}
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
            Penerima komisi dipilih dari karyawan yang bekerja di bengkel ini (HRIS → Karyawan / Assignment Cabang),
            jadi tidak mungkin orang dari bengkel lain ikut komisi. Nominalnya diisi per bulan di Finance → Komisi Bengkel.
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
              <Link href={`/operasional/cabang/${r.id}`} className="font-semibold text-brand hover:underline">
                {r.nama}
              </Link>
            ),
          },
          {
            key: "kode",
            label: "Kode",
            render: (r) => (
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-slds-border bg-slds-bg font-mono text-[11px] font-bold tracking-widest">
                {normalizeKodeCabang(r.kode, r.nama)}
              </span>
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
        ]}
        data={items}
        emptyMessage="Belum ada cabang"
      />

      {showGeofence && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGeofence(false);
          }}
        >
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-slds-border">
              <div>
                <p className="text-[13px] font-bold text-slds-text">Geofence Absensi</p>
                <p className="text-[11px] text-slds-text-weak">
                  Radius absensi tinter per cabang · absensi wajib di dalam area ini
                </p>
              </div>
              <button
                type="button"
                data-no-toast
                onClick={() => setShowGeofence(false)}
                className="shrink-0 p-1.5 rounded-md border border-slds-border hover:bg-slds-bg"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {items.map((c) => (
                <div key={c.id} className="border border-slds-border rounded-lg p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slds-text flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand shrink-0" /> {c.nama}
                    </p>
                    <p className="text-[11px] text-slds-text-weak mt-0.5">
                      {c.kota} · Radius {c.radiusMeter ?? 100} m
                    </p>
                    <p className="text-[11px] text-slds-text-weak font-mono mt-1">{c.koordinat || KOORDINAT_CONTOH}</p>
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
              ))}
            </div>
            <div className="shrink-0 px-4 py-3 border-t border-slds-border">
              <button
                type="button"
                data-no-toast
                onClick={() => setShowGeofence(false)}
                className="px-4 py-2 border border-slds-border rounded-md text-[13px] hover:bg-slds-bg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

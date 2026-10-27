"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { MOCK_KARYAWAN } from "@/lib/mock-data";
import { KOORDINAT_CONTOH, cabangShort, normalizeKodeCabang } from "@/lib/cabang-utils";
import { karyawanDiCabang } from "@/lib/karyawan-utils";
import { useAssignment, useCabangList } from "@/lib/preview-store";

/** Detail bengkel · identitas, alamat + geofence absensi, penerima komisi, karyawan, dan aksi */

function InfoBaris({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-[11px] uppercase font-semibold text-slds-text-weak">{label}</span>
      <span className="text-[12px] text-slds-text text-right min-w-0 break-words">{value}</span>
    </div>
  );
}

function Kartu({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slds-border rounded-lg p-4 shadow-sm">
      <p className="text-[12px] font-bold text-slds-text mb-2">{judul}</p>
      <div className="divide-y divide-slds-border">{children}</div>
    </div>
  );
}

export default function CabangDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { items, remove } = useCabangList();
  const { map } = useAssignment();
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false);

  const id = String(params.id ?? "");
  const cabang = items.find((c) => c.id === id);

  const karyawan = useMemo(
    () => (cabang ? karyawanDiCabang(MOCK_KARYAWAN, map, cabang.nama) : []),
    [cabang, map],
  );

  if (!cabang) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Bengkel tidak ditemukan</p>
        <Link href="/operasional/cabang" className="text-brand font-semibold text-[13px] mt-3 inline-block hover:underline">
          Kembali ke Master Cabang
        </Link>
      </div>
    );
  }

  const kode = normalizeKodeCabang(cabang.kode, cabang.nama);
  const tinter = karyawan.filter((k) => k.jabatan === "Tinter").length;
  const namaPenerima = [
    { label: "Kepala Bengkel", nilai: cabang.kepalaBengkel ?? "" },
    { label: "GH Head Vendor", nilai: cabang.ghHeadVendor ?? "" },
    { label: "Tukang Cat", nilai: cabang.tukangCat ?? "" },
    { label: "Admin Astra", nilai: cabang.adminAstra ?? "" },
  ];
  const penerimaTidakTerdaftar = namaPenerima.filter(
    (p) => p.nilai && !karyawan.some((k) => k.nama === p.nilai),
  );

  function hapus() {
    if (!cabang) return;
    if (tinter > 0) {
      setKonfirmasiHapus(false);
      toast(`${cabangShort(cabang.nama)} masih punya ${tinter} tinter · pindahkan dulu di HRIS → Assignment`, "error");
      return;
    }
    remove(cabang.id);
    toast(`${cabang.nama} dihapus`, "success");
    router.push("/operasional/cabang");
  }

  return (
    <div>
      <PageHeader
        title={cabang.nama}
        desc={`Kode ${kode} · ${cabang.kota} · ${cabang.status ?? "Aktif"}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "Master Cabang", href: "/operasional/cabang" },
          { label: cabangShort(cabang.nama) },
        ]}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/operasional/cabang"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold hover:bg-slds-bg"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
            <Link
              href={`/operasional/cabang?edit=${cabang.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-brand hover:bg-slds-bg"
            >
              <Pencil className="h-4 w-4" /> Edit Cabang
            </Link>
            {konfirmasiHapus ? (
              <>
                <button
                  type="button"
                  data-no-toast
                  onClick={hapus}
                  className="px-3 py-2 rounded-md bg-red-600 text-white text-[13px] font-semibold"
                >
                  Yakin hapus?
                </button>
                <button
                  type="button"
                  data-no-toast
                  onClick={() => setKonfirmasiHapus(false)}
                  className="px-3 py-2 border border-slds-border rounded-md text-[13px]"
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                type="button"
                data-no-toast
                onClick={() => setKonfirmasiHapus(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Kartu judul="Identitas Bengkel">
          <InfoBaris label="Kode" value={<span className="font-mono font-bold tracking-widest">{kode}</span>} />
          <InfoBaris label="Nama" value={cabang.nama} />
          <InfoBaris label="Kota" value={cabang.kota} />
          <InfoBaris label="Status" value={<StatusBadge status={cabang.status ?? "Aktif"} />} />
          <InfoBaris label="Min. Stok" value={`${cabang.minStokGram ?? 400} gram`} />
          <InfoBaris
            label="Alert Stok"
            value={
              Number(cabang.stokAlert) > 0 ? (
                <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" /> {cabang.stokAlert} item di bawah minimum
                </span>
              ) : (
                <span className="text-green-600">Stok aman</span>
              )
            }
          />
        </Kartu>

        <Kartu judul={"Alamat & Geofence Absensi"}>
          <InfoBaris label="Alamat" value={cabang.alamat || "-"} />
          <InfoBaris label="Telepon" value={cabang.telepon || "-"} />
          <InfoBaris
            label="Titik Geofence"
            value={
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <MapPin className="h-3 w-3 text-brand" /> {cabang.koordinat || KOORDINAT_CONTOH}
              </span>
            }
          />
          <InfoBaris label="Radius Absensi" value={`${cabang.radiusMeter ?? 100} meter`} />
          <InfoBaris label="Aturan" value="Absensi tinter wajib di dalam area geofence" />
        </Kartu>

        <Kartu judul="Penerima Komisi">
          <InfoBaris label="Kepala Bengkel" value={cabang.kepalaBengkel || "belum diisi"} />
          <InfoBaris label="GH Head Vendor" value={cabang.ghHeadVendor || "belum diisi"} />
          <InfoBaris label="Tukang Cat" value={cabang.tukangCat || "belum diisi"} />
          <InfoBaris label="Admin Astra" value={cabang.adminAstra || "belum diisi"} />
          <InfoBaris label="Nominal Komisi" value="Diisi tiap bulan di Finance → Komisi Bengkel" />
          {penerimaTidakTerdaftar.length > 0 && (
            <p className="text-[11px] text-amber-600 pt-1.5">
              {penerimaTidakTerdaftar.map((p) => p.label).join(", ")} belum terdaftar sebagai karyawan bengkel ini ·
              perbaiki di Edit Cabang
            </p>
          )}
        </Kartu>

        <Kartu judul="Ringkasan Karyawan">
          <InfoBaris label="Tinter" value={`${tinter} orang`} />
          <InfoBaris label="Total Karyawan" value={`${karyawan.length} orang`} />
          <InfoBaris
            label="Kelola Assignment"
            value={
              <Link href="/hris/assignment" className="text-brand font-semibold hover:underline">
                HRIS → Assignment Cabang
              </Link>
            }
          />
          <InfoBaris label="Penerima Komisi" value="Dipilih dari karyawan bengkel ini (HRIS → Assignment Cabang)" />
        </Kartu>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-slds-text flex items-center gap-1.5">
          <Users className="h-4 w-4 text-brand" /> Karyawan di Bengkel Ini
        </h3>
        <p className="text-[11px] text-slds-text-weak">{karyawan.length} orang</p>
      </div>
      <DataTable
        columns={[
          { key: "nama", label: "Nama" },
          { key: "jabatan", label: "Jabatan" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={karyawan}
        emptyMessage="Belum ada karyawan yang di-assign ke bengkel ini"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-slds-text-weak">
        <Link href="/operasional/cabang" className="text-brand font-semibold hover:underline">
          Kembali ke daftar bengkel
        </Link>
        <span>·</span>
        <Link href="/finance/komisi" className="text-brand font-semibold hover:underline">
          Lihat komisi bengkel ini
        </Link>
      </div>
    </div>
  );
}

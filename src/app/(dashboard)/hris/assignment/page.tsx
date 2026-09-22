"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { MOCK_KARYAWAN, MOCK_CABANG } from "@/lib/mock-data";
import { useAssignment } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

function cabangShort(nama: string) {
  return nama.replace(/^Bengkel /, "");
}

const CABANG_LABELS = MOCK_CABANG.map((c) => cabangShort(c.nama));

export default function AssignmentPage() {
  const { toast } = useToast();
  const { map, updateCabang } = useAssignment();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const tinterList = MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter");

  function getCabang(karyawanId: string) {
    return draft[karyawanId] ?? map[karyawanId] ?? "";
  }

  function handleSave(karyawanId: string, nama: string) {
    const cabang = getCabang(karyawanId);
    if (!cabang) return;
    updateCabang(karyawanId, cabang);
    setDraft((prev) => {
      const next = { ...prev };
      delete next[karyawanId];
      return next;
    });
    toast(`${nama} dipindah ke ${cabang}`, "success");
  }

  const capacity = CABANG_LABELS.map((label) => ({
    label,
    count: tinterList.filter((t) => (map[t.id] ?? t.cabang) === label).length,
    max: MOCK_CABANG.find((c) => cabangShort(c.nama) === label)?.tinter ?? 2,
  }));

  return (
    <div>
      <PageHeader
        title="Assignment Cabang"
        desc="Penugasan tinter ke bengkel/cabang · bisa pindah assignment"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Assignment Cabang" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slds-text mb-2">Tinter per Cabang</h3>
          <DataTable
            columns={[
              { key: "nama", label: "Nama" },
              {
                key: "cabang",
                label: "Cabang Saat Ini",
                render: (r) => (
                  <span className="font-semibold">{map[String(r.id)] ?? String(r.cabang)}</span>
                ),
              },
              {
                key: "aksi",
                label: "Pindah ke",
                render: (r) => {
                  const id = String(r.id);
                  const changed = draft[id] !== undefined && draft[id] !== map[id];
                  return (
                    <div className="flex items-center gap-1">
                      <select
                        value={getCabang(id)}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [id]: e.target.value }))}
                        className="px-2 py-1 border border-slds-border rounded text-[12px] bg-white"
                      >
                        {CABANG_LABELS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {changed && (
                        <button
                          type="button"
                          data-no-toast
                          onClick={() => handleSave(id, String(r.nama))}
                          className="p-1.5 bg-brand text-white rounded-md hover:bg-brand-dark"
                          title="Simpan"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={tinterList}
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slds-text mb-2">Kapasitas Cabang</h3>
          <div className="space-y-2">
            {capacity.map((c) => (
              <div key={c.label} className="bg-white border border-slds-border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-[13px] font-bold text-slds-text">{c.label}</p>
                  <p className="text-[11px] text-slds-text-weak">Kapasitas max {c.max} tinter</p>
                </div>
                <span className={`text-[13px] font-semibold ${c.count > c.max ? "text-red-600" : "text-brand"}`}>
                  {c.count} / {c.max} tinter
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slds-text-weak mt-3">
            Kapasitas dihitung ulang otomatis setelah assignment disimpan.
          </p>
        </div>
      </div>
    </div>
  );
}

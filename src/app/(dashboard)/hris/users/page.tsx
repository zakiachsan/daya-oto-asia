"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { useToast } from "@/components/ui/toast";
import { useAkunList } from "@/lib/preview-store";
import { AKUN_ROLES, type AkunRole } from "@/lib/akun-utils";

/**
 * Users & Akun · sumber data akun aplikasi.
 * Akun yang dibuat di sini dipakai sebagai pilihan penerima komisi di Master Cabang.
 */
export default function UsersPage() {
  const { toast } = useToast();
  const { items, add } = useAkunList();
  const [showForm, setShowForm] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AkunRole>("Tinter");

  function handleSave() {
    if (!nama.trim() || !email.trim()) {
      toast("Nama dan email wajib diisi", "error");
      return;
    }
    if (items.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      toast("Email itu sudah dipakai akun lain", "error");
      return;
    }
    add({ nama: nama.trim(), email: email.trim(), role });
    setShowForm(false);
    setNama("");
    setEmail("");
    toast(`User ${email.trim()} dibuat`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Users & Akun"
        desc="Kelola user, role, dan hak akses modul · akun di sini jadi pilihan penerima komisi di Master Cabang"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Users & Akun" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Tambah User
          </button>
        }
      />

      {showForm && (
        <ActionFormPanel title="User Baru" onClose={() => setShowForm(false)} onSave={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AkunRole)}
                className={`${fieldClass} bg-white`}
              >
                {AKUN_ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </ActionFormPanel>
      )}

      <DataTable
        columns={[
          { key: "nama", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "modul", label: "Akses Modul" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={items}
      />
    </div>
  );
}

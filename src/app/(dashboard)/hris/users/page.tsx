"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { useToast } from "@/components/ui/toast";

const INITIAL_USERS = [
  { email: "admin@dayaoto.com", nama: "Budi Santoso", role: "Admin", modul: "Semua", status: "Aktif" },
  { email: "ahmad@dayaoto.com", nama: "Pak Ahmad", role: "Supervisor", modul: "Operasional, HRIS", status: "Aktif" },
  { email: "siti@dayaoto.com", nama: "Siti Rahayu", role: "HR", modul: "HRIS", status: "Aktif" },
  { email: "finance@dayaoto.com", nama: "Finance Team", role: "Finance", modul: "Finance", status: "Aktif" },
  { email: "andi@dayaoto.com", nama: "Andi Wijaya", role: "Tinter", modul: "App", status: "Aktif" },
];

type UserRow = (typeof INITIAL_USERS)[number];

export default function UsersPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<UserRow[]>(INITIAL_USERS);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Tinter");

  const modulMap: Record<string, string> = {
    Admin: "Semua",
    Supervisor: "Operasional, HRIS",
    HR: "HRIS",
    Finance: "Finance",
    Tinter: "App",
  };

  function handleSave() {
    if (!nama.trim() || !email.trim()) {
      toast("Nama dan email wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { email: email.trim(), nama: nama.trim(), role, modul: modulMap[role] ?? "App", status: "Aktif" }]);
    setShowForm(false);
    setNama("");
    setEmail("");
    toast(`User ${email} dibuat`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Users & Akun"
        desc="Kelola user, role, dan hak akses modul"
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
              <select value={role} onChange={(e) => setRole(e.target.value)} className={`${fieldClass} bg-white`}>
                {Object.keys(modulMap).map((r) => <option key={r}>{r}</option>)}
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

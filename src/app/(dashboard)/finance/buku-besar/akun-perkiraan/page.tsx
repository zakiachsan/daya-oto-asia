"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { MOCK_COA, formatIDR } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

type COARow = (typeof MOCK_COA)[number];

export default function COAPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<COARow[]>(MOCK_COA);
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("Aset");
  const [sub, setSub] = useState("Kas & Bank");

  function handleSave() {
    if (!kode.trim() || !nama.trim()) {
      toast("Kode dan nama akun wajib diisi", "error");
      return;
    }
    setItems((prev) => [...prev, { kode: kode.trim(), nama: nama.trim(), tipe, sub, saldo: 0 }]);
    setShowForm(false);
    setKode("");
    setNama("");
    toast(`Akun ${kode} ditambahkan`, "success");
  }

  return (
    <div>
      <PageHeader
        title="Akun Perkiraan"
        desc="Chart of Accounts · hierarki akun sesuai standar PSAK (port erp-scw-distribution)"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Akun Perkiraan" }]}
        actions={
          <button type="button"
            data-no-toast onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold"
          >
            <Plus className="h-4 w-4" /> Tambah Akun
          </button>
        }
      />

      {showForm && (
        <div className="mb-4 bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[13px] font-bold text-slds-text mb-3">Akun Baru</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Kode</label>
              <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="110101" className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Nama Akun</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Kas" className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Tipe</label>
              <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
                {["Aset", "Kewajiban", "Modal", "Pendapatan", "Beban"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slds-text-weak uppercase font-semibold">Sub Tipe</label>
              <select value={sub} onChange={(e) => setSub(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
                {["Kas & Bank", "Piutang", "Persediaan", "Hutang", "Pendapatan", "Beban"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="button" data-no-toast onClick={handleSave} className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">Simpan</button>
            <button type="button" data-no-toast onClick={() => setShowForm(false)} className="px-4 py-2 border border-slds-border rounded-md text-[13px]">Batal</button>
          </div>
        </div>
      )}

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
        <input placeholder="Cari kode atau nama akun..." className="w-full pl-9 pr-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none" />
      </div>

      <DataTable
        columns={[
          { key: "kode", label: "Kode", className: "font-mono font-semibold" },
          { key: "nama", label: "Nama Akun" },
          { key: "tipe", label: "Tipe" },
          { key: "sub", label: "Sub Tipe" },
          { key: "saldo", label: "Saldo", render: (r) => formatIDR(Number(r.saldo)) },
        ]}
        data={items}
      />
    </div>
  );
}

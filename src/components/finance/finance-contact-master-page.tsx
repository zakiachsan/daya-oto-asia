"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { findSyaratBayar, syaratBayarLabel } from "@/lib/finance-master-data";
import { usePelanggan, usePemasok, useSyaratPembayaran } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

type MasterMode = "pelanggan" | "pemasok";

const CONFIG: Record<
  MasterMode,
  {
    title: string;
    section: string;
    desc: string;
    saldoLabel: string;
    saldoKey: "piutang" | "hutang";
    mirrorHref?: string;
    mirrorLabel?: string;
  }
> = {
  pelanggan: {
    title: "Pelanggan",
    section: "Penjualan",
    desc: "Master bengkel mitra — terhubung piutang & faktur penjualan",
    saldoLabel: "Piutang",
    saldoKey: "piutang",
    mirrorHref: "/operasional/cabang",
    mirrorLabel: "Master Cabang (Operasional)",
  },
  pemasok: {
    title: "Pemasok",
    section: "Pembelian",
    desc: "Master vendor pabrik cat — terhubung hutang & faktur pembelian",
    saldoLabel: "Hutang",
    saldoKey: "hutang",
  },
};

export function FinanceContactMasterPage({ mode }: { mode: MasterMode }) {
  const cfg = CONFIG[mode];
  const { toast } = useToast();
  const { items: syaratList } = useSyaratPembayaran();
  const pelanggan = usePelanggan();
  const pemasok = usePemasok();
  const store = mode === "pelanggan" ? pelanggan : pemasok;
  const items = store.items;

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [kota, setKota] = useState("");
  const [syaratBayarId, setSyaratBayarId] = useState("sp3");
  const [kontak, setKontak] = useState("");
  const [telepon, setTelepon] = useState("");
  const [npwp, setNpwp] = useState("");
  const [status, setStatus] = useState<"Aktif" | "Nonaktif">("Aktif");

  const aktifSyarat = syaratList.filter((s) => s.aktif);

  function resetForm() {
    setKode("");
    setNama("");
    setKota("");
    setSyaratBayarId(aktifSyarat[0]?.id ?? "sp3");
    setKontak("");
    setTelepon("");
    setNpwp("");
    setStatus("Aktif");
    setEditId(null);
  }

  function openAdd() {
    resetForm();
    const nextNum = items.length + 1;
    setKode(mode === "pelanggan" ? `PLG-${String(nextNum).padStart(3, "0")}` : `VND-${String(nextNum).padStart(3, "0")}`);
    setFormOpen(true);
  }

  function openEdit(id: string) {
    const row = items.find((r) => r.id === id);
    if (!row) return;
    setEditId(id);
    setKode(row.kode);
    setNama(row.nama);
    setKota("kota" in row ? row.kota : "");
    setSyaratBayarId(row.syaratBayarId);
    setKontak(row.kontak);
    setTelepon(row.telepon);
    setNpwp(row.npwp ?? "");
    setStatus(row.status);
    setFormOpen(true);
  }

  function handleSave() {
    if (!kode.trim() || !nama.trim() || !kontak.trim()) {
      toast("Kode, nama, dan kontak wajib diisi", "error");
      return;
    }
    if (mode === "pelanggan" && !kota.trim()) {
      toast("Kota wajib diisi", "error");
      return;
    }

    if (editId) {
      if (mode === "pelanggan") {
        pelanggan.update(editId, {
          kode: kode.trim(),
          nama: nama.trim(),
          kota: kota.trim(),
          syaratBayarId,
          kontak: kontak.trim(),
          telepon: telepon.trim(),
          npwp: npwp.trim() || undefined,
          status,
        });
      } else {
        pemasok.update(editId, {
          kode: kode.trim(),
          nama: nama.trim(),
          syaratBayarId,
          kontak: kontak.trim(),
          telepon: telepon.trim(),
          npwp: npwp.trim() || undefined,
          status,
        });
      }
      toast(`${cfg.title} diperbarui`, "success");
    } else if (mode === "pelanggan") {
      pelanggan.add({
        id: `p-${Date.now()}`,
        kode: kode.trim(),
        nama: nama.trim(),
        kota: kota.trim(),
        syaratBayarId,
        kontak: kontak.trim(),
        telepon: telepon.trim(),
        npwp: npwp.trim() || undefined,
        piutang: 0,
        status,
      });
      toast("Pelanggan baru ditambahkan", "success");
    } else {
      pemasok.add({
        id: `v-${Date.now()}`,
        kode: kode.trim(),
        nama: nama.trim(),
        syaratBayarId,
        kontak: kontak.trim(),
        telepon: telepon.trim(),
        npwp: npwp.trim() || undefined,
        hutang: 0,
        status,
      });
      toast("Pemasok baru ditambahkan", "success");
    }

    setFormOpen(false);
    resetForm();
  }

  const totalSaldo =
    mode === "pelanggan"
      ? pelanggan.items.reduce((s, r) => s + r.piutang, 0)
      : pemasok.items.reduce((s, r) => s + r.hutang, 0);

  return (
    <div>
      <PageHeader
        title={cfg.title}
        desc={cfg.desc}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: cfg.section },
          { label: cfg.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {cfg.mirrorHref && (
              <Link
                href={cfg.mirrorHref}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-slds-text hover:bg-slds-bg"
              >
                <ExternalLink className="h-4 w-4" />
                {cfg.mirrorLabel}
              </Link>
            )}
            <button
              type="button"
              data-no-toast
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
            >
              <Plus className="h-4 w-4" /> Tambah {cfg.title}
            </button>
          </div>
        }
      />

      {formOpen && (
        <ActionFormPanel
          title={editId ? `Edit ${cfg.title}` : `${cfg.title} Baru`}
          onClose={() => { setFormOpen(false); resetForm(); }}
          onSave={handleSave}
          saveLabel={editId ? "Simpan Perubahan" : "Simpan"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Kode</label>
              <input value={kode} onChange={(e) => setKode(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} className={fieldClass} />
            </div>
            {mode === "pelanggan" && (
              <div>
                <label className={labelClass}>Kota</label>
                <input value={kota} onChange={(e) => setKota(e.target.value)} className={fieldClass} />
              </div>
            )}
            <div>
              <label className={labelClass}>Syarat Pembayaran</label>
              <select value={syaratBayarId} onChange={(e) => setSyaratBayarId(e.target.value)} className={`${fieldClass} bg-white`}>
                {aktifSyarat.map((s) => (
                  <option key={s.id} value={s.id}>{syaratBayarLabel(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Kontak</label>
              <input value={kontak} onChange={(e) => setKontak(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Telepon</label>
              <input value={telepon} onChange={(e) => setTelepon(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>NPWP</label>
              <input value={npwp} onChange={(e) => setNpwp(e.target.value)} placeholder="Opsional" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "Aktif" | "Nonaktif")} className={`${fieldClass} bg-white`}>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Total {cfg.title}</p>
          <p className="text-xl font-bold text-slds-text mt-1">{items.length}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Aktif</p>
          <p className="text-xl font-bold text-green-600 mt-1">{items.filter((r) => r.status === "Aktif").length}</p>
        </div>
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <p className="text-[11px] text-slds-text-weak uppercase tracking-wide">Total {cfg.saldoLabel}</p>
          <p className="text-xl font-bold text-brand mt-1">{formatIDR(totalSaldo)}</p>
        </div>
      </div>

      {mode === "pelanggan" ? (
        <DataTable
          columns={[
            { key: "kode", label: "Kode", className: "font-mono text-[12px]" },
            { key: "nama", label: "Nama" },
            { key: "kota", label: "Kota" },
            {
              key: "syaratBayarId",
              label: "Syarat Bayar",
              render: (r) => {
                const s = findSyaratBayar(syaratList, r.syaratBayarId);
                return s ? syaratBayarLabel(s) : "—";
              },
            },
            { key: "kontak", label: "Kontak" },
            { key: "telepon", label: "Telepon" },
            {
              key: "piutang",
              label: "Piutang",
              render: (r) => (
                <span className={r.piutang > 0 ? "font-semibold text-amber-700" : "text-slds-text-weak"}>
                  {formatIDR(r.piutang)}
                </span>
              ),
              className: "text-right",
            },
            {
              key: "status",
              label: "Status",
              render: (r) => (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-slds-bg text-slds-text-weak"}`}>
                  {r.status}
                </span>
              ),
            },
            {
              key: "id",
              label: "",
              render: (r) => (
                <button type="button" data-no-toast onClick={() => openEdit(String(r.id))} className="text-[12px] text-brand font-semibold hover:underline">
                  Edit
                </button>
              ),
            },
          ]}
          data={pelanggan.items}
        />
      ) : (
        <DataTable
          columns={[
            { key: "kode", label: "Kode", className: "font-mono text-[12px]" },
            { key: "nama", label: "Nama" },
            {
              key: "syaratBayarId",
              label: "Syarat Bayar",
              render: (r) => {
                const s = findSyaratBayar(syaratList, r.syaratBayarId);
                return s ? syaratBayarLabel(s) : "—";
              },
            },
            { key: "kontak", label: "Kontak" },
            { key: "telepon", label: "Telepon" },
            {
              key: "hutang",
              label: "Hutang",
              render: (r) => (
                <span className={r.hutang > 0 ? "font-semibold text-amber-700" : "text-slds-text-weak"}>
                  {formatIDR(r.hutang)}
                </span>
              ),
              className: "text-right",
            },
            {
              key: "status",
              label: "Status",
              render: (r) => (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-slds-bg text-slds-text-weak"}`}>
                  {r.status}
                </span>
              ),
            },
            {
              key: "id",
              label: "",
              render: (r) => (
                <button type="button" data-no-toast onClick={() => openEdit(String(r.id))} className="text-[12px] text-brand font-semibold hover:underline">
                  Edit
                </button>
              ),
            },
          ]}
          data={pemasok.items}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { KAS_BANK_ACCOUNTS } from "@/lib/finance-master-data";
import { useTransferBank, useJurnalList } from "@/lib/preview-store";
import { postWithJurnal } from "@/lib/jurnal-post-utils";
import { jurnalSlug } from "@/lib/jurnal-utils";
import { useToast } from "@/components/ui/toast";

export function TransferBankPage() {
  const { toast } = useToast();
  const { items, add } = useTransferBank();
  const { all: jurnalList, add: addJurnal } = useJurnalList();
  const [formOpen, setFormOpen] = useState(false);
  const [dari, setDari] = useState<string>(KAS_BANK_ACCOUNTS[0]);
  const [ke, setKe] = useState<string>(KAS_BANK_ACCOUNTS[1]);
  const [jumlah, setJumlah] = useState(10000000);
  const [keterangan, setKeterangan] = useState("");

  function handleSave() {
    if (dari === ke) {
      toast("Akun sumber dan tujuan harus berbeda", "error");
      return;
    }
    if (jumlah <= 0) {
      toast("Jumlah transfer harus lebih dari 0", "error");
      return;
    }
    if (!keterangan.trim()) {
      toast("Keterangan wajib diisi", "error");
      return;
    }

    const newRow = {
      id: `TRF/2026/09/${String(items.length + 1).padStart(3, "0")}`,
      tanggal: new Date().toISOString().slice(0, 10),
      dari,
      ke,
      jumlah,
      keterangan: keterangan.trim(),
    };

    const jurnalId = postWithJurnal("transfer-bank", newRow, { jurnalList, addJurnal });
    add({ ...newRow, jurnalId });

    setFormOpen(false);
    setKeterangan("");
    toast(`Transfer ${newRow.id} tercatat · jurnal ${jurnalId}`, "success");
  }

  const totalTransfer = items.reduce((s, r) => s + r.jumlah, 0);

  return (
    <div>
      <PageHeader
        title="Transfer Bank"
        desc="Transfer antar rekening kas/bank · auto jurnal Dr tujuan / Cr sumber"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Kas & Bank" },
          { label: "Transfer Bank" },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setFormOpen(!formOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Buat Transfer
          </button>
        }
      />

      {formOpen && (
        <ActionFormPanel
          title="Transfer Antar Rekening"
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          saveLabel="Simpan & Post Jurnal"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>Dari Akun</label>
              <select value={dari} onChange={(e) => setDari(e.target.value)} className={`${fieldClass} bg-white`}>
                {KAS_BANK_ACCOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ke Akun</label>
              <select value={ke} onChange={(e) => setKe(e.target.value)} className={`${fieldClass} bg-white`}>
                {KAS_BANK_ACCOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Jumlah (Rp)</label>
              <input type="number" min={1} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Alasan transfer" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Saldo Kas" value={formatIDR(450000000)} icon={ArrowLeftRight} color="green" />
        <StatCard label="Saldo Bank BCA" value={formatIDR(400000000)} icon={ArrowLeftRight} color="blue" />
        <StatCard label="Transfer Bulan Ini" value={formatIDR(totalTransfer)} icon={ArrowLeftRight} color="amber" />
      </div>

      <DataTable
        columns={[
          { key: "id", label: "No. Transfer", className: "font-mono" },
          { key: "tanggal", label: "Tanggal" },
          { key: "dari", label: "Dari" },
          { key: "ke", label: "Ke" },
          { key: "keterangan", label: "Keterangan" },
          {
            key: "jumlah",
            label: "Jumlah",
            render: (r) => <span className="font-semibold text-brand">{formatIDR(Number(r.jumlah))}</span>,
            className: "text-right",
          },
          {
            key: "jurnalId",
            label: "Jurnal",
            render: (r) =>
              r.jurnalId ? (
                <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(String(r.jurnalId))}`} className="font-mono text-[12px] text-brand hover:underline">
                  {String(r.jurnalId)}
                </Link>
              ) : (
                "-"
              ),
          },
        ]}
        data={items}
      />
    </div>
  );
}

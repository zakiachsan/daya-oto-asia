"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useJurnalList, useKasBank, type KasBankRow } from "@/lib/preview-store";
import { postWithJurnal } from "@/lib/jurnal-post-utils";
import { jurnalSlug } from "@/lib/jurnal-utils";

type KasMode = "pembayaran" | "penerimaan";

export function KasVoucherPage({ mode }: { mode: KasMode }) {
  const { toast } = useToast();
  const isIn = mode === "penerimaan";
  const title = isIn ? "Penerimaan" : "Pembayaran";
  const { items, add } = useKasBank();
  const { all: jurnalList, add: addJurnal } = useJurnalList();
  const [formOpen, setFormOpen] = useState(false);
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState(1000000);
  const [akun, setAkun] = useState("Bank BCA");

  const filtered = items.filter((r) => r.tipe === (isIn ? "Penerimaan" : "Pembayaran"));

  function handleSave() {
    if (!keterangan.trim() || jumlah <= 0) {
      toast("Keterangan dan jumlah wajib diisi", "error");
      return;
    }
    const newRow: KasBankRow = {
      id: `${isIn ? "TRM" : "PMB"}/2026/09/${String(14 + items.length).padStart(3, "0")}`,
      tanggal: new Date().toISOString().slice(0, 10),
      tipe: isIn ? "Penerimaan" : "Pembayaran",
      akun,
      keterangan: keterangan.trim(),
      jumlah: isIn ? jumlah : -jumlah,
    };

    const jurnalId = postWithJurnal(isIn ? "kas-penerimaan" : "kas-pembayaran", newRow, {
      jurnalList,
      addJurnal,
    });
    add({ ...newRow, jurnalId });

    setFormOpen(false);
    setKeterangan("");
    toast(`Voucher ${newRow.id} tercatat · jurnal ${jurnalId}`, "success");
  }

  return (
    <div>
      <PageHeader
        title={title}
        desc={isIn ? "Penerimaan kas/bank · auto jurnal Dr Kas/Bank, Cr Pendapatan" : "Pembayaran kas/bank · auto jurnal Dr Beban, Cr Kas/Bank"}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Kas & Bank" },
          { label: title },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setFormOpen(!formOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-semibold text-white ${isIn ? "bg-green-600 hover:bg-green-700" : "bg-brand hover:bg-brand-dark"}`}
          >
            <Plus className="h-4 w-4" /> Buat {title}
          </button>
        }
      />

      {formOpen && (
        <ActionFormPanel
          title={isIn ? "Penerimaan Kas/Bank" : "Pembayaran Kas/Bank"}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          saveLabel="Simpan & Post Jurnal"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Akun</label>
              <select value={akun} onChange={(e) => setAkun(e.target.value)} className={`${fieldClass} bg-white`}>
                <option>Kas</option>
                <option>Bank BCA</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Jumlah (Rp)</label>
              <input type="number" min={1} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Keterangan transaksi" className={fieldClass} />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Saldo Kas" value={formatIDR(450000000)} icon={ArrowDownLeft} color="green" />
        <StatCard label="Saldo Bank BCA" value={formatIDR(400000000)} icon={ArrowDownLeft} color="blue" />
        <StatCard label={`${title} Bulan Ini`} value={formatIDR(filtered.reduce((s, r) => s + Math.abs(Number(r.jumlah)), 0))} icon={ArrowUpRight} color="amber" />
      </div>

      <DataTable
        columns={[
          { key: "id", label: "No. Voucher", className: "font-mono" },
          { key: "tanggal", label: "Tanggal" },
          { key: "akun", label: "Akun" },
          { key: "keterangan", label: "Keterangan" },
          {
            key: "jumlah",
            label: "Jumlah",
            render: (r) => {
              const n = Number(r.jumlah);
              return (
                <span className={n >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {formatIDR(Math.abs(n))}
                </span>
              );
            },
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
        data={filtered}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR, MOCK_CABANG, type OpbRow } from "@/lib/mock-data";
import { formatTanggalOpb, opbSiapInvoice, opbStatusLabel } from "@/lib/opb-utils";
import { fakturSlug } from "@/lib/faktur-utils";
import { buildFakturUntukOpb } from "@/lib/finance-invoice-batch-utils";
import { useFakturJual, useOpbList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

/** Alur penagihan Finance (#56): OPB terbit → Proses Invoice per cabang → cetak 2 dokumen → rekonsiliasi → kirim → Lunas */
const STEPS = ["OPB Terbit", "Proses Invoice", "Cetak 2 Invoice", "Rekonsiliasi", "Kirim", "Lunas"] as const;

const CABANG_OPTIONS = MOCK_CABANG.map((c) => c.nama.replace(/^Bengkel /, ""));

export default function ProsesInvoicePage() {
  const { toast } = useToast();
  const { items: opbList, patch: patchOpb } = useOpbList();
  const { all: fakturJual, add: addFaktur } = useFakturJual();
  const [cabang, setCabang] = useState(CABANG_OPTIONS[0]);
  const [terpilih, setTerpilih] = useState<string[]>([]);

  const opbCabang = useMemo(
    () =>
      opbList
        .filter((o) => o.cabang.includes(cabang))
        .sort((a, b) => (b.tanggalOpb ?? "").localeCompare(a.tanggalOpb ?? "")),
    [opbList, cabang],
  );

  const siapInvoice = opbCabang.filter((o) => opbSiapInvoice(o, fakturJual));
  const totalTerpilih = opbCabang
    .filter((o) => terpilih.includes(o.id))
    .reduce((s, o) => s + o.total, 0);

  function toggle(id: string) {
    setTerpilih((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function prosesInvoice() {
    const pilihan = opbCabang.filter((o) => terpilih.includes(o.id) && opbSiapInvoice(o, fakturJual));
    if (pilihan.length === 0) {
      toast("Centang minimal 1 OPB yang sudah terbit & belum difakturkan", "error");
      return;
    }
    const fakturBaru = buildFakturUntukOpb(pilihan, fakturJual);
    fakturBaru.forEach((f) => addFaktur(f));
    /* OPB masuk penagihan → status Ditagihkan (dari sisi Ops: "masuk faktur penjualan") */
    pilihan.forEach((o) => patchOpb(o.id, { status: "Ditagihkan" }));
    setTerpilih([]);
    toast(
      `${fakturBaru.length} faktur digenerate · cetak Faktur + Rekap dari detail: ${fakturBaru.map((f) => f.id).join(", ")}`,
      "success",
    );
  }

  return (
    <div>
      <PageHeader
        title="Proses Invoice per Cabang"
        desc="Pilih cabang · centang OPB yang sudah terbit · generate faktur (total ambil dari OPB, bukan dibagi)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Penjualan" },
          { label: "Proses Invoice" },
        ]}
      />

      <div className="flex gap-1 mb-4 flex-wrap">
        {STEPS.map((s) => (
          <span key={s} className="px-2 py-1 rounded text-[11px] font-semibold bg-slds-bg text-slds-text-weak">
            {s}
          </span>
        ))}
      </div>

      <div className="bg-white border border-slds-border rounded-lg p-4 mb-4 flex flex-wrap items-end gap-3">
        <label className="block text-[12px] min-w-[220px]">
          <span className="text-[11px] text-slds-text-weak uppercase font-semibold">Cabang</span>
          <select
            value={cabang}
            onChange={(e) => {
              setCabang(e.target.value);
              setTerpilih([]);
            }}
            className="w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white"
          >
            {CABANG_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <div className="text-[12px] text-slds-text-weak">
          {siapInvoice.length} OPB siap invoice · {terpilih.length} dicentang · {formatIDR(totalTerpilih)}
        </div>
        <button
          type="button"
          data-no-toast
          onClick={prosesInvoice}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
        >
          <FileText className="h-4 w-4" /> Proses Invoice ({terpilih.length})
        </button>
      </div>

      <DataTable
        columns={[
          {
            key: "pilih",
            label: "Pilih",
            render: (r) => (
              <input
                type="checkbox"
                data-no-toast
                aria-label={`Pilih ${String(r.id)}`}
                checked={terpilih.includes(String(r.id))}
                disabled={!opbSiapInvoice(r as OpbRow, fakturJual)}
                onChange={() => toggle(String(r.id))}
              />
            ),
          },
          {
            key: "id",
            label: "No. OPB",
            render: (r) => (
              <Link href={`/operasional/opb/${r.id}`} className="font-mono font-semibold text-brand hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "periode", label: "Periode" },
          { key: "tanggalOpb", label: "Tgl. OPB", render: (r) => formatTanggalOpb(r.tanggalOpb as string) },
          { key: "jumlahTrx", label: "Nota" },
          { key: "total", label: "Total OPB", render: (r) => formatIDR(Number(r.total)) },
          {
            key: "sap",
            label: "No. SAP",
            render: (r) => (r.sap ? <span className="font-mono">{String(r.sap)}</span> : <span className="text-slds-text-weak">belum ada</span>),
          },
          { key: "status", label: "Status OPB", render: (r) => <StatusBadge status={opbStatusLabel(String(r.status))} /> },
          {
            key: "faktur",
            label: "Faktur",
            render: (r) => {
              const f = fakturJual.find((x) => x.opbId === r.id);
              return f ? (
                <Link href={`/finance/penjualan/faktur-penjualan/${fakturSlug(f.id)}`} className="font-mono font-semibold text-brand hover:underline">
                  {f.id}
                </Link>
              ) : (
                <span className="text-slds-text-weak">belum</span>
              );
            },
          },
        ]}
        data={opbCabang}
      />

      <div className="mt-4 bg-slds-bg border border-slds-border rounded-lg p-4 text-[12px] text-slds-text-weak">
        <p className="font-semibold text-slds-text mb-1 flex items-center gap-1">
          <Receipt className="h-3.5 w-3.5" /> Setelah klik Proses Invoice
        </p>
        <p>
          Tiap OPB jadi 1 faktur penjualan (total = total OPB). Dua dokumen cetak tersedia di detail faktur:
          <strong> Faktur Penjualan</strong> dan <strong>Rekap Invoice</strong> (lampiran). Lanjut: rekonsiliasi vs OPB →
          kirim invoice → status Lunas muncul otomatis saat piutang lunas.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Receipt, ArrowDownLeft, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ActionFormPanel, fieldClass, labelClass } from "@/components/ui/action-form-panel";
import { formatIDR } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import {
  useFakturJual,
  useFakturBeli,
  useHutangPiutang,
  useFinancePayments,
  useJurnalList,
} from "@/lib/preview-store";
import type { FakturJualRow } from "@/lib/faktur-utils";
import type { FakturBeliRow } from "@/lib/faktur-beli-utils";
import { jurnalSlug } from "@/lib/jurnal-utils";
import {
  applyPaymentToHutang,
  ensureHutangFromFakturBeli,
  ensurePiutangFromFaktur,
  hutangForFakturBeli,
  nextPaymentId,
  piutangForFaktur,
  type FinancePaymentRow,
} from "@/lib/finance-payment-utils";
import { postWithJurnal } from "@/lib/jurnal-post-utils";

type PaymentMode = "penerimaan" | "pembayaran";

export function FinancePaymentPage({ mode }: { mode: PaymentMode }) {
  const isPenerimaan = mode === "penerimaan";
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const { all: fakturJual } = useFakturJual();
  const { all: fakturBeli } = useFakturBeli();
  const { items: hutangItems, replaceAll } = useHutangPiutang();
  const { items: payments, add: addPayment } = useFinancePayments();
  const { all: jurnalList, add: addJurnal } = useJurnalList();

  const prefillFaktur = searchParams.get("faktur") ?? "";

  const [formOpen, setFormOpen] = useState(Boolean(prefillFaktur));
  const [fakturId, setFakturId] = useState(prefillFaktur);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [jumlah, setJumlah] = useState(0);
  const [akun, setAkun] = useState("Bank BCA");
  const [keterangan, setKeterangan] = useState("");

  const title = isPenerimaan ? "Penerimaan Penjualan" : "Pembayaran Pembelian";
  const section = isPenerimaan ? "Penjualan" : "Pembelian";

  const postedJual = useMemo(
    () => fakturJual.filter((f) => f.status === "Posted"),
    [fakturJual],
  );
  const postedBeli = useMemo(
    () => fakturBeli.filter((f) => f.status === "Posted"),
    [fakturBeli],
  );

  function resolvePiutang(items: typeof hutangItems, faktur: FakturJualRow) {
    let next = items;
    if (!piutangForFaktur(next, faktur)) {
      next = ensurePiutangFromFaktur(next, faktur);
    }
    return { items: next, hp: piutangForFaktur(next, faktur)! };
  }

  function resolveHutang(items: typeof hutangItems, faktur: FakturBeliRow) {
    let next = items;
    if (!hutangForFakturBeli(next, faktur)) {
      next = ensureHutangFromFakturBeli(next, faktur);
    }
    return { items: next, hp: hutangForFakturBeli(next, faktur)! };
  }

  function sisaForFakturJual(faktur: FakturJualRow) {
    const hp = piutangForFaktur(hutangItems, faktur);
    return hp?.sisa ?? faktur.total;
  }

  function sisaForFakturBeli(faktur: FakturBeliRow) {
    const hp = hutangForFakturBeli(hutangItems, faktur);
    return hp?.sisa ?? faktur.total;
  }

  const unpaidJual = postedJual.filter((f) => sisaForFakturJual(f) > 0);
  const unpaidBeli = postedBeli.filter((f) => sisaForFakturBeli(f) > 0);

  const selectedJual = postedJual.find((f) => f.id === fakturId);
  const selectedBeli = postedBeli.find((f) => f.id === fakturId);
  const sisaSelected = isPenerimaan
    ? selectedJual
      ? sisaForFakturJual(selectedJual)
      : 0
    : selectedBeli
      ? sisaForFakturBeli(selectedBeli)
      : 0;

  const history = payments.filter((p) => p.tipe === (isPenerimaan ? "Penerimaan" : "Pembayaran"));
  const totalBulanIni = history.reduce((s, p) => s + p.jumlah, 0);

  function handleFakturChange(id: string) {
    setFakturId(id);
    if (isPenerimaan) {
      const f = postedJual.find((x) => x.id === id);
      if (f) setJumlah(sisaForFakturJual(f));
    } else {
      const f = postedBeli.find((x) => x.id === id);
      if (f) setJumlah(sisaForFakturBeli(f));
    }
  }

  function handleSave() {
    if (!fakturId) {
      toast("Pilih faktur terlebih dahulu", "error");
      return;
    }
    if (jumlah <= 0) {
      toast("Jumlah pembayaran harus lebih dari 0", "error");
      return;
    }
    if (jumlah > sisaSelected) {
      toast(`Jumlah melebihi sisa tagihan (${formatIDR(sisaSelected)})`, "error");
      return;
    }

    let hpItems = hutangItems;
    let hpId = "";
    let refFaktur = fakturId;
    let pihak = "";

    if (isPenerimaan) {
      const faktur = postedJual.find((f) => f.id === fakturId);
      if (!faktur) {
        toast("Faktur tidak ditemukan", "error");
        return;
      }
      const resolved = resolvePiutang(hpItems, faktur);
      hpItems = resolved.items;
      hpId = resolved.hp.id;
      pihak = faktur.pelanggan;
    } else {
      const faktur = postedBeli.find((f) => f.id === fakturId);
      if (!faktur) {
        toast("Faktur tidak ditemukan", "error");
        return;
      }
      const resolved = resolveHutang(hpItems, faktur);
      hpItems = resolved.items;
      hpId = resolved.hp.id;
      pihak = faktur.vendor;
    }

    const hp = hpItems.find((h) => h.id === hpId)!;
    const paymentId = nextPaymentId(isPenerimaan ? "Penerimaan" : "Pembayaran", payments.length + 15);
    const jurnalType = isPenerimaan ? "penerimaan-penjualan" : "pembayaran-pembelian";

    const payment: FinancePaymentRow = {
      id: paymentId,
      tanggal,
      tipe: isPenerimaan ? "Penerimaan" : "Pembayaran",
      refFaktur,
      pihak,
      jumlah,
      akun,
      keterangan: keterangan.trim() || `${isPenerimaan ? "Penerimaan" : "Pembayaran"} ${refFaktur}`,
      jurnalId: "",
      hutangId: hpId,
    };

    const jurnalId = postWithJurnal(jurnalType, { ...payment, jurnalId: "" }, { jurnalList, addJurnal });
    payment.jurnalId = jurnalId;

    const updatedHp = applyPaymentToHutang(hp, payment);
    const nextHutang = hpItems.map((h) => (h.id === hpId ? updatedHp : h));

    replaceAll(nextHutang);
    addPayment(payment);

    setFormOpen(false);
    setKeterangan("");
    setFakturId("");
    setJumlah(0);
    toast(`${paymentId} tercatat — jurnal ${jurnalId} di-post`, "success");
  }

  return (
    <div>
      <PageHeader
        title={title}
        desc={
          isPenerimaan
            ? "Pelunasan piutang dari faktur penjualan — auto jurnal Dr Kas/Bank, Cr Piutang"
            : "Pelunasan hutang ke vendor — auto jurnal Dr Hutang, Cr Kas/Bank"
        }
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: section },
          { label: title },
        ]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => setFormOpen(!formOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-semibold text-white ${isPenerimaan ? "bg-green-600 hover:bg-green-700" : "bg-brand hover:bg-brand-dark"}`}
          >
            <Plus className="h-4 w-4" /> Catat {isPenerimaan ? "Penerimaan" : "Pembayaran"}
          </button>
        }
      />

      {formOpen && (
        <ActionFormPanel
          title={isPenerimaan ? "Penerimaan dari Pelanggan" : "Pembayaran ke Vendor"}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          saveLabel="Simpan & Post Jurnal"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Faktur</label>
              <select
                value={fakturId}
                onChange={(e) => handleFakturChange(e.target.value)}
                className={`${fieldClass} bg-white`}
              >
                <option value="">— Pilih faktur —</option>
                {(isPenerimaan ? unpaidJual : unpaidBeli).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} · {isPenerimaan ? (f as FakturJualRow).pelanggan : (f as FakturBeliRow).vendor} · sisa{" "}
                    {formatIDR(isPenerimaan ? sisaForFakturJual(f as FakturJualRow) : sisaForFakturBeli(f as FakturBeliRow))}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tanggal</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Akun Kas/Bank</label>
              <select value={akun} onChange={(e) => setAkun(e.target.value)} className={`${fieldClass} bg-white`}>
                <option>Kas</option>
                <option>Bank BCA</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Jumlah (Rp){sisaSelected > 0 && <span className="text-slds-text-weak font-normal"> · sisa {formatIDR(sisaSelected)}</span>}
              </label>
              <input
                type="number"
                min={1}
                max={sisaSelected || undefined}
                value={jumlah || ""}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className={fieldClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Keterangan</label>
              <input
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Opsional — catatan pembayaran"
                className={fieldClass}
              />
            </div>
          </div>
        </ActionFormPanel>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard
          label={isPenerimaan ? "Faktur Belum Lunas" : "Hutang Belum Lunas"}
          value={String(isPenerimaan ? unpaidJual.length : unpaidBeli.length)}
          icon={Receipt}
          color="amber"
        />
        <StatCard
          label={`${isPenerimaan ? "Penerimaan" : "Pembayaran"} Bulan Ini`}
          value={formatIDR(totalBulanIni)}
          icon={ArrowDownLeft}
          color="blue"
        />
        <StatCard label="Total Transaksi" value={String(history.length)} icon={ListChecks} color="green" />
      </div>

      <DataTable
        columns={[
          { key: "id", label: "No. Bukti", className: "font-mono text-[12px]" },
          { key: "tanggal", label: "Tanggal" },
          { key: "refFaktur", label: "Ref. Faktur", className: "font-mono text-[12px]" },
          { key: "pihak", label: isPenerimaan ? "Pelanggan" : "Vendor" },
          { key: "akun", label: "Akun" },
          {
            key: "jumlah",
            label: "Jumlah",
            render: (r) => (
              <span className={`font-semibold ${isPenerimaan ? "text-green-600" : "text-red-600"}`}>
                {formatIDR(Number(r.jumlah))}
              </span>
            ),
            className: "text-right",
          },
          {
            key: "jurnalId",
            label: "Jurnal",
            render: (r) => (
              <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(String(r.jurnalId))}`} className="font-mono text-[12px] text-brand hover:underline">
                {String(r.jurnalId)}
              </Link>
            ),
          },
          { key: "keterangan", label: "Keterangan" },
        ]}
        data={history}
        emptyMessage={`Belum ada ${isPenerimaan ? "penerimaan" : "pembayaran"} tercatat`}
      />
    </div>
  );
}

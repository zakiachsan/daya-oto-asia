"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Coins, FileText, HandCoins, Lock, Unlock, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { formatIDR } from "@/lib/mock-data";
import { useCabangList, useJurnalList, useKomisiBengkel, useOpbList } from "@/lib/preview-store";
import { jurnalSlug } from "@/lib/jurnal-utils";
import {
  KOMISI_PIHAK,
  buildKomisiJurnal,
  periodeBerjalan,
  periodeLabelFromKey,
  periodeTersedia,
  hitungKomisiBulan,
  type KomisiBulanTotals,
  type KomisiCabangRow,
} from "@/lib/komisi-utils";
import { KomisiManualModal, type KomisiManualDraft } from "@/components/finance/komisi-manual-modal";

function totalsDari(rows: KomisiCabangRow[]): KomisiBulanTotals {
  return rows.reduce<KomisiBulanTotals>(
    (acc, row) => ({
      jumlahNota: acc.jumlahNota + row.jumlahNota,
      dpp: acc.dpp + row.dpp,
      komisiKepala: acc.komisiKepala + row.komisiKepala,
      komisiTinter: acc.komisiTinter + row.komisiTinter,
      manual: {
        "gh-head-vendor": acc.manual["gh-head-vendor"] + row.manual["gh-head-vendor"],
        "tukang-cat": acc.manual["tukang-cat"] + row.manual["tukang-cat"],
        "admin-astra": acc.manual["admin-astra"] + row.manual["admin-astra"],
      },
      total: acc.total + row.total,
      jumlahCabang: acc.jumlahCabang + (row.dihitung ? 1 : 0),
    }),
    {
      jumlahNota: 0,
      dpp: 0,
      komisiKepala: 0,
      komisiTinter: 0,
      manual: { "gh-head-vendor": 0, "tukang-cat": 0, "admin-astra": 0 },
      total: 0,
      jumlahCabang: 0,
    },
  );
}

export default function KomisiBengkelPage() {
  const { toast } = useToast();
  const { items: opb } = useOpbList();
  const { items: cabang } = useCabangList();
  const { manual, setManual, finalkanPeriode, bukaPeriode, periodeRow, bayarRow, tandaiBayar, batalBayar, setJurnal } =
    useKomisiBengkel();
  const { all: jurnalList, add: addJurnal } = useJurnalList();

  const daftarPeriode = useMemo(() => {
    const list = periodeTersedia(opb);
    return list.length ? list : [periodeBerjalan()];
  }, [opb]);

  const [periodeKey, setPeriodeKey] = useState(() => daftarPeriode[0] ?? periodeBerjalan());
  const [modalCabang, setModalCabang] = useState<string | null>(null);

  const periodeLabel = periodeLabelFromKey(periodeKey);
  const info = periodeRow(periodeKey);
  const final = info?.status === "Final";
  const snapshot = info?.snapshot ?? [];

  const live = useMemo(
    () => hitungKomisiBulan({ periodeKey, cabang, opb, manual }),
    [periodeKey, cabang, opb, manual],
  );

  const pakaiSnapshot = final && snapshot.length > 0;
  const rows = pakaiSnapshot ? snapshot : live.rows;
  const totals = pakaiSnapshot ? totalsDari(snapshot) : live.totals;

  const totalPihakLain = KOMISI_PIHAK.reduce((s, p) => s + totals.manual[p.id], 0);

  function draftManual(cabangNama: string): KomisiManualDraft {
    const row = rows.find((r) => r.cabang === cabangNama);
    return {
      "gh-head-vendor": row?.manual["gh-head-vendor"] ?? 0,
      "tukang-cat": row?.manual["tukang-cat"] ?? 0,
      "admin-astra": row?.manual["admin-astra"] ?? 0,
    };
  }

  function simpanManual(cabangNama: string, draft: KomisiManualDraft) {
    for (const pihak of KOMISI_PIHAK) {
      setManual({ cabang: cabangNama, periode: periodeKey, pihak: pihak.id, nominal: draft[pihak.id] });
    }
    setModalCabang(null);
    toast(`Komisi manual ${cabangNama} disimpan`, "success");
  }

  function tutupPeriode() {
    finalkanPeriode(periodeKey, live.rows, "Finance");
    toast(`Periode ${periodeLabel} ditutup · angka komisi dikunci`, "success");
  }

  function bukaKembaliPeriode() {
    bukaPeriode(periodeKey);
    toast(`Periode ${periodeLabel} dibuka lagi`, "info");
  }

  function postJurnal() {
    const jurnal = buildKomisiJurnal({ periodeKey, rows, jurnalList });
    if (!jurnal) {
      toast("Belum ada komisi untuk dijurnal di periode ini", "error");
      return;
    }
    addJurnal(jurnal);
    setJurnal(periodeKey, jurnal.id);
    toast(`Jurnal ${jurnal.id} diposting · Dr Beban Komisi / Cr Hutang Komisi`, "success");
  }

  const jurnalId = info?.jurnalId;

  return (
    <div>
      <PageHeader
        title="Komisi Bengkel"
        desc="Komisi bulanan tiap bengkel: 5% kepala bengkel, Rp 1.000/nota untuk tinter, dan 3 pihak manual"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Komisi" }, { label: "Komisi Bengkel" }]}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <input
              type="month"
              value={periodeKey}
              onChange={(e) => setPeriodeKey(e.target.value || periodeKey)}
              className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
            />
            {final && !jurnalId && (
              <button
                type="button"
                data-no-toast
                onClick={postJurnal}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold text-brand hover:bg-slds-bg"
              >
                <FileText className="h-3.5 w-3.5" /> Post Jurnal
              </button>
            )}
            {final ? (
              <button
                type="button"
                data-no-toast
                disabled={!!jurnalId}
                title={jurnalId ? "Jurnal sudah diposting · buka jurnalnya kalau perlu koreksi" : undefined}
                onClick={bukaKembaliPeriode}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold hover:bg-slds-bg disabled:opacity-40"
              >
                <Unlock className="h-3.5 w-3.5" /> Buka Periode
              </button>
            ) : (
              <button
                type="button"
                data-no-toast
                onClick={tutupPeriode}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
              >
                <Lock className="h-3.5 w-3.5" /> Tutup Periode
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Total Komisi"
          value={formatIDR(totals.total)}
          sub={`${totals.jumlahCabang} bengkel dihitung · ${periodeLabel}`}
          icon={Coins}
          color="amber"
        />
        <StatCard label="Kepala Bengkel" value={formatIDR(totals.komisiKepala)} sub="5% × DPP sebelum PPN" icon={HandCoins} color="green" />
        <StatCard
          label="Komisi Tinter"
          value={formatIDR(totals.komisiTinter)}
          sub={`${totals.jumlahNota} nota · Rp ${(1000).toLocaleString("id-ID")}/nota`}
          icon={Users}
          color="blue"
        />
        <StatCard label="Pihak Lain" value={formatIDR(totalPihakLain)} sub="GH Head Vendor · Tukang Cat · Admin Astra" icon={Wallet} color="orange" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={final ? "Final" : "Draft"} />
        <p className="text-[12px] text-slds-text-weak">
          {final
            ? `Periode dikunci ${info?.oleh ?? "Finance"}${info?.waktu ? ` · ${new Date(info.waktu).toLocaleString("id-ID")}` : ""}`
            : `Periode ${periodeLabel} · angka masih bisa berubah kalau OPB/faktur bertambah`}
        </p>
        {jurnalId && (
          <Link
            href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(jurnalId)}`}
            className="text-[12px] font-semibold text-brand hover:underline"
          >
            Jurnal {jurnalId}
          </Link>
        )}
        <p className="ml-auto text-[12px] text-slds-text-weak">DPP dihitung: {formatIDR(totals.dpp)}</p>
      </div>

      <DataTable<KomisiCabangRow>
        columns={[
          {
            key: "cabang",
            label: "Bengkel",
            render: (r) => (
              <div className="min-w-0">
                <Link href={`/finance/komisi/${encodeURIComponent(r.cabang)}?periode=${periodeKey}`} className="font-semibold text-brand hover:underline">
                  {r.cabang}
                </Link>
                <p className="text-[11px] text-slds-text-weak">
                  {r.kodeCabang} · {r.kepalaBengkel || "kepala bengkel belum diisi"}
                </p>
              </div>
            ),
          },
          {
            key: "opbId",
            label: "OPB",
            render: (r) => (
              <div>
                <p className="font-mono text-[12px]">{r.opbId}</p>
                <p className={`text-[11px] ${r.dihitung ? "text-slds-text-weak" : "text-amber-600 font-semibold"}`}>
                  {r.dihitung ? r.opbStatus : r.info}
                </p>
              </div>
            ),
          },
          { key: "jumlahNota", label: "Nota", className: "text-right tabular-nums" },
          { key: "dpp", label: "DPP", render: (r) => formatIDR(r.dpp), className: "text-right tabular-nums" },
          {
            key: "komisiKepala",
            label: "Kepala 5%",
            render: (r) => formatIDR(r.komisiKepala),
            className: "text-right tabular-nums",
          },
          {
            key: "komisiTinter",
            label: "Tinter",
            render: (r) => formatIDR(r.komisiTinter),
            className: "text-right tabular-nums",
          },
          {
            key: "pihakLain",
            label: "Pihak Lain",
            render: (r) => {
              const nilai = KOMISI_PIHAK.reduce((s, p) => s + r.manual[p.id], 0);
              const rincian = KOMISI_PIHAK.map(
                (p) => `${p.label}${r.pihakNama[p.id] ? ` (${r.pihakNama[p.id]})` : ""} ${formatIDR(r.manual[p.id])}`,
              ).join(" · ");
              const penerima = KOMISI_PIHAK.map((p) => ({ id: p.id, nama: r.pihakNama[p.id] })).filter((x) => x.nama);
              return (
                <div title={rincian} className="min-w-[110px]">
                  <span className="tabular-nums block text-right">{formatIDR(nilai)}</span>
                  {penerima.map((x) => (
                    <p key={x.id} className="text-[10px] text-slds-text-weak leading-snug whitespace-nowrap">
                      {x.nama}
                    </p>
                  ))}
                </div>
              );
            },
            className: "text-right tabular-nums",
          },
          {
            key: "total",
            label: "Total",
            render: (r) => <span className="font-bold">{formatIDR(r.total)}</span>,
            className: "text-right tabular-nums",
          },
          {
            key: "bayar",
            label: "Bayar",
            render: (r) => {
              const b = bayarRow(periodeKey, r.cabang);
              if (b) {
                return (
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-green-700">Dibayar</span>
                    <span className="text-[11px] text-slds-text-weak">
                      {new Date(b.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => batalBayar(periodeKey, r.cabang)}
                      className="text-[10px] text-slds-text-weak underline hover:text-red-600"
                    >
                      batal
                    </button>
                  </div>
                );
              }
              if (!final) return <span className="text-[11px] text-slds-text-weak">kunci periode dulu</span>;
              if (r.total <= 0) return <span className="text-[11px] text-slds-text-weak">-</span>;
              return (
                <button
                  type="button"
                  data-no-toast
                  onClick={() => tandaiBayar(periodeKey, r.cabang)}
                  className="whitespace-nowrap px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold hover:bg-slds-bg"
                >
                  Tandai Dibayar
                </button>
              );
            },
          },
          {
            key: "aksi",
            label: "Aksi",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-no-toast
                  disabled={final}
                  onClick={() => setModalCabang(r.cabang)}
                  className="px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold text-brand hover:bg-slds-bg disabled:opacity-40"
                >
                  Manual
                </button>
                <Link
                  href={`/finance/komisi/${encodeURIComponent(r.cabang)}?periode=${periodeKey}`}
                  className="px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold hover:bg-slds-bg"
                >
                  Detail
                </Link>
              </div>
            ),
          },
        ]}
        data={rows}
        emptyMessage="Belum ada cabang di Master Cabang"
      />

      <p className="mt-4 text-[11px] text-slds-text-weak leading-relaxed">
        Hanya OPB yang sudah masuk faktur (status Ditagihkan) yang dihitung. OPB yang masih Proses Invoice atau Rekonsiliasi
        tampil sebagai info supaya kelihatan bengkel mana yang belum bisa dikomisi. Kepala bengkel diambil dari Master Cabang.
      </p>

      {modalCabang !== null && (
        <KomisiManualModal
          cabang={modalCabang}
          periodeLabel={periodeLabel}
          awal={draftManual(modalCabang)}
          onClose={() => setModalCabang(null)}
          onSave={(draft) => simpanManual(modalCabang, draft)}
        />
      )}
    </div>
  );
}

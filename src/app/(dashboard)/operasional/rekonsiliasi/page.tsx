"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, FileText, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterBar } from "@/components/ui/filter-bar";
import type { TransaksiRow } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { formatTanggalOpb } from "@/lib/opb-utils";
import { useOpbList, useTransaksiList } from "@/lib/preview-store";
import { buildRekonsiliasiFromData, buildSelisihDetail } from "@/lib/rekonsiliasi-utils";
/** Nama bulan untuk format periode OPB */
const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** "2026-09-26" → "September 2026" (format periode OPB) */
function periodeDariTanggal(iso: string) {
  const [tahun, bulan] = iso.split("-");
  return `${BULAN_ID[Number(bulan) - 1] ?? bulan} ${tahun}`;
}

export default function RekonsiliasiPage() {
  const { toast } = useToast();
  const { items: opbList, patch: patchOpb, add: addOpb } = useOpbList();
  const { all: transaksi, update } = useTransaksiList();
  const rekonsiliasiRows = useMemo(() => buildRekonsiliasiFromData(transaksi, opbList), [transaksi, opbList]);
  /* Input no. OPB per nota yang belum masuk OPB (di dalam panel detail selisih) */
  const [opbDraft, setOpbDraft] = useState<Record<string, string>>({});

  /* Stat card & kartu temuan dihitung dari data biar nggak beda sama tabel */
  const stat = useMemo(() => {
    const match = rekonsiliasiRows.filter((r) => r.selisih === 0).length;
    return {
      total: rekonsiliasiRows.length,
      match,
      review: rekonsiliasiRows.length - match,
      belumOpb: rekonsiliasiRows.filter((r) => r.opb === 0 && r.notaCetak > 0).length,
    };
  }, [rekonsiliasiRows]);
  /* Drill-down: klik selisih di ringkasan → rincian OPB & nota cabang itu */
  const [detailCabang, setDetailCabang] = useState<string | null>(null);
  const detail = useMemo(
    () => (detailCabang ? buildSelisihDetail(transaksi, opbList, detailCabang) : null),
    [detailCabang, transaksi, opbList],
  );

  /* Simpan no. OPB untuk satu nota · begitu tersimpan, nota itu keluar dari daftar temuan */
  function handleAssignOpb(t: TransaksiRow) {
    const nomor = (opbDraft[t.id] ?? "").trim().toUpperCase();
    if (!nomor) {
      toast("No. OPB wajib diisi", "error");
      return;
    }
    const existing = opbList.find((o) => o.id.toUpperCase() === nomor);
    if (existing) {
      /* OPB-nya sudah ada → tambah 1 trx + nilai tagihannya */
      patchOpb(existing.id, { jumlahTrx: existing.jumlahTrx + 1, total: existing.total + t.total });
      update(t.id, { opbId: existing.id });
      toast(`Nota ${t.id} masuk ${existing.id}`, "success");
    } else {
      /* No. OPB baru → dibuatkan OPB-nya sekalian */
      addOpb({
        id: nomor,
        cabang: t.cabang,
        periode: periodeDariTanggal(t.tanggal),
        jumlahTrx: 1,
        total: t.total,
        status: "Menunggu TTD",
        sap: "",
        tanggalOpb: new Date().toISOString().slice(0, 10),
      });
      update(t.id, { opbId: nomor });
      toast(`OPB ${nomor} dibuat · nota ${t.id} dimasukkan`, "success");
    }
    setOpbDraft((prev) => {
      const next = { ...prev };
      delete next[t.id];
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        title="Rekonsiliasi OPB"
        desc="Bandingkan nota tercetak vs OPB yang sudah keluar · selisih dihitung per Point B"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Rekonsiliasi" }]}
        actions={
          <button
            type="button"
            data-no-toast
            onClick={() => toast("Laporan rekonsiliasi diekspor (preview PDF)", "success")}
            className="px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
          >
            Export Laporan
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Cabang Match" value={String(stat.match)} sub={`Dari ${stat.total} cabang · nota = OPB`} icon={CheckCircle2} color="green" />
        <StatCard label="Perlu Review" value={String(stat.review)} sub="Ada nota belum masuk OPB" icon={AlertTriangle} color="orange" />
        <StatCard label="Belum Ada OPB Keluar" value={String(stat.belumOpb)} sub="Nota sudah tercetak, OPB belum keluar" icon={FileText} color="red" />
      </div>

      <FilterBar
        searchPlaceholder="Cari cabang..."
        filters={[{ label: "periode", options: ["Agustus 2026", "Juli 2026"] }]}
      />
      <DataTable
        columns={[
          { key: "cabang", label: "Cabang" },
          { key: "opb", label: "OPB Keluar", render: (r) => `${r.opb} trx` },
          { key: "notaCetak", label: "Nota Tercetak", render: (r) => `${r.notaCetak} trx` },
          {
            key: "selisih",
            label: "Selisih (Point B)",
            render: (r) => {
              /* Point B · notaCetak − opb. Di app nota selalu dicetak sebelum OPB, jadi
                 selisih positif = ada nota yang belum masuk OPB (temuan), negatif = data OPB perlu dicek.
                 Bisa diklik → buka rincian transaksinya (cek 1 per 1). */
              const selisih = Number(r.selisih);
              return (
                <button
                  type="button"
                  data-no-toast
                  onClick={() => setDetailCabang(String(r.cabang))}
                  title="Lihat nota mana yang belum masuk OPB, atau OPB mana yang belum ada notanya"
                  className={`inline-flex items-center gap-0.5 font-bold underline decoration-dotted underline-offset-2 hover:decoration-solid ${
                    selisih !== 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {selisih === 0
                    ? "Match"
                    : selisih > 0
                      ? `${selisih} nota belum masuk OPB`
                      : `OPB lebih ${Math.abs(selisih)} dari nota · cek data OPB`}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              );
            },
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={rekonsiliasiRows}
      />

      {detailCabang && detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" aria-hidden data-no-toast onClick={() => setDetailCabang(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-selisih-title"
            className="relative w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[88vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slds-border px-5 py-3 flex items-start justify-between gap-3">
              <div>
                <h2 id="detail-selisih-title" className="text-[15px] font-bold">
                  Nota belum masuk OPB · {detailCabang}
                </h2>
                <p className="text-[12px] text-slds-text-weak mt-0.5">
                  {detail.notaTanpaOpbKeluar.length} nota tercetak belum punya OPB · OPB keluar {detail.opbKeluarTrx} trx
                </p>
              </div>
              <button
                type="button"
                data-no-toast
                onClick={() => setDetailCabang(null)}
                aria-label="Tutup"
                className="p-1.5 rounded-md hover:bg-slds-bg text-slds-text-weak shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              {detail.notaTanpaOpbKeluar.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-[13px] font-bold text-green-800">Semua nota sudah masuk OPB</p>
                  <p className="text-[12px] text-green-700 mt-1">
                    Nggak ada nota tercetak yang belum punya OPB di cabang ini.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[12px] text-slds-text-weak mb-3">
                    Isi no. OPB untuk tiap nota, lalu klik Simpan. Kalau no. OPB-nya belum ada, OPB baru otomatis dibuat.
                  </p>
                  <datalist id="opb-opsi">
                    {detail.opbKeluar.map((o) => (
                      <option key={o.id} value={o.id} />
                    ))}
                  </datalist>
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-slds-border text-left text-[10px] uppercase tracking-wide text-slds-text-weak">
                        <th className="py-2 font-semibold">No. Transaksi</th>
                        <th className="py-2 font-semibold">Status</th>
                        <th className="py-2 font-semibold">No. OPB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.notaTanpaOpbKeluar.map((t) => (
                        <tr key={t.id} className="border-b border-slds-border last:border-0">
                          <td className="py-2 pr-3">
                            <Link
                              href={`/operasional/transaksi/${t.id}`}
                              className="font-mono font-semibold text-brand hover:underline"
                            >
                              {t.id}
                            </Link>
                            <span className="block text-[11px] text-slds-text-weak">
                              {formatTanggalOpb(t.tanggal)} · {t.platNomor} · {t.mobil}
                            </span>
                          </td>
                          <td className="py-2 pr-3 align-top">
                            <StatusBadge status={String(t.status)} />
                          </td>
                          <td className="py-2 align-top">
                            <div className="flex items-center gap-1.5">
                              <input
                                list="opb-opsi"
                                value={opbDraft[t.id] ?? ""}
                                onChange={(e) => setOpbDraft((prev) => ({ ...prev, [t.id]: e.target.value }))}
                                placeholder="OPB-2026-xxxx"
                                className="w-40 px-2 py-1.5 border border-slds-border rounded-md text-[12px] font-mono"
                              />
                              <button
                                type="button"
                                data-no-toast
                                onClick={() => handleAssignOpb(t)}
                                className="px-2.5 py-1.5 bg-brand text-white rounded-md text-[11px] font-semibold hover:bg-brand-dark"
                              >
                                Simpan
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

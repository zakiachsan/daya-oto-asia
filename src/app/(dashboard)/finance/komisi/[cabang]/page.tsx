"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Coins, HandCoins, Pencil, Printer, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { formatIDR } from "@/lib/mock-data";
import { useCabangList, useKomisiBengkel, useOpbList, useTransaksiList } from "@/lib/preview-store";
import { jurnalSlug } from "@/lib/jurnal-utils";
import { cabangShort } from "@/lib/cabang-utils";
import {
  KOMISI_PIHAK,
  KOMISI_KEPALA_RATE,
  KOMISI_TINTER_PER_NOTA,
  hitungKomisiBulan,
  periodeBerjalan,
  periodeLabelFromKey,
  rincianKomisiTinter,
  samaCabangSatu,
  type KomisiCabangRow,
} from "@/lib/komisi-utils";
import { cetakRekapKomisi } from "@/lib/komisi-print";
import { KomisiManualModal, type KomisiManualDraft } from "@/components/finance/komisi-manual-modal";

function bacaParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function KomisiCabangDetailPage() {
  const params = useParams();
  const search = useSearchParams();
  const { toast } = useToast();

  const cabangNama = bacaParam(String(params.cabang ?? ""));
  const periodeKey = search.get("periode") || periodeBerjalan();
  const periodeLabel = periodeLabelFromKey(periodeKey);

  const { items: opb } = useOpbList();
  const { items: cabang } = useCabangList();
  const { all: transaksi } = useTransaksiList();
  const { manual, setManual, periodeRow, bayarRow, tandaiBayar, batalBayar } = useKomisiBengkel();

  const info = periodeRow(periodeKey);
  const final = info?.status === "Final";

  const live = useMemo(
    () => hitungKomisiBulan({ periodeKey, cabang, opb, manual }),
    [periodeKey, cabang, opb, manual],
  );

  const snapRow = final ? info?.snapshot?.find((r) => samaCabangSatu(r.cabang, cabangNama)) : undefined;
  const row: KomisiCabangRow | undefined = snapRow ?? live.rows.find((r) => samaCabangSatu(r.cabang, cabangNama));

  const rincian = useMemo(
    () => rincianKomisiTinter({ cabang: cabangNama, periodeKey, transaksi }),
    [cabangNama, periodeKey, transaksi],
  );

  const [showModal, setShowModal] = useState(false);

  if (!row) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Bengkel tidak ditemukan di Master Cabang</p>
        <Link href="/finance/komisi" className="text-brand font-semibold text-[13px] mt-3 inline-block hover:underline">
          Kembali ke Komisi Bengkel
        </Link>
      </div>
    );
  }

  const selisihNota = row.jumlahNota - rincian.totalNota;

  const draftAwal: KomisiManualDraft = {
    "gh-head-vendor": row.manual["gh-head-vendor"],
    "tukang-cat": row.manual["tukang-cat"],
    "admin-astra": row.manual["admin-astra"],
  };

  function simpanManual(draft: KomisiManualDraft) {
    for (const pihak of KOMISI_PIHAK) {
      setManual({ cabang: row!.cabang, periode: periodeKey, pihak: pihak.id, nominal: draft[pihak.id] });
    }
    setShowModal(false);
    toast(`Komisi manual ${row!.cabang} disimpan`, "success");
  }

  return (
    <div>
      <PageHeader
        title={`Komisi ${cabangShort(row.cabang)}`}
        desc={`Periode ${periodeLabel} · ${final ? "periode sudah dikunci" : "periode masih berjalan"}`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Komisi Bengkel", href: "/finance/komisi" },
          { label: cabangShort(row.cabang) },
        ]}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <input
              type="month"
              value={periodeKey}
              onChange={(e) => {
                const next = e.target.value;
                if (next) window.location.href = `/finance/komisi/${encodeURIComponent(row.cabang)}?periode=${next}`;
              }}
              className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white focus:border-brand focus:outline-none"
            />
            <button
              type="button"
              data-no-toast
              disabled={final}
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slds-border rounded-md text-[13px] font-semibold hover:bg-slds-bg disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5" /> Input Manual
            </button>
            <button
              type="button"
              data-no-toast
              onClick={() =>
                cetakRekapKomisi({
                  row: row!,
                  tinter: rincian.rows,
                  periodeLabel,
                  selisihNota,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak Rekap
            </button>
          </div>
        }
      />

      <Link href={`/finance/komisi?periode=${periodeKey}`} className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="DPP sebelum PPN"
          value={formatIDR(row.dpp)}
          sub={`${row.jumlahNota} nota · ${row.opbId}`}
          icon={Coins}
          color="blue"
        />
        <StatCard
          label={`Kepala Bengkel (${Math.round(KOMISI_KEPALA_RATE * 100)}%)`}
          value={formatIDR(row.komisiKepala)}
          sub={row.kepalaBengkel || "kepala bengkel belum diisi"}
          icon={HandCoins}
          color="green"
        />
        <StatCard
          label="Tinter"
          value={formatIDR(row.komisiTinter)}
          sub={`${row.jumlahNota} nota × ${formatIDR(KOMISI_TINTER_PER_NOTA)}`}
          icon={Users}
          color="amber"
        />
        <StatCard label="Total Komisi" value={formatIDR(row.total)} sub={final ? "dikunci (Final)" : "belum dikunci"} icon={Coins} color="orange" />
      </div>

      {!row.dihitung && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-[12px] text-amber-800">
            {row.info}. Komisi baru dihitung setelah OPB masuk faktur (status Ditagihkan).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div>
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Komponen Komisi</h3>
          <DataTable
            columns={[
              { key: "komponen", label: "Komponen" },
              { key: "dasar", label: "Dasar Hitung" },
              {
                key: "nilai",
                label: "Nilai",
                render: (r) => <span className="font-semibold">{formatIDR(Number(r.nilai))}</span>,
                className: "text-right tabular-nums",
              },
            ]}
            data={[
              {
                komponen: `Kepala Bengkel (${Math.round(KOMISI_KEPALA_RATE * 100)}%)`,
                dasar: `${formatIDR(row.dpp)} sebelum PPN`,
                nilai: row.komisiKepala,
              },
              {
                komponen: "Tinter",
                dasar: `${row.jumlahNota} nota × ${formatIDR(KOMISI_TINTER_PER_NOTA)}`,
                nilai: row.komisiTinter,
              },
              ...KOMISI_PIHAK.map((p) => ({
                komponen: p.label,
                dasar: row.pihakNama[p.id] ? `Manual · ${row.pihakNama[p.id]}` : "Manual · penerima belum diisi",
                nilai: row.manual[p.id],
              })),
              { komponen: "Total", dasar: "", nilai: row.total },
            ]}
            emptyMessage="Belum ada komponen"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-bold text-slds-text">Rincian Nota per Tinter</h3>
            <p className="text-[11px] text-slds-text-weak">nota nyata bulan ini</p>
          </div>
          <DataTable
            columns={[
              { key: "tinter", label: "Tinter" },
              { key: "jumlahNota", label: "Nota", className: "text-right tabular-nums" },
              { key: "nilai", label: "Komisi", render: (r) => formatIDR(Number(r.nilai)), className: "text-right tabular-nums" },
            ]}
            data={rincian.rows}
            emptyMessage="Belum ada nota tercatat untuk bengkel ini di periode tersebut"
          />
          <p className="mt-2 text-[11px] text-slds-text-weak">
            Nota di OPB: {row.jumlahNota} · tertangkap di app: {rincian.totalNota}
            {selisihNota !== 0 ? ` · selisih ${selisihNota} nota tidak teratribusi ke tinter` : " · cocok"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-slds-text-weak">
        <StatusBadge status={final ? "Final" : "Draft"} />
        <span>Kode bengkel {row.kodeCabang}</span>
        <span>·</span>
        <span>{row.opbStatus}</span>
        {(() => {
          const bayar = bayarRow(periodeKey, row.cabang);
          if (bayar) {
            return (
              <span className="inline-flex items-center gap-1.5">
                <span className="font-semibold text-green-700">Dibayar</span>
                <span>{new Date(bayar.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <button type="button" data-no-toast onClick={() => batalBayar(periodeKey, row.cabang)} className="underline hover:text-red-600">
                  batalkan
                </button>
              </span>
            );
          }
          if (!final) return <span>Kunci periode dulu untuk menandai pembayaran</span>;
          if (row.total <= 0) return null;
          return (
            <button
              type="button"
              data-no-toast
              onClick={() => {
                tandaiBayar(periodeKey, row.cabang);
                toast(`Komisi ${row.kodeCabang} ditandai dibayar`, "success");
              }}
              className="px-2 py-1 rounded-md border border-slds-border text-[11px] font-semibold hover:bg-slds-bg"
            >
              Tandai Dibayar
            </button>
          );
        })()}
        {info?.jurnalId && (
          <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(info.jurnalId)}`} className="text-brand font-semibold hover:underline">
            Jurnal {info.jurnalId}
          </Link>
        )}
        <Link href="/operasional/cabang" className="text-brand font-semibold hover:underline">
          Ubah kepala bengkel di Master Cabang
        </Link>
      </div>

      {showModal && (
        <KomisiManualModal
          cabang={row.cabang}
          periodeLabel={periodeLabel}
          awal={draftAwal}
          onClose={() => setShowModal(false)}
          onSave={simpanManual}
        />
      )}
    </div>
  );
}

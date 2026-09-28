"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Info, RefreshCw, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { NotaSearchSelect } from "@/components/mobile/nota-search-select";
import { useTransaksiList } from "@/lib/preview-store";
import { MOBILE_USER } from "@/lib/mobile-app-utils";
import { buildTransaksiCatatan, type TransaksiCatatanItem } from "@/lib/transaksi-catatan-utils";
import { formatIDR, type TransaksiRow } from "@/lib/mock-data";

/** Isi nota: satu baris per bahan (round mixing) */
function isiNota(trx: TransaksiRow) {
  return buildTransaksiCatatan(trx);
}

type IsiNotaListProps = {
  lines: TransaksiCatatanItem[];
  /** Chip penanda baris, mis. Lama / Baru */
  badge?: { text: string; tone: "lama" | "baru" };
};

/** Daftar isi nota: kategori · kode warna, kode bahan yang dipakai, dan harga barisnya */
function IsiNotaList({ lines, badge }: IsiNotaListProps) {
  if (lines.length === 0) return <p className="text-[12px] text-slds-text-weak">Tidak ada isi bahan.</p>;
  return (
    <ul className="space-y-1.5">
      {lines.map((l) => (
        <li key={`${l.urut}-${l.kodeWarna}`} className="flex items-start justify-between gap-2">
          <span className="min-w-0 text-[12px] leading-snug">
            <span className="font-semibold text-slds-text">
              {l.kategoriLabel} · {l.kodeWarna}
            </span>
            <span className="block text-[11px] text-slds-text-weak">
              {l.bahan.length} kode{l.bahan.length ? ` · ${l.bahan.map((b) => b.kode).join(", ")}` : ""}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {l.total != null && <span className="text-[12px] font-semibold text-slds-text">{formatIDR(l.total)}</span>}
            {badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  badge.tone === "baru" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {badge.text}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

type HasilGabungProps = {
  sumber: TransaksiRow;
  tujuan: TransaksiRow;
  onClose: () => void;
};

/** Hasil gabung: isi nota yang dibatalkan + isi nota baru (lama vs baru) */
function HasilGabungModal({ sumber, tujuan, onClose }: HasilGabungProps) {
  const isiLama = isiNota(tujuan);
  const isiBaru = isiNota(sumber);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hasil-gabung-title"
        className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white p-4 border-b border-slds-border flex items-start justify-between gap-3">
          <div>
            <h2 id="hasil-gabung-title" className="text-[15px] font-bold text-slds-text flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand" /> Nota berhasil digabung
            </h2>
            <p className="text-[12px] text-slds-text-weak mt-1">
              {sumber.id} dibatalkan dan digabung ke {tujuan.id}
            </p>
          </div>
          <button type="button" data-no-toast onClick={onClose} className="p-1 text-slds-text-weak" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <section className="overflow-hidden rounded-xl border border-slds-border">
            <header className="flex items-center justify-between gap-2 bg-red-50 px-3 py-2">
              <p className="text-[11px] font-bold uppercase text-red-700">Nota yang dibatalkan</p>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                Dibatalkan
              </span>
            </header>
            <div className="space-y-2 p-3">
              <div className="min-w-0">
                <p className="text-[13px] font-bold font-mono text-slds-text">{sumber.id}</p>
                <p className="text-[11px] text-slds-text-weak">
                  {sumber.platNomor} · {sumber.warna}
                </p>
              </div>
              <IsiNotaList lines={isiBaru} />
              <div className="flex items-center justify-between border-t border-slds-border pt-2">
                <p className="text-[11px] font-semibold text-slds-text-weak">Total nota dibatalkan</p>
                <p className="text-[13px] font-bold text-slds-text">{formatIDR(sumber.total)}</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slds-border">
            <header className="flex items-center justify-between gap-2 bg-slds-bg px-3 py-2">
              <p className="text-[11px] font-bold uppercase text-slds-text-weak">Isi nota baru</p>
              <span className="rounded-full border border-slds-border bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-slds-text-weak">
                {tujuan.status}
              </span>
            </header>
            <div className="space-y-3 p-3">
              <div className="min-w-0">
                <p className="text-[13px] font-bold font-mono text-slds-text">{tujuan.id}</p>
                <p className="text-[11px] text-slds-text-weak">
                  {tujuan.platNomor} · {tujuan.warna}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-bold uppercase text-slds-text-weak">Sudah ada di nota ini</p>
                <IsiNotaList lines={isiLama} badge={{ text: "Lama", tone: "lama" }} />
              </div>

              <div>
                <p className="mb-1 text-[10px] font-bold uppercase text-slds-text-weak">
                  Baru · dari {sumber.id}
                </p>
                <IsiNotaList lines={isiBaru} badge={{ text: "Baru", tone: "baru" }} />
              </div>

              <div className="space-y-1 border-t border-slds-border pt-2">
                <p className="text-[11px] text-slds-text-weak">
                  Lama {formatIDR(tujuan.total)} + baru {formatIDR(sumber.total)}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-slds-text">Total nota baru</p>
                  <p className="text-[14px] font-bold text-brand">{formatIDR(tujuan.total + sumber.total)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-slds-border bg-slds-bg p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-[11px] text-slds-text leading-snug">
                  Baris <span className="font-semibold">BARU</span> tidak mengurangi stok di Inventory. Stok nota yang dibatalkan sudah keluar dan tidak dikembalikan · bahan tetap tercatat terjual.
                </p>
              </div>
            </div>
          </section>

        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t border-slds-border flex gap-2">
          <Link
            href={`/app/transaksi/${tujuan.id}`}
            className="flex-1 py-3 text-center border border-brand text-brand rounded-xl font-bold text-[13px]"
          >
            Buka Nota Tujuan
          </Link>
          <button
            type="button"
            data-no-toast
            onClick={onClose}
            className="flex-1 py-3 bg-brand text-white rounded-xl font-bold text-[13px]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tukar-Tambah Nota (#42) · nota batal digabung ke nota berjalan tanpa restore stok */
export default function TukarNotaPage() {
  const { toast } = useToast();
  const { all, update } = useTransaksiList();
  const mine = all.filter((t) => t.tinter === MOBILE_USER);
  const [batalId, setBatalId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [hasil, setHasil] = useState<{ sumber: TransaksiRow; tujuan: TransaksiRow } | null>(null);

  const notaBatal = mine.filter((t) => t.status === "Menunggu TTD" || t.status === "Menunggu OPB");
  const notaJalan = mine.filter((t) => t.status === "Draft" || t.status === "Menunggu TTD");

  function handleGabung() {
    if (!batalId || !targetId || batalId === targetId) {
      toast("Pilih nota batal dan nota tujuan yang berbeda", "error");
      return;
    }
    const sumber = all.find((t) => t.id === batalId);
    const tujuan = all.find((t) => t.id === targetId);
    if (!sumber || !tujuan) {
      toast("Nota tidak ditemukan · muat ulang halaman", "error");
      return;
    }

    update(batalId, { status: "Dibatalkan", parentId: targetId });
    toast("Nota dibatalkan digabung · stok tidak dikembalikan (tetap terjual)", "success");
    /* Snapshot buat gambaran hasil gabung */
    setHasil({
      sumber: { ...sumber, status: "Dibatalkan", parentId: targetId },
      tujuan,
    });
    setBatalId("");
    setTargetId("");
  }

  return (
    <div className="space-y-4">
      <Link href="/app/transaksi" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Transaksi
      </Link>
      <h1 className="text-lg font-bold text-slds-text flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-brand" /> Tukar-Tambah Nota
      </h1>
      <p className="text-[12px] text-slds-text-weak leading-snug">
        Pilih nota yang dibatalkan dan nota pekerjaan berjalan. Stok yang sudah keluar tidak dikembalikan; saat digabung tidak mengurangi inventory lagi.
      </p>
      <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
        <NotaSearchSelect
          label="Nota dibatalkan"
          items={notaBatal}
          value={batalId}
          onChange={setBatalId}
          detailOf={(t) => t.platNomor}
          placeholder="Cari no. nota, plat, warna…"
          emptyHint="Belum ada nota menunggu TTD/OPB"
        />
        <NotaSearchSelect
          label="Nota sedang berjalan"
          items={notaJalan}
          value={targetId}
          onChange={setTargetId}
          detailOf={(t) => t.warna}
          placeholder="Cari no. nota, plat, warna…"
          emptyHint="Belum ada nota draft atau menunggu TTD"
        />
        <button type="button" data-no-toast onClick={handleGabung} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
          Gabung Nota
        </button>
      </div>

      {hasil && <HasilGabungModal sumber={hasil.sumber} tujuan={hasil.tujuan} onClose={() => setHasil(null)} />}
    </div>
  );
}

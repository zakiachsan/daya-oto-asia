"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, FileCheck2, Printer, Send, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { RekapInvoicePreview, downloadRekapInvoicePreview, printRekapInvoicePreview } from "@/components/ui/rekap-invoice-preview";
import { FakturPenjualanPreview, downloadFakturPenjualanPreview, printFakturPenjualanPreview } from "@/components/ui/faktur-penjualan-preview";
import { formatIDR } from "@/lib/mock-data";
import { findOpbForFaktur, fakturFromSlug, fakturSiapKirim, fakturStatusView } from "@/lib/faktur-utils";
import { formatTanggalOpb } from "@/lib/opb-utils";
import { noInvoiceDoa } from "@/lib/invoice-doa-utils";
import { REKAP_PPN_RATE, buildRekapInvoiceLines, notaForOpb, rekapInvoiceTotals } from "@/lib/rekap-invoice-utils";
import { useFakturJual, useHutangPiutang, useJurnalList, useOpbList, useTransaksiList } from "@/lib/preview-store";
import { ensurePiutangFromFaktur, piutangForFaktur } from "@/lib/finance-payment-utils";
import { postWithJurnal } from "@/lib/jurnal-post-utils";
import { jurnalSlug } from "@/lib/jurnal-utils";
import { hutangSlug } from "@/lib/hutang-piutang-utils";
import { useToast } from "@/components/ui/toast";

const METODE_KIRIM = ["Email", "WhatsApp", "Kurir", "Cetak/Manual"];

export default function FakturPenjualanDetailPage() {
  const params = useParams();
  const id = fakturFromSlug(String(params.id));
  const { toast } = useToast();
  const { all, update } = useFakturJual();
  const { items: hutangItems, replaceAll } = useHutangPiutang();
  const { all: jurnalList, add: addJurnal } = useJurnalList();
  const { items: opbList } = useOpbList();
  const { all: transaksi } = useTransaksiList();
  const faktur = all.find((f) => f.id.toLowerCase() === id.toLowerCase());

  const [openRekon, setOpenRekon] = useState(false);
  const [catatanRekon, setCatatanRekon] = useState("");
  const [tanggalKirim, setTanggalKirim] = useState(new Date().toISOString().slice(0, 10));
  const [metode, setMetode] = useState(METODE_KIRIM[0]);
  const [catatanKirim, setCatatanKirim] = useState("");

  if (!faktur) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">Faktur tidak ditemukan</p>
        <Link href="/finance/penjualan/faktur-penjualan" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = faktur;
  const opb = findOpbForFaktur(row, opbList);
  const piutang = piutangForFaktur(hutangItems, row);
  const statusView = fakturStatusView(row, piutang);

  /* Angka dokumen: DPP dari rincian nota OPB, PPN 11% di atasnya */
  const lines = opb ? buildRekapInvoiceLines(opb, transaksi) : [];
  const totals = lines.length ? rekapInvoiceTotals(lines) : null;
  const dpp = totals ? totals.totalHarga : row.total;
  const totalDokumen = totals ? totals.totalPpn : dpp + Math.round(dpp * REKAP_PPN_RATE);
  const ppn = totalDokumen - dpp;

  /* Rekonsiliasi: OPB yang sudah terbit vs nota yang benar-benar ter-link */
  const nota = opb ? notaForOpb(opb, transaksi) : [];
  const totalNota = nota.reduce((s, t) => s + t.total, 0);
  const selisih = opb ? opb.total - totalNota : 0;
  const siapKirim = fakturSiapKirim(row);

  function handlePost() {
    const posted = { ...row, status: "Posted" as const };
    const jurnalId = postWithJurnal("faktur-jual", posted, { jurnalList, addJurnal });
    update(row.id, { status: "Posted", jurnalId });
    replaceAll(ensurePiutangFromFaktur(hutangItems, posted));
    toast(`Faktur ${row.id} di-posting · jurnal ${jurnalId}`, "success");
  }

  function simpanRekonsiliasi() {
    if (!opb) return;
    if (selisih !== 0 && !catatanRekon.trim()) {
      toast(`Selisih ${formatIDR(Math.abs(selisih))} — isi catatan alasan dulu`, "error");
      return;
    }
    update(row.id, {
      rekonsiliasi: {
        oleh: "Tim Finance",
        waktu: new Date().toISOString(),
        totalInvoice: row.total,
        totalOpb: opb.total,
        jumlahNota: nota.length,
        selisih,
        catatan: catatanRekon.trim() || undefined,
      },
    });
    setCatatanRekon("");
    setOpenRekon(false);
    toast(
      selisih === 0
        ? `Invoice ${row.id} direkonsiliasi dengan ${opb.id} · match`
        : `Invoice ${row.id} direkonsiliasi dengan ${opb.id} · selisih ${formatIDR(Math.abs(selisih))} tercatat`,
      "success",
    );
  }

  function kirimInvoice() {
    update(row.id, {
      status: "Terkirim",
      kirim: { tanggal: tanggalKirim, metode, catatan: catatanKirim.trim() || undefined, oleh: "Tim Finance" },
    });
    setCatatanKirim("");
    toast(`Invoice ${row.id} dikirim via ${metode} · status Terkirim`, "success");
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.pelanggan} · ${row.periode}`}
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Faktur Penjualan", href: "/finance/penjualan/faktur-penjualan" },
          { label: row.id },
        ]}
        actions={<StatusBadge status={statusView} />}
      />

      <Link href="/finance/penjualan/faktur-penjualan" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan Faktur</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Pelanggan</span><span className="font-semibold">{row.pelanggan}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Periode OPB</span><span>{row.periode}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Jenis dokumen</span><span>{row.jenis ?? "Faktur Penjualan"}</span>
          <div className="flex justify-between"><span className="text-slds-text-weak">No. Invoice (DOA)</span><span className="font-mono">{noInvoiceDoa(row)}</span></div></div>
          {opb && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Ref. OPB</span>
              <Link href={`/operasional/opb/${opb.id}`} className="font-mono font-semibold text-brand hover:underline">{opb.id}</Link>
            </div>
          )}
          <div className="flex justify-between"><span className="text-slds-text-weak">Jumlah Nota</span><span>{opb ? `${opb.jumlahTrx} nota` : "-"}</span></div>
          <div className="flex justify-between pt-2 border-t border-slds-border"><span className="text-slds-text-weak">DPP</span><span>{formatIDR(dpp)}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">PPN 11%</span><span>{formatIDR(ppn)}</span></div>
          <div className="flex justify-between font-bold"><span>Total Tagihan</span><span className="text-brand">{formatIDR(totalDokumen)}</span></div>

          {piutang && (
            <div className="pt-2 border-t border-slds-border space-y-1">
              <div className="flex justify-between"><span className="text-slds-text-weak">Kartu piutang</span>
                <Link href={`/finance/laporan/hutang-piutang/${hutangSlug(piutang.pihak)}`} className="font-mono font-semibold text-brand hover:underline">{piutang.id}</Link>
              </div>
              <div className="flex justify-between"><span className="text-slds-text-weak">Sisa tagihan</span><span>{formatIDR(piutang.sisa)}</span></div>
            </div>
          )}

          <div className="pt-3 border-t border-slds-border space-y-2">
            {row.status === "Draft" && (
              <button type="button" data-no-toast onClick={handlePost} className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
                <Send className="h-3.5 w-3.5" /> Post Faktur
              </button>
            )}
            {(row.status === "Posted" || row.status === "Terkirim") && (
              <Link
                href={`/finance/penjualan/penerimaan-penjualan?faktur=${encodeURIComponent(row.id)}`}
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-[12px] font-semibold hover:bg-green-700"
              >
                Catat Penerimaan
              </Link>
            )}
            {opb && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" data-no-toast onClick={() => { printFakturPenjualanPreview(row.id); toast("Invoice dicetak (format DOA)", "success"); }} className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
                    <Printer className="h-3.5 w-3.5" /> Cetak Invoice
                  </button>
                  <button type="button" data-no-toast onClick={() => { const ok = downloadFakturPenjualanPreview(row.id); toast(ok ? "Invoice diunduh (HTML)" : "Gagal mengunduh", ok ? "success" : "error"); }} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg">
                    <Download className="h-3.5 w-3.5" /> Unduh Invoice
                  </button>
                  <button type="button" data-no-toast onClick={() => { printRekapInvoicePreview(); toast("Rekap lampiran dicetak", "success"); }} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg">
                    <Printer className="h-3.5 w-3.5" /> Cetak Rekap
                  </button>
                  <button type="button" data-no-toast onClick={() => { const ok = downloadRekapInvoicePreview(row.id); toast(ok ? "Rekap diunduh (HTML)" : "Gagal mengunduh", ok ? "success" : "error"); }} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg">
                    <Download className="h-3.5 w-3.5" /> Unduh Rekap
                  </button>
                </div>
                <p className="text-[11px] text-slds-text-weak">Dua dokumen cetak: Invoice (format DOA, No. DOA.xxx.MM.YY) + lampiran Rekap (#56/#57).</p>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Timeline Penagihan</h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Generate dari OPB</span>
              <span className="text-green-700 font-semibold">✓ {row.tanggal}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Dokumen cetak (Faktur + Rekap)</span>
              <span>{opb ? "✓ 2 dokumen siap" : "-"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Rekonsiliasi vs OPB {opb ? `(${opb.id})` : ""}</span>
              <span className={row.rekonsiliasi ? "text-green-700 font-semibold" : "text-amber-700"}>
                {row.rekonsiliasi
                  ? `✓ ${row.rekonsiliasi.waktu.slice(0, 10)} · ${row.rekonsiliasi.selisih === 0 ? "match" : `selisih ${formatIDR(Math.abs(row.rekonsiliasi.selisih))}`}`
                  : "Belum"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Posting ke AR</span>
              <span className={row.status !== "Draft" ? "text-green-700 font-semibold" : "text-amber-700"}>
                {row.status !== "Draft" ? "✓ Posted" : "Draft"}
              </span>
            </div>
            {row.jurnalId && (
              <div className="flex justify-between py-1.5 border-b border-slds-border">
                <span className="text-slds-text-weak">Jurnal</span>
                <Link href={`/finance/buku-besar/jurnal-umum/${jurnalSlug(row.jurnalId)}`} className="font-mono font-semibold text-brand hover:underline">
                  {row.jurnalId}
                </Link>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-slds-border">
              <span className="text-slds-text-weak">Kirim Invoice</span>
              <span className={row.kirim ? "text-green-700 font-semibold" : "text-amber-700"}>
                {row.kirim ? `✓ ${row.kirim.tanggal} · ${row.kirim.metode}` : "Belum"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slds-text-weak">Status Lunas</span>
              <span className={piutang && piutang.sisa <= 0 ? "text-green-700 font-semibold" : "text-amber-700"}>
                {piutang ? (piutang.sisa <= 0 ? "✓ Lunas" : `Sisa ${formatIDR(piutang.sisa)}`) : "Belum ada piutang"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {opb && (
        <div className="bg-white border border-slds-border rounded-lg p-4 mb-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-2 flex items-center gap-1.5">
            <FileCheck2 className="h-4 w-4" /> Rekonsiliasi dengan OPB {opb.id}
            <span className="ml-2 text-[11px] font-normal text-slds-text-weak">OPB terbit {formatTanggalOpb(opb.tanggalOpb)} · {opb.periode}</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-[13px] mb-3">
            <div className="border border-slds-border rounded-md p-3">
              <p className="text-[11px] uppercase font-semibold text-slds-text-weak">Jumlah Nota</p>
              <p className="font-bold text-[15px]">{opb.jumlahTrx} <span className="text-[12px] font-normal text-slds-text-weak">di OPB</span></p>
              <p className="text-[11px] text-slds-text-weak">{nota.length} nota ter-link</p>
            </div>
            <div className="border border-slds-border rounded-md p-3">
              <p className="text-[11px] uppercase font-semibold text-slds-text-weak">Total OPB</p>
              <p className="font-bold text-[15px]">{formatIDR(opb.total)}</p>
            </div>
            <div className="border border-slds-border rounded-md p-3">
              <p className="text-[11px] uppercase font-semibold text-slds-text-weak">Total Nota Ter-link</p>
              <p className="font-bold text-[15px]">{formatIDR(totalNota)}</p>
            </div>
            <div className={`border rounded-md p-3 ${selisih === 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
              <p className="text-[11px] uppercase font-semibold text-slds-text-weak">Selisih (OPB − Nota)</p>
              <p className={`font-bold text-[15px] ${selisih === 0 ? "text-green-700" : "text-amber-700"}`}>
                {selisih === 0 ? "Match" : formatIDR(Math.abs(selisih))}
              </p>
              {selisih !== 0 && <p className="text-[11px] text-amber-700">{selisih > 0 ? "nota kurang dari OPB" : "nota lebih dari OPB"}</p>}
            </div>
          </div>

          {row.rekonsiliasi && !openRekon ? (
            <div className="text-[13px] border border-sky-200 bg-sky-50 rounded-md p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sky-800">Terekonsiliasi oleh {row.rekonsiliasi.oleh}</p>
                  <p className="text-[11px] text-slds-text-weak">
                    {row.rekonsiliasi.waktu.slice(0, 16).replace("T", " ")} · invoice {formatIDR(row.rekonsiliasi.totalInvoice)} vs OPB {formatIDR(row.rekonsiliasi.totalOpb)} · {row.rekonsiliasi.jumlahNota} nota
                  </p>
                  {row.rekonsiliasi.catatan && <p className="text-[11px] mt-1">Catatan: {row.rekonsiliasi.catatan}</p>}
                </div>
                <button type="button" data-no-toast onClick={() => setOpenRekon(true)} className="px-3 py-1.5 border border-slds-border rounded-md text-[12px] font-semibold bg-white">
                  Rekonsiliasi Ulang
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {selisih !== 0 && (
                <textarea
                  value={catatanRekon}
                  onChange={(e) => setCatatanRekon(e.target.value)}
                  rows={2}
                  placeholder="Alasan selisih (wajib kalau tidak match) · mis. 2 nota belum masuk OPB, menunggu koreksi cabang"
                  className="w-full px-3 py-2 border border-slds-border rounded-md text-[13px]"
                />
              )}
              <div className="flex gap-2">
                <button type="button" data-no-toast onClick={simpanRekonsiliasi} className="inline-flex items-center gap-1 px-3 py-2 bg-brand text-white rounded-md text-[12px] font-semibold">
                  <FileCheck2 className="h-3.5 w-3.5" /> Tandai Terekonsiliasi
                </button>
                {openRekon && (
                  <button type="button" data-no-toast onClick={() => { setOpenRekon(false); setCatatanRekon(""); }} className="px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold">
                    Batal
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {row.status !== "Draft" && (
        <div className="bg-white border border-slds-border rounded-lg p-4 mb-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-2 flex items-center gap-1.5">
            <Truck className="h-4 w-4" /> Kirim Invoice ke Pelanggan
          </h3>
          {row.kirim ? (
            <div className="text-[13px]">
              <p>
                Terkirim <strong>{row.kirim.tanggal}</strong> via <strong>{row.kirim.metode}</strong> oleh {row.kirim.oleh}.
              </p>
              {row.kirim.catatan && <p className="text-[12px] text-slds-text-weak mt-1">Catatan: {row.kirim.catatan}</p>}
            </div>
          ) : siapKirim ? (
            <div className="flex flex-wrap items-end gap-3">
              <label className="block text-[12px]">
                <span className="text-[11px] text-slds-text-weak uppercase font-semibold">Tanggal Kirim</span>
                <input type="date" value={tanggalKirim} onChange={(e) => setTanggalKirim(e.target.value)} className="block mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px]" />
              </label>
              <label className="block text-[12px]">
                <span className="text-[11px] text-slds-text-weak uppercase font-semibold">Metode</span>
                <select value={metode} onChange={(e) => setMetode(e.target.value)} className="block mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
                  {METODE_KIRIM.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label className="block text-[12px] flex-1 min-w-[220px]">
                <span className="text-[11px] text-slds-text-weak uppercase font-semibold">Catatan</span>
                <input value={catatanKirim} onChange={(e) => setCatatanKirim(e.target.value)} placeholder="No. resi / penerima / cc email" className="block mt-1 w-full px-3 py-2 border border-slds-border rounded-md text-[13px]" />
              </label>
              <button type="button" data-no-toast onClick={kirimInvoice} className="inline-flex items-center gap-1 px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold">
                <Truck className="h-4 w-4" /> Kirim Invoice
              </button>
            </div>
          ) : (
            <p className="text-[12px] text-amber-700">
              Invoice bisa dikirim setelah posting ke AR dan direkonsiliasi dengan OPB yang sudah terbit.
            </p>
          )}
        </div>
      )}

      {opb && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <h3 className="text-[13px] font-bold text-slds-text mb-2">Dokumen Cetak · Invoice (format DOA)</h3>
            <FakturPenjualanPreview faktur={row} opb={opb} transaksi={transaksi} />
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-[13px] font-bold text-slds-text mb-2">Lampiran · Rekap Order Pembelian Bahan</h3>
            <RekapInvoicePreview opb={opb} transaksi={transaksi} invoiceId={row.id} />
          </div>
        </div>
      )}
    </div>
  );
}

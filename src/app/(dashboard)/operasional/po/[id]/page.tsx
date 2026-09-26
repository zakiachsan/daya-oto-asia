"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, FileText, Package, Plus, RotateCcw } from "lucide-react";
import { printElementById } from "@/lib/print-doc-utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { FinanceLinkBadge } from "@/components/finance/finance-link-badge";
import {
  PO_RETUR_ALASAN,
  calcReceivedTotal,
  deriveReceiveStatus,
  type PoLine,
  type PoReturLine,
} from "@/lib/po-utils";
import { useFakturBeli, useFinancePayments, useHutangPiutang, useInventoriStok, usePoList } from "@/lib/preview-store";
import { buildFakturBeliFromPo, fakturBeliForPo, getPoFinanceStatus } from "@/lib/ops-finance-bridge";
import { useToast } from "@/components/ui/toast";

type ReceiveDraft = Record<string, { checked: boolean; qty: number }>;

function initReceiveDraft(lines: PoLine[]): ReceiveDraft {
  return Object.fromEntries(
    lines.map((l) => [
      l.kode,
      {
        checked: (l.qtyReceived ?? 0) > 0,
        qty: l.qtyReceived ?? l.qty,
      },
    ]),
  );
}

export default function PoDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, update } = usePoList();
  const { addManual } = useInventoriStok();
  const { all: fakturBeli, add: addFaktur } = useFakturBeli();
  const { items: hutang } = useHutangPiutang();
  const { items: payments } = useFinancePayments();
  const found = items.find((r) => r.id === id);

  const [receiveDraft, setReceiveDraft] = useState<ReceiveDraft | null>(null);
  const [returs, setReturs] = useState<PoReturLine[]>([]);
  const [showReturForm, setShowReturForm] = useState(false);
  const [returKode, setReturKode] = useState("");
  const [returQty, setReturQty] = useState(1);
  const [returAlasan, setReturAlasan] = useState<string>(PO_RETUR_ALASAN[0]);

  const draft = receiveDraft ?? (found ? initReceiveDraft(found.lines) : {});

  const previewLines: PoLine[] = found
    ? found.lines.map((l) => ({
        ...l,
        qtyReceived: draft[l.kode]?.checked ? Math.min(draft[l.kode].qty, l.qty) : 0,
      }))
    : [];

  const previewTotal = calcReceivedTotal(previewLines);
  const previewReceiveStatus = deriveReceiveStatus(previewLines);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">PO tidak ditemukan</p>
        <Link href="/operasional/po" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;
  const faktur = fakturBeliForPo(row.id, fakturBeli);
  const financeStatus = getPoFinanceStatus(row.id, fakturBeli, hutang, payments);
  const poStatusLabel =
    row.receiveStatus === "partial" ? "Partial" : row.receiveStatus === "complete" ? "Selesai" : row.status;

  function toggleLine(kode: string, checked: boolean) {
    setReceiveDraft((prev) => {
      const base = prev ?? initReceiveDraft(row.lines);
      const line = row.lines.find((l) => l.kode === kode);
      return {
        ...base,
        [kode]: { checked, qty: base[kode]?.qty ?? line?.qty ?? 1 },
      };
    });
  }

  function setLineQty(kode: string, qty: number) {
    setReceiveDraft((prev) => {
      const base = prev ?? initReceiveDraft(row.lines);
      return {
        ...base,
        [kode]: { ...base[kode], checked: true, qty: Math.max(0, qty) },
      };
    });
  }

  function addReturLine() {
    const line = row.lines.find((l) => l.kode === returKode);
    if (!line) return;
    setReturs((prev) => [
      ...prev,
      { kode: line.kode, nama: line.nama, qty: returQty, alasan: returAlasan },
    ]);
    setShowReturForm(false);
    setReturQty(1);
  }

  function handleProsesPenerimaan() {
    const receivedLines = previewLines.filter((l) => (l.qtyReceived ?? 0) > 0);
    if (receivedLines.length === 0) {
      toast("Centang minimal 1 item yang diterima", "error");
      return;
    }

    const grId = row.gr || row.id.replace("PO", "GR");
    const receiveStatus = deriveReceiveStatus(previewLines);
    const receivedTotal = calcReceivedTotal(previewLines);
    const status = receiveStatus === "complete" ? "Selesai" : "Partial";

    update(row.id, {
      lines: previewLines,
      gr: grId,
      status,
      receiveStatus,
      receivedTotal,
      returs: [...(row.returs ?? []), ...returs],
    });

    for (const l of receivedLines) {
      addManual({
        kodeProduk: l.kode,
        cabang: "Pusat",
        kaleng: l.qtyReceived ?? 0,
        gram: 0,
        keterangan: `Penerimaan ${grId} dari ${row.supplier}`,
        oleh: "Admin Gudang",
      });
    }

    if (!faktur) {
      addFaktur(buildFakturBeliFromPo(row, fakturBeli.length + 1, receivedTotal));
    }

    setReturs([]);
    setReceiveDraft(null);
    toast(
      `${grId} · ${receivedLines.length} item diterima (${formatIDR(receivedTotal)}). Stok pusat & faktur draft diupdate.`,
      "success",
    );
  }

  return (
    <div>
      <PageHeader
        title={row.id}
        desc={`${row.supplier} · ${row.tanggal}`}
        breadcrumb={[
          { label: "Operasional", href: "/operasional" },
          { label: "PO & Penerimaan", href: "/operasional/po" },
          { label: row.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => {
                printElementById("po-doc-print", `PO ${row.id}`);
                toast("Dokumen PO + TTD Management (preview)", "success");
              }}
              className="inline-flex items-center gap-1 px-3 py-2 border border-slds-border rounded-md text-[12px] font-semibold hover:bg-slds-bg"
            >
              <FileText className="h-3.5 w-3.5" /> Generate / Cetak PO
            </button>
            <StatusBadge status={poStatusLabel} />
          </div>
        }
      />

      <Link href="/operasional/po" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div id="po-doc-print" className="mb-4 bg-white border border-slds-border rounded-lg p-6 max-w-2xl hidden print:block">
        <h2 className="text-lg font-bold text-center">PESANAN PEMBELIAN</h2>
        <p className="text-center text-[12px] text-slds-text-weak">PT Daya Oto Asia · TTD Management</p>
        <p className="mt-3 text-[13px]"><strong>No:</strong> {row.id} · <strong>Supplier:</strong> {row.supplier}</p>
        <p className="text-[13px]"><strong>Total:</strong> {formatIDR(row.total)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan PO</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Supplier</span><span className="font-semibold text-right max-w-[60%]">{row.supplier}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Total PO</span><span className="font-bold">{formatIDR(row.total)}</span></div>
          {row.receivedTotal != null && (
            <div className="flex justify-between"><span className="text-slds-text-weak">Nilai Diterima</span><span className="font-bold text-green-700">{formatIDR(row.receivedTotal)}</span></div>
          )}
          {row.gr && (
            <div className="flex justify-between"><span className="text-slds-text-weak">Goods Received</span><span className="font-mono font-semibold text-green-700">{row.gr}</span></div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slds-border">
            <span className="text-slds-text-weak">Finance</span>
            <FinanceLinkBadge
              status={financeStatus}
              href={faktur ? "/finance/pembelian/faktur-pembelian" : row.gr ? "/finance/pembelian/faktur-pembelian" : undefined}
            />
          </div>
          {faktur && (
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Faktur Pembelian</span>
              <Link href="/finance/pembelian/faktur-pembelian" className="font-mono font-semibold text-brand hover:underline">{faktur.id}</Link>
            </div>
          )}
          {row.catatan && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan PO</p>
              <p className="text-[12px]">{row.catatan}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-1 flex items-center gap-2">
              <Package className="h-4 w-4" /> Penerimaan Barang (Partial OK)
            </h3>
            <p className="text-[11px] text-slds-text-weak mb-3">Centang item yang diterima · qty bisa kurang dari PO jika partial</p>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                  <th className="pb-2 w-10" />
                  <th className="pb-2">Produk</th>
                  <th className="pb-2 text-right">Order</th>
                  <th className="pb-2 text-right w-24">Terima</th>
                  <th className="pb-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {row.lines.map((l) => {
                  const d = draft[l.kode];
                  const qtyIn = d?.checked ? Math.min(d.qty, l.qty) : 0;
                  return (
                    <tr key={l.kode} className="border-b border-slds-border last:border-0">
                      <td className="py-2">
                        <input
                          type="checkbox"
                          checked={d?.checked ?? false}
                          disabled={!!row.gr}
                          onChange={(e) => toggleLine(l.kode, e.target.checked)}
                        />
                      </td>
                      <td className="py-2">
                        <p className="font-mono font-semibold">{l.kode}</p>
                        <p className="text-[11px] text-slds-text-weak truncate max-w-[200px]">{l.nama}</p>
                      </td>
                      <td className="py-2 text-right">{l.qty}</td>
                      <td className="py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          max={l.qty}
                          value={d?.qty ?? l.qty}
                          disabled={!d?.checked || !!row.gr}
                          onChange={(e) => setLineQty(l.kode, Number(e.target.value) || 0)}
                          className="w-16 px-1.5 py-1 border border-slds-border rounded text-right text-[12px]"
                        />
                      </td>
                      <td className="py-2 text-right font-semibold">{formatIDR(qtyIn * l.harga)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={4} className="pt-3 text-right text-slds-text-weak">Preview nilai terima</td>
                  <td className="pt-3 text-right text-brand">{formatIDR(previewTotal)}</td>
                </tr>
              </tfoot>
            </table>

            {!row.gr ? (
              <button
                type="button"
                data-no-toast
                onClick={handleProsesPenerimaan}
                className="w-full mt-4 inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-green-600 text-white rounded-md text-[12px] font-semibold"
              >
                <Package className="h-3.5 w-3.5" /> Proses Penerimaan → Stok + Faktur
              </button>
            ) : (
              <p className="mt-3 text-[12px] text-green-700 font-semibold">
                ✓ Penerimaan tercatat · status {row.receiveStatus ?? previewReceiveStatus}
                {row.receiveStatus === "partial" && " (sebagian item / qty)"}
              </p>
            )}
          </div>

          <div className="bg-white border border-slds-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[13px] font-bold text-slds-text flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-red-500" /> Retur Barang
              </h3>
              {!showReturForm && (
                <button type="button" data-no-toast onClick={() => { setReturKode(row.lines[0]?.kode ?? ""); setShowReturForm(true); }} className="text-[12px] font-semibold text-brand flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Tambah Retur
                </button>
              )}
            </div>
            <p className="text-[11px] text-slds-text-weak mb-3">Barang rusak/tumpah saat pengiriman · tidak masuk stok</p>

            {showReturForm && (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3 p-3 bg-white border border-red-200 rounded-lg">
                <select value={returKode} onChange={(e) => setReturKode(e.target.value)} className="px-2 py-2 border border-slds-border rounded text-[12px] bg-white sm:col-span-2">
                  {row.lines.map((l) => (
                    <option key={l.kode} value={l.kode}>
                      {l.kode} · {l.nama.length > 48 ? `${l.nama.slice(0, 48)}…` : l.nama}
                    </option>
                  ))}
                </select>
                <input type="number" min={1} value={returQty} onChange={(e) => setReturQty(Number(e.target.value) || 1)} className="px-2 py-2 border border-slds-border rounded text-[12px] bg-white" placeholder="Qty" />
                <select value={returAlasan} onChange={(e) => setReturAlasan(e.target.value)} className="px-2 py-2 border border-slds-border rounded text-[12px] bg-white sm:col-span-2">
                  {PO_RETUR_ALASAN.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <div className="sm:col-span-5 flex gap-2">
                  <button type="button" data-no-toast onClick={addReturLine} className="px-3 py-1.5 bg-red-600 text-white rounded text-[12px] font-semibold">Simpan Retur</button>
                  <button type="button" data-no-toast onClick={() => setShowReturForm(false)} className="px-3 py-1.5 border border-slds-border rounded text-[12px]">Batal</button>
                </div>
              </div>
            )}

            {[...(row.returs ?? []), ...returs].length === 0 ? (
              <p className="text-[12px] text-slds-text-weak">Belum ada retur</p>
            ) : (
              <ul className="space-y-2">
                {[...(row.returs ?? []), ...returs].map((r, i) => (
                  <li key={`${r.kode}-${i}`} className="flex justify-between gap-3 text-[12px] py-2 border-b border-slds-border last:border-0">
                    <div className="min-w-0 flex-1">
                      <p>
                        <span className="font-mono font-bold">{r.kode}</span>
                        <span className="text-slds-text-weak"> × {r.qty}</span>
                      </p>
                      <p className="text-[11px] text-slds-text-weak truncate mt-0.5">{r.nama}</p>
                    </div>
                    <span className="text-red-600 shrink-0 text-right max-w-[45%]">{r.alasan}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

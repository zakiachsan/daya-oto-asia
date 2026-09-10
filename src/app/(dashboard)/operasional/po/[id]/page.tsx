"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIDR } from "@/lib/mock-data";
import { usePoList } from "@/lib/preview-store";
import { useToast } from "@/components/ui/toast";

export default function PoDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { toast } = useToast();
  const { items, update } = usePoList();
  const found = items.find((r) => r.id === id);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-slds-text-weak">PO tidak ditemukan</p>
        <Link href="/operasional/po" className="text-brand text-[13px] font-semibold mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const row = found;

  function handleTerimaBarang() {
    const grId = row.id.replace("PO", "GR");
    update(row.id, { status: "Selesai", gr: grId });
    toast(`Barang diterima — ${grId}`, "success");
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
        actions={<StatusBadge status={row.status} />}
      />

      <Link href="/operasional/po" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-white border border-slds-border rounded-lg p-4 space-y-2 text-[13px]">
          <h3 className="text-[13px] font-bold text-slds-text mb-2">Ringkasan PO</h3>
          <div className="flex justify-between"><span className="text-slds-text-weak">Supplier</span><span className="font-semibold">{row.supplier}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Tanggal</span><span>{row.tanggal}</span></div>
          <div className="flex justify-between"><span className="text-slds-text-weak">Items</span><span>{row.items} produk</span></div>
          <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
            <span>Total</span><span className="text-brand">{formatIDR(row.total)}</span>
          </div>
          {row.gr && (
            <div className="flex justify-between"><span className="text-slds-text-weak">Goods Received</span><span className="font-mono font-semibold text-green-700">{row.gr}</span></div>
          )}
          {row.catatan && (
            <div className="pt-2 border-t border-slds-border">
              <p className="text-[11px] text-slds-text-weak uppercase font-semibold mb-1">Catatan</p>
              <p className="text-[12px]">{row.catatan}</p>
            </div>
          )}
          {!row.gr && row.status !== "Selesai" && (
            <button type="button" data-no-toast onClick={handleTerimaBarang} className="w-full mt-3 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-[12px] font-semibold">
              <Package className="h-3.5 w-3.5" /> Konfirmasi Terima Barang
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Item Purchase Order</h3>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak">
                <th className="pb-2 font-semibold">Kode</th>
                <th className="pb-2 font-semibold">Produk</th>
                <th className="pb-2 font-semibold text-right">Qty</th>
                <th className="pb-2 font-semibold text-right">Harga/kaleng</th>
                <th className="pb-2 font-semibold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {row.lines.map((l) => (
                <tr key={l.kode} className="border-b border-slds-border last:border-0">
                  <td className="py-2 font-mono font-semibold">{l.kode}</td>
                  <td className="py-2 text-slds-text-weak">{l.nama}</td>
                  <td className="py-2 text-right">{l.qty}</td>
                  <td className="py-2 text-right">{formatIDR(l.harga)}</td>
                  <td className="py-2 text-right font-semibold">{formatIDR(l.qty * l.harga)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="pt-3" colSpan={4}>Total PO</td>
                <td className="pt-3 text-right text-brand">{formatIDR(row.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

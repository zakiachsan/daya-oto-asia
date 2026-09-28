"use client";

import { formatIDR } from "@/lib/mock-data";
import { formatTanggalPo, type PoDetail } from "@/lib/po-utils";
import { printElementById, downloadElementById } from "@/lib/print-doc-utils";

type PoPreviewProps = {
  po: PoDetail;
  className?: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className="field-colon">:</span>
      <span className="field-value">{value}</span>
    </div>
  );
}

/** Dokumen Purchase Order ke supplier · blok TTD wajib (disetujui Management) */
export function PoPreview({ po, className = "" }: PoPreviewProps) {
  const lines = po.lines ?? [];
  const total = lines.reduce((s, l) => s + l.qty * l.harga, 0) || po.total;

  return (
    <div className={`doc bg-white text-black ${className}`} id="po-preview">
      <p className="doc-center doc-bold doc-upper" style={{ fontSize: "13pt", marginBottom: 2 }}>
        Pesanan Pembelian
      </p>
      <p className="doc-center doc-bold" style={{ fontSize: "11pt", marginBottom: 10 }}>PT. DAYA OTO ASIA</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 12 }}>
        <Field label="No. PO" value={po.id} />
        <Field label="Tanggal PO" value={formatTanggalPo(po.tanggal)} />
        <Field label="Supplier" value={po.supplier} />
        <Field label="Status" value={po.status} />
        <Field label="Jumlah Item" value={`${lines.length || po.items} item`} />
        <Field label="Total PO" value={formatIDR(total)} />
        {po.gr && <Field label="Goods Received" value={po.gr} />}
        {po.receivedTotal != null && <Field label="Nilai Diterima" value={formatIDR(po.receivedTotal)} />}
      </div>

      <table className="doc-table" style={{ fontSize: "8pt", marginBottom: 10 }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>No</th>
            <th style={{ width: "15%" }}>Kode</th>
            <th>Nama Barang</th>
            <th style={{ textAlign: "right", width: "8%" }}>Qty</th>
            <th style={{ textAlign: "right", width: "16%" }}>Harga Satuan</th>
            <th style={{ textAlign: "right", width: "16%" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", fontStyle: "italic" }}>Belum ada item</td>
            </tr>
          ) : (
            lines.map((l, i) => (
              <tr key={`${l.kode}-${i}`}>
                <td className="doc-center">{i + 1}</td>
                <td style={{ fontFamily: "monospace" }}>{l.kode}</td>
                <td>{l.nama}</td>
                <td style={{ textAlign: "right" }}>{l.qty}</td>
                <td style={{ textAlign: "right" }}>{formatIDR(l.harga)}</td>
                <td style={{ textAlign: "right" }}>{formatIDR(l.qty * l.harga)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="doc-bold">
            <td colSpan={5} style={{ textAlign: "right" }}>TOTAL PO</td>
            <td style={{ textAlign: "right" }}>{formatIDR(total)}</td>
          </tr>
        </tfoot>
      </table>

      {po.catatan && (
        <p style={{ fontSize: "8pt", marginBottom: 6 }}>
          <strong>Catatan:</strong> {po.catatan}
        </p>
      )}

      <p style={{ fontSize: "8pt", marginBottom: 8 }}>
        Barang dikirim ke Gudang Pusat PT. Daya Oto Asia. Dokumen ini sah setelah ditandatangani Management.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: "9pt" }}>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Dibuat oleh,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Admin Gudang )</p>
          <p style={{ textAlign: "center", fontSize: "8pt" }}>Tanggal: ................</p>
        </div>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Diperiksa oleh,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Kepala Gudang )</p>
          <p style={{ textAlign: "center", fontSize: "8pt" }}>Tanggal: ................</p>
        </div>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Disetujui oleh,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Management )</p>
          <p style={{ textAlign: "center", fontSize: "8pt" }}>Tanggal: ................</p>
        </div>
      </div>

      <div className="footer-alamat">
        <p>PT. DAYA OTO ASIA · Purchase Order Bahan Cat Body Repair</p>
      </div>
    </div>
  );
}

export function printPoPreview() {
  printElementById("po-preview", "Purchase Order", "table.doc-table { font-size: 7.5pt; }");
}

/** Unduh dokumen PO jadi file HTML (bisa dibuka, lalu Save as PDF dari browser) */
export function downloadPoPreview(poId: string) {
  return downloadElementById(
    "po-preview",
    `${poId}.html`,
    `Purchase Order ${poId}`,
    "table.doc-table { font-size: 7.5pt; }",
  );
}

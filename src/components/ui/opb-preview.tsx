"use client";

import { formatIDR, type OpbRow, type TransaksiRow } from "@/lib/mock-data";
import { gramToLiter } from "@/lib/formula-utils";
import { notaNoFromTrxId } from "@/lib/nota-bogor-tarif";
import { printElementById } from "@/lib/print-doc-utils";

type OpbPreviewProps = {
  opb: OpbRow;
  transaksi: TransaksiRow[];
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

/** Rekap OPB bulanan internal — bukan formulir SAP Astra per transaksi */
export function OpbPreview({ opb, transaksi, className = "" }: OpbPreviewProps) {
  const linked = transaksi.filter(
    (t) => t.opbId === opb.id || (t.cabang.includes(opb.cabang.split(" ")[0]) && t.status === "Selesai"),
  );

  const displayTrx =
    linked.length > 0
      ? linked.slice(0, opb.jumlahTrx)
      : transaksi.filter((t) => t.cabang.includes(opb.cabang.split(" ")[0]) && t.status === "Selesai").slice(0, opb.jumlahTrx);

  const rows = displayTrx.length > 0 ? displayTrx : [];

  return (
    <div className={`doc bg-white text-black ${className}`} id="opb-preview">
      <p className="doc-center doc-bold doc-upper" style={{ fontSize: "13pt", marginBottom: 2 }}>
        REKAP OPB BULANAN
      </p>
      <p className="doc-center doc-bold" style={{ fontSize: "11pt", marginBottom: 10 }}>PT. DAYA OTO ASIA</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 12 }}>
        <Field label="No. OPB" value={opb.id} />
        <Field label="Periode Tagihan" value={opb.periode} />
        <Field label="Cabang / Bengkel Mitra" value={opb.cabang} />
        <Field label="Tanggal Cetak" value={new Date().toISOString().slice(0, 10)} />
        <Field label="Status" value={opb.status} />
        <Field label="Jumlah Transaksi" value={String(opb.jumlahTrx)} />
        {opb.sap && <Field label="No. SAP" value={opb.sap} />}
      </div>

      <table className="doc-table" style={{ fontSize: "8pt", marginBottom: 10 }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>No. Nota</th>
            <th>No. PKB</th>
            <th>No. Polisi</th>
            <th>Type Mobil</th>
            <th>Warna</th>
            <th style={{ textAlign: "right" }}>Pemakaian (L)</th>
            <th style={{ textAlign: "right" }}>Jumlah (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", fontStyle: "italic" }}>
                Belum ada transaksi ter-link
              </td>
            </tr>
          ) : (
            rows.map((t, i) => {
              const gram = t.bahan.reduce((s, b) => s + b.gram, 0);
              return (
                <tr key={t.id}>
                  <td className="doc-center">{i + 1}</td>
                  <td>{t.tanggal}</td>
                  <td style={{ fontFamily: "monospace" }}>{notaNoFromTrxId(t.id)}</td>
                  <td>{t.noPkb ?? "—"}</td>
                  <td>{t.platNomor}</td>
                  <td>{t.mobil}</td>
                  <td>{t.warna} ({t.kodeWarna})</td>
                  <td style={{ textAlign: "right" }}>{gramToLiter(gram)}</td>
                  <td style={{ textAlign: "right" }}>{formatIDR(t.total)}</td>
                </tr>
              );
            })
          )}
          {rows.length > 0 && rows.length < opb.jumlahTrx && (
            <tr>
              <td colSpan={9} style={{ fontStyle: "italic", fontSize: "8pt" }}>
                + {opb.jumlahTrx - rows.length} transaksi lainnya (lihat lampiran rekap admin)
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="doc-bold">
            <td colSpan={8} style={{ textAlign: "right" }}>TOTAL TAGIHAN OPB</td>
            <td style={{ textAlign: "right" }}>{formatIDR(opb.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p style={{ fontSize: "8pt", marginBottom: 8 }}>
        Rekap bulanan untuk rekonsiliasi HO. Formulir SAP Astra per PKB dicetak dari detail transaksi.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: "9pt" }}>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Yang Menyerahkan,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Admin Cabang )</p>
        </div>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Yang Menerima,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Supervisor HO )</p>
        </div>
        <div style={{ width: "30%" }}>
          <p className="doc-bold">Finance / SAP,</p>
          <div className="sig-line" />
          <p style={{ textAlign: "center" }}>( Input SAP )</p>
        </div>
      </div>

      <div className="footer-alamat">
        <p>PT. DAYA OTO ASIA — Rekap Order Pembelian Bahan Cat Body Repair</p>
      </div>
    </div>
  );
}

export function printOpbPreview() {
  printElementById("opb-preview", "OPB", "table.doc-table { font-size: 7.5pt; }");
}

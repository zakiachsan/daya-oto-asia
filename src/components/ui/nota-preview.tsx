"use client";

import { Fragment } from "react";
import type { TransaksiRow } from "@/lib/mock-data";
import { gramToLiter } from "@/lib/formula-utils";
import {
  NOTA_TARIF_BOGOR,
  formatHargaNota,
  formatRpJumlah,
  notaNoFromTrxId,
  tarifRowForKategori,
} from "@/lib/nota-bogor-tarif";
import { printElementById } from "@/lib/print-doc-utils";

type NotaPreviewProps = {
  trx: Pick<
    TransaksiRow,
    | "id"
    | "tanggal"
    | "cabang"
    | "warna"
    | "kodeWarna"
    | "kategori"
    | "mobil"
    | "platNomor"
    | "tinter"
    | "total"
    | "bahan"
    | "noPkb"
    | "jumlahPanel"
    | "noVendor"
  >;
  /** Nama bengkel penerima — referensi: PT. Astra Daihatsu Tbk - Cabang Bogor */
  kepada?: string;
  alamatKepada?: string;
  className?: string;
};

function UnderlineField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`nota-field ${wide ? "nota-field-wide" : ""}`}>
      <span className="nota-field-label">{label}</span>
      <span className="nota-field-colon">:</span>
      <span className="nota-field-value">{value}</span>
    </div>
  );
}

function DoaLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden className="nota-logo-svg">
      <path d="M4 4h14v28H4z" fill="#5b6a9e" />
      <path d="M18 4h14v14H18z" fill="#7b5ea8" />
      <path d="M18 18h14v14H18z" fill="#4a90c4" />
    </svg>
  );
}

/**
 * Layout nota DOA Cabang Bogor — clone struktur PDF hal. 1:
 * logo+header kiri, NOTA NO kanan, tabel 4 kolom (tarif di dalam tabel), TTD bawah.
 */
const ALAMAT_BOGOR =
  "Jl. KH. R. Abdullah Bin Nuh Jl. Yasmin Raya No.16, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113";

export function NotaPreview({
  trx,
  kepada,
  alamatKepada,
  className = "",
}: NotaPreviewProps) {
  const kepadaLabel = kepada ?? trx.cabang;
  const alamat =
    alamatKepada ??
    (kepadaLabel.toLowerCase().includes("bogor") ? ALAMAT_BOGOR : "");
  const notaNo = notaNoFromTrxId(trx.id);
  const totalGram = trx.bahan.reduce((s, b) => s + b.gram, 0);
  const totalLiter = gramToLiter(totalGram);
  const totalRp = trx.total;
  const activeTarif = tarifRowForKategori(trx.kategori);
  const pemakaianText = `${totalLiter} L`;

  const isActiveRow = (grup: string, label: string, harga: number) =>
    grup === activeTarif.grup && label === activeTarif.label && harga === activeTarif.harga;

  return (
    <div className={`nota-bogor ${className}`} id="nota-preview">
      <div className="nota-bogor-header">
        <div className="nota-bogor-left">
          <div className="nota-brand-row">
            <DoaLogo />
            <span className="nota-brand-name">PT. DAYA OTO ASIA</span>
          </div>
          <UnderlineField label="Kepada" value={kepadaLabel} wide />
          {alamat && <p className="nota-alamat-kepada">{alamat}</p>}
          <UnderlineField label="Lokasi" value={kepadaLabel} wide />
          <UnderlineField label="Type Mobil" value={trx.mobil} wide />
          <UnderlineField label="Warna" value={`${trx.warna} (${trx.kodeWarna})`} wide />
        </div>

        <div className="nota-bogor-right">
          <div className="nota-no-row">
            <span className="nota-no-label">NOTA NO.</span>
            <span>:</span>
            <span className="nota-no-value">{notaNo}</span>
          </div>
          <UnderlineField label="Tanggal" value={trx.tanggal} />
          <UnderlineField label="No. PKB" value={trx.noPkb ?? ""} />
          <UnderlineField label="No. Polisi" value={trx.platNomor} />
          <UnderlineField label="Jumlah Panel" value={trx.jumlahPanel != null ? String(trx.jumlahPanel) : ""} />
          <UnderlineField label="No. Vendor" value={trx.noVendor ?? ""} />
        </div>
      </div>

      <table className="nota-bogor-table">
        <thead>
          <tr>
            <th className="col-nama">Nama Material</th>
            <th className="col-pemakaian">Jumlah Pemakaian</th>
            <th className="col-harga">Harga</th>
            <th className="col-jumlah">Jumlah (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {NOTA_TARIF_BOGOR.map((grup) => (
            <Fragment key={grup.judul}>
              <tr className="nota-grup-row">
                <td colSpan={4}>{grup.judul}</td>
              </tr>
              {grup.baris.map((b) => {
                const active = isActiveRow(grup.judul, b.label, b.harga);
                return (
                  <tr key={`${grup.judul}-${b.label}`} className={active ? "nota-row-active" : ""}>
                    <td className="col-nama indent">{b.label}</td>
                    <td className="col-pemakaian center">{active ? pemakaianText : ""}</td>
                    <td className="col-harga center">{formatHargaNota(b.harga, b.satuan)}</td>
                    <td className="col-jumlah right">{active ? formatRpJumlah(totalRp) : ""}</td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
          <tr className="nota-total-row">
            <td className="col-nama">TOTAL</td>
            <td className="col-pemakaian" />
            <td className="col-harga">Harga</td>
            <td className="col-jumlah right">{formatRpJumlah(totalRp)}</td>
          </tr>
        </tbody>
      </table>

      <div className="nota-bogor-footer">
        <div className="nota-sig-block">
          <span className="nota-sig-label">Yang Menyerahkan,</span>
          <span className="nota-sig-paren">( {trx.tinter} )</span>
        </div>
        <div className="nota-sig-block">
          <span className="nota-sig-label">Yang Menerima,</span>
          <span className="nota-sig-paren">(                             )</span>
        </div>
      </div>
    </div>
  );
}

export function printNotaPreview() {
  printElementById(
    "nota-preview",
    `Nota ${Date.now()}`,
    "body { font-family: Arial, Helvetica, sans-serif; }",
  );
}

import type { TransaksiRow } from "./mock-data";
import { formatRpJumlah } from "./nota-bogor-tarif";

/** Material SAP one-time — referensi contoh OPB.pdf */
export const SAP_OPB_MATERIAL = {
  kode: "DVG80720541",
  nama: "PEMAKAIAN BAHAN BODY REPAIR",
  satuan: "PCK",
} as const;

export type AstraIssuer = {
  nama: string;
  unit: string;
  alamat: string;
};

/** Pembeli / issuer formulir SAP Astra — default dari scan Bogor */
export function astraIssuerForCabang(cabang: string): AstraIssuer {
  const lower = cabang.toLowerCase();
  if (lower.includes("surabaya")) {
    return {
      nama: "PT. ASTRA INTERNATIONAL TBK",
      unit: "Daihatsu Sales Operation — Surabaya",
      alamat: "Jl. Raya Darmo Permai III No.36, Surabaya",
    };
  }
  if (lower.includes("malang")) {
    return {
      nama: "PT. ASTRA INTERNATIONAL TBK",
      unit: "Daihatsu Sales Operation — Malang",
      alamat: "Jl. Letjen S. Parman No.67, Malang",
    };
  }
  if (lower.includes("jember") || lower.includes("kediri")) {
    return {
      nama: "PT. ASTRA INTERNATIONAL TBK",
      unit: "Daihatsu Sales Operation — Jatim",
      alamat: "Jl. Mastrip No.1, Jember",
    };
  }
  return {
    nama: "PT. ASTRA INTERNATIONAL TBK",
    unit: "Daihatsu Sales Operation — Bogor",
    alamat: "Jl. Raya Pajajaran No.54, Bogor, Jawa Barat",
  };
}

/** No. dokumen OPB SAP — pola D271-xxxxx dari transaksi */
export function sapOpbNoFromTrx(trx: Pick<TransaksiRow, "id">) {
  const digits = trx.id.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `D271-${digits}`;
}

/** No. SAP internal bengkel (mock) */
export function sapInternalNoFromTrx(trx: Pick<TransaksiRow, "id" | "noPkb">) {
  if (trx.noPkb) return trx.noPkb.replace(/^PKB-/, "SAP-");
  const digits = trx.id.replace(/\D/g, "").slice(-4);
  return `SAP-2026-${digits}`;
}

export function formatSapAmount(n: number) {
  return formatRpJumlah(n);
}

export function formatSapQty(n: number) {
  return n.toLocaleString("id-ID", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

import type { FakturJualRow } from "./faktur-utils";
import { parsePeriodeMonth } from "./rekap-invoice-utils";

/**
 * Kop + blok pelanggan dokumen INVOICE · disalin dari contoh resmi Tim Finance
 * (WhatsApp 28 Sep 2026: halaman 1 & 2, No. Invoice DOA.006.05.26).
 */
export const INVOICE_KOP = {
  nama: "PT. DAYA OTO ASIA",
  tagline: "Driving Quality, Delivering Trust",
  alamat: "JL. Kaliandra II No. 89c, RT.4/RW.9, Cengkareng, Jakarta Barat",
  kontak: "mail: Dayaotoasia@gmail.com, Telp: 08231518721",
};

/**
 * Unit Astra Daihatsu penerima tagihan per kota cabang.
 * Alamat Surabaya diambil dari contoh invoice (Waru). Kota lain masih alamat contoh —
 * ganti dengan alamat resmi kalau Tim Finance sudah kirim daftarnya.
 */
export const ASTRA_DSO: Record<string, { unit: string; alamat: string[] }> = {
  Surabaya: {
    unit: "Daihatsu Sales Operation Waru Surabaya",
    alamat: [
      "Jl. Raya Waru km 15, Sawotratap,",
      "Gedangan, Dusun Sawo Kec. Gedangan, Kab. Sidoarjo,",
      "Jawa Timur, 61254",
    ],
  },
  Malang: {
    unit: "Daihatsu Sales Operation Malang",
    alamat: ["Jl. Raya Malang,", "Jawa Timur"],
  },
  Jember: {
    unit: "Daihatsu Sales Operation Jember",
    alamat: ["Jl. Raya Jember,", "Jawa Timur"],
  },
  Kediri: {
    unit: "Daihatsu Sales Operation Kediri",
    alamat: ["Jl. Raya Kediri,", "Jawa Timur"],
  },
};

export function invoiceCustomer(cabang: string) {
  const kota = Object.keys(ASTRA_DSO).find((k) => cabang.toLowerCase().includes(k.toLowerCase())) ?? "Surabaya";
  const dso = ASTRA_DSO[kota];
  return {
    kota,
    nama: "PT. Astra International",
    unit: dso.unit,
    alamat: dso.alamat,
    /** Dasar blok tanda tangan pelanggan di dokumen */
    tandaTangan: `PT Astra Daihatsu ${kota}`,
  };
}

/** No. Invoice format dokumen · DOA.006.05.26 = urutan. bulan periode . tahun */
export function noInvoiceDoa(faktur: FakturJualRow) {
  const seq = Number(faktur.id.split("-").pop()) || 1;
  const { bulan, tahun } = parsePeriodeMonth(faktur.periode);
  return `DOA.${String(seq).padStart(3, "0")}.${String(bulan).padStart(2, "0")}.${String(tahun).slice(-2)}`;
}

/** Tanggal dokumen gaya contoh · 2026-07-27 → 27/07/2026 */
export function formatTglInvoice(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Keterangan tetap di kaki invoice · persis teks contoh (rapikan kalau Tim Finance koreksi) */
export const INVOICE_KETERANGAN = [
  "Keberatan apapun terhadap validitas faktur ini harus dilakukan dalam waktu tujuh (7) hari sejak tanggal faktur ini, jika tidak maka faktur ini dianggap diterima sebagai benar.",
  "Pembayaran dengan transfer/TT harus ditujukan ke Bank BCA No Rek.3098279000 A/N PT DAYA OTO ASIA, barang yang dijual tidak dapat dikembalikan.",
];

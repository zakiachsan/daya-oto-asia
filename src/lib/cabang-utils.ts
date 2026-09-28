import { MOCK_CABANG } from "./mock-data";

/**
 * Master cabang (bengkel mitra) · dipakai halaman Operasional → Master Cabang.
 * Data awal dari MOCK_CABANG, ditambah field operasional (alamat, telepon, geofence, status).
 */
export type CabangRow = {
  id: string;
  /** Nama bengkel, mis. "Bengkel Auto 2000 Surabaya" */
  nama: string;
  kota: string;
  alamat: string;
  telepon: string;
  /** Jumlah tinter hasil assignment (dihitung di halaman, bukan disimpan) */
  tinter: number;
  /** Jumlah item stok yang di bawah minimum */
  stokAlert: number;
  /** Batas minimum stok per bahan (gram) */
  minStokGram: number;
  /** Radius geofence absensi (meter) */
  radiusMeter: number;
  /** Koordinat pusat geofence */
  koordinat: string;
  status: "Aktif" | "Nonaktif";
};

/** Label pendek cabang (tanpa kata "Bengkel") · dipakai assignment tinter & inventori */
export function cabangShort(nama: string) {
  return nama.replace(/^Bengkel /, "");
}

const KOORDINAT_KOTA: Record<string, string> = {
  Surabaya: "-7.250445, 112.768845",
  Malang: "-7.966620, 112.632632",
  Jember: "-8.168899, 113.702293",
  Kediri: "-7.848016, 112.017841",
};

const KODE_AREA: Record<string, string> = {
  Surabaya: "031",
  Malang: "0341",
  Jember: "0331",
  Kediri: "0354",
};

export const INITIAL_CABANG: CabangRow[] = MOCK_CABANG.map((c) => ({
  ...c,
  alamat: `Jl. Raya ${c.kota} No. ${10 + Number(c.id) * 4}`,
  telepon: `(${KODE_AREA[c.kota] ?? "031"}) ${700000 + Number(c.id) * 1234}`,
  radiusMeter: 100,
  koordinat: KOORDINAT_KOTA[c.kota] ?? "-7.250445, 112.768845",
  status: "Aktif",
}));

/** Form kosong buat tambah cabang baru */
export const CABANG_BARU = {
  nama: "",
  kota: "",
  alamat: "",
  telepon: "",
  minStokGram: 400,
  radiusMeter: 100,
  koordinat: "",
  status: "Aktif" as CabangRow["status"],
};

/** Koordinat contoh untuk kota yang belum terdaftar */
export const KOORDINAT_CONTOH = "-7.250445, 112.768845";

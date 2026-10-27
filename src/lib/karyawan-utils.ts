/**
 * Integrasi karyawan ↔ bengkel.
 * Satu sumber kebenaran: karyawan (HRIS) + assignment cabang. Penerima komisi di Master Cabang
 * hanya boleh orang yang benar-benar bekerja di bengkel itu.
 */

import { cabangShort } from "./cabang-utils";

export type KaryawanRingkas = {
  id: string;
  nama: string;
  jabatan: string;
  cabang: string;
  status?: string;
};

/** Cabang efektif · assignment HRIS menimpa cabang di master karyawan */
export function cabangEfektifKaryawan(k: KaryawanRingkas, assignment: Record<string, string>) {
  return String(assignment[String(k.id)] ?? k.cabang ?? "").trim();
}

/** Karyawan aktif yang bekerja di satu bengkel (nama cabang boleh pakai/tanpa prefix "Bengkel") */
export function karyawanDiCabang<T extends KaryawanRingkas>(
  items: T[],
  assignment: Record<string, string>,
  namaCabang: string,
) {
  const target = cabangShort(String(namaCabang ?? "").trim()).toLowerCase().replace(/\s+/g, " ");
  if (!target) return [];
  return items
    .filter((k) => (k.status ?? "Aktif") === "Aktif")
    .filter(
      (k) => cabangShort(cabangEfektifKaryawan(k, assignment)).toLowerCase().replace(/\s+/g, " ") === target,
    )
    .sort((a, b) => a.nama.localeCompare(b.nama));
}

/** Karyawan dengan jabatan tertentu di satu bengkel · mis. hanya "Tinter" */
export function karyawanDiCabangJabatan<T extends KaryawanRingkas>(
  items: T[],
  assignment: Record<string, string>,
  namaCabang: string,
  jabatan: string,
) {
  return karyawanDiCabang(items, assignment, namaCabang).filter((k) => k.jabatan === jabatan);
}

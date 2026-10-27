/**
 * Akun user aplikasi (HRIS → Users & Akun).
 * Dipakai juga sebagai sumber dropdown penerima komisi di Master Cabang,
 * jadi akun yang dibuat di HRIS langsung muncul di sana.
 */

export type AkunRole = "Admin" | "Supervisor" | "HR" | "Finance" | "Tinter";

export type AkunRow = {
  email: string;
  nama: string;
  role: AkunRole;
  /** Modul yang boleh diakses · diturunkan dari role */
  modul: string;
  status: "Aktif" | "Nonaktif";
};

export const MODUL_BY_ROLE: Record<AkunRole, string> = {
  Admin: "Semua",
  Supervisor: "Operasional, HRIS",
  HR: "HRIS",
  Finance: "Finance",
  Tinter: "App",
};

export const AKUN_ROLES: AkunRole[] = ["Admin", "Supervisor", "HR", "Finance", "Tinter"];

export const INITIAL_AKUN: AkunRow[] = [
  { email: "admin@dayaoto.com", nama: "Budi Santoso", role: "Admin", modul: "Semua", status: "Aktif" },
  { email: "ahmad@dayaoto.com", nama: "Pak Ahmad", role: "Supervisor", modul: "Operasional, HRIS", status: "Aktif" },
  { email: "siti@dayaoto.com", nama: "Siti Rahayu", role: "HR", modul: "HRIS", status: "Aktif" },
  { email: "finance@dayaoto.com", nama: "Finance Team", role: "Finance", modul: "Finance", status: "Aktif" },
  { email: "andi@dayaoto.com", nama: "Andi Wijaya", role: "Tinter", modul: "App", status: "Aktif" },
];

/** Akun aktif saja, terurut nama · untuk dropdown */
export function akunAktif(items: AkunRow[]) {
  return items.filter((a) => a.status === "Aktif").sort((a, b) => a.nama.localeCompare(b.nama));
}

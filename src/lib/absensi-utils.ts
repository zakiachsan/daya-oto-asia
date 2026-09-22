import { MOBILE_CABANG } from "./mobile-app-constants";

/** Geofence cabang · diset admin di Operasional → Master Cabang (mock). */
export type GeofenceConfig = {
  cabangNama: string;
  lat: number;
  lng: number;
  radiusM: number;
};

export const MOCK_GEOFENCE: GeofenceConfig = {
  cabangNama: MOBILE_CABANG,
  lat: -7.250445,
  lng: 112.768845,
  radiusM: 100,
};

const GPS_DALAM_RADIUS = { lat: -7.250445, lng: 112.768845 };
const GPS_LUAR_RADIUS = { lat: -7.2528, lng: 112.7712 };

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function resolveMockGps(simulateOutside: boolean) {
  return simulateOutside ? GPS_LUAR_RADIUS : GPS_DALAM_RADIUS;
}

export function checkGeofence(
  userLat: number,
  userLng: number,
  geofence: GeofenceConfig = MOCK_GEOFENCE,
) {
  const distanceM = Math.round(distanceMeters(userLat, userLng, geofence.lat, geofence.lng));
  const withinRadius = distanceM <= geofence.radiusM;
  return { withinRadius, distanceM };
}

export function geofenceStatusLabel(withinRadius: boolean, geofence: GeofenceConfig = MOCK_GEOFENCE) {
  if (withinRadius) {
    return `${geofence.cabangNama} · dalam radius (${geofence.radiusM}m)`;
  }
  return `Di luar radius ${geofence.cabangNama} (${geofence.radiusM}m)`;
}

export type AbsensiStatus = "Hadir" | "Telat" | "Luar Radius";

export type AbsensiRiwayatRow = {
  id: string;
  tanggal: string;
  checkIn: string;
  checkOut: string | null;
  status: AbsensiStatus;
  keteranganLuar?: string;
};

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeekIso(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

const RIWAYAT_SEED_TEMPLATES: Omit<AbsensiRiwayatRow, "id" | "tanggal">[] = [
  {
    checkIn: "08:05",
    checkOut: "17:10",
    status: "Telat",
  },
  {
    checkIn: "07:48",
    checkOut: "16:55",
    status: "Luar Radius",
    keteranganLuar: "Backup ke Auto 2000 Sunter · mesin cabang Pluit maintenance",
  },
  {
    checkIn: "07:55",
    checkOut: "17:02",
    status: "Hadir",
  },
];

export function buildInitialAbsensiRiwayat(): AbsensiRiwayatRow[] {
  const weekStart = startOfWeekIso(todayIso());
  const rows: AbsensiRiwayatRow[] = [];

  for (let daysAgo = 1; daysAgo <= 7; daysAgo += 1) {
    const tanggal = isoDaysAgo(daysAgo);
    if (tanggal < weekStart) break;
    const template = RIWAYAT_SEED_TEMPLATES[(daysAgo - 1) % RIWAYAT_SEED_TEMPLATES.length];
    rows.push({
      id: `abs-seed-${daysAgo}`,
      tanggal,
      ...template,
    });
  }

  return rows;
}

export function isAbsensiLuarRadius(row: Pick<AbsensiRiwayatRow, "status">) {
  return row.status === "Luar Radius";
}

export const INITIAL_ABSENSI_RIWAYAT = buildInitialAbsensiRiwayat();

export function sortAbsensiRiwayat(rows: AbsensiRiwayatRow[]) {
  return [...rows].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.checkIn.localeCompare(a.checkIn));
}

export function filterRiwayatMingguIni(rows: AbsensiRiwayatRow[], refDate = todayIso()) {
  const weekStart = startOfWeekIso(refDate);
  return sortAbsensiRiwayat(rows.filter((r) => r.tanggal >= weekStart && r.tanggal <= refDate));
}

export function formatAbsensiHari(tanggal: string) {
  const d = new Date(`${tanggal}T12:00:00`);
  const hari = d.toLocaleDateString("id-ID", { weekday: "short" });
  const tgl = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const label = `${hari}, ${tgl}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function absensiStatusClass(status: AbsensiStatus) {
  if (status === "Hadir") return "bg-green-100 text-green-700";
  if (status === "Telat") return "bg-amber-100 text-amber-700";
  return "bg-orange-100 text-orange-700";
}

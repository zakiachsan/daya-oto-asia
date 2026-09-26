export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readBy: string[];
};

export const SEED_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "NTF-001",
    title: "Stok Menipis · HS Clear Coat",
    body: "Auto 2000 Surabaya · AXT 360 HS di bawah minimum cabang. Ajukan distribusi jika perlu.",
    createdAt: new Date().toISOString(),
    readBy: [],
  },
  {
    id: "NTF-002",
    title: "Pengumuman Admin",
    body: "Stock opname minggu ini deadline Minggu 23:59 · pastikan timbangan kalibrasi.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    readBy: [],
  },
];

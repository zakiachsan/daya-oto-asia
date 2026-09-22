const STYLES: Record<string, string> = {
  Selesai: "bg-green-100 text-green-700",
  Posted: "bg-green-100 text-green-700",
  Aktif: "bg-green-100 text-green-700",
  Aman: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
  "Cetak Nota": "bg-sky-100 text-sky-700",
  "TTD GH": "bg-indigo-100 text-indigo-700",
  "Menunggu OPB": "bg-amber-100 text-amber-700",
  "OPB Terbit": "bg-blue-100 text-blue-700",
  "Proses Invoice": "bg-violet-100 text-violet-700",
  Dibatalkan: "bg-red-100 text-red-700",
  Partial: "bg-orange-100 text-orange-700",
  Cair: "bg-green-100 text-green-700",
  Disetujui: "bg-green-100 text-green-700",
  Ditolak: "bg-red-100 text-red-700",
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700",
  "Menunggu TTD": "bg-amber-100 text-amber-700",
  "Perlu Review": "bg-amber-100 text-amber-700",
  "Menunggu Review": "bg-sky-100 text-sky-700",
  Menipis: "bg-amber-100 text-amber-700",
  Rekonsiliasi: "bg-blue-100 text-blue-700",
  Ditagihkan: "bg-blue-100 text-blue-700",
  Kritis: "bg-red-100 text-red-700",
  Habis: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

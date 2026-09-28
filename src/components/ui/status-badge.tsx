const STYLES: Record<string, string> = {
  Selesai: "bg-green-100 text-green-700",
  Posted: "bg-green-100 text-green-700",
  Aktif: "bg-green-100 text-green-700",
  Aman: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
  "Dalam Perjalanan": "bg-blue-100 text-blue-700",
  "Bayar Sebagian": "bg-orange-100 text-orange-700",
  Lunas: "bg-green-100 text-green-700",
  Terekonsiliasi: "bg-sky-100 text-sky-700",
  "Belum Rekonsiliasi": "bg-gray-100 text-gray-600",
  Terkirim: "bg-blue-100 text-blue-700",
  Diterima: "bg-green-100 text-green-700",
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

const SIZES: Record<"md" | "xs", string> = {
  md: "px-2 py-0.5 text-[10px]",
  // xs: dipakai di list mobile yang sempit — nowrap + shrink-0 supaya label
  // panjang ("Menunggu TTD") tidak terpecah 2 baris saat blok kiri melebar.
  xs: "px-1.5 py-0.5 text-[9px] whitespace-nowrap shrink-0",
};

export function StatusBadge({ status, size = "md" }: { status: string; size?: keyof typeof SIZES }) {
  return (
    <span className={`inline-flex rounded-full font-bold uppercase ${SIZES[size]} ${STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

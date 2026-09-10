"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Paintbrush, Clock, Package } from "lucide-react";
import { useTransaksiList } from "@/lib/preview-store";
import { MOCK_KINERJA, formatDurasi } from "@/lib/mock-data";
import { nameFromSlug } from "@/lib/preview-store";

export default function KinerjaDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const nama = nameFromSlug(slug);
  const { all } = useTransaksiList();

  const kinerja = MOCK_KINERJA.find((k) => k.nama.toLowerCase() === nama.toLowerCase());
  const trx = all.filter((t) => t.tinter.toLowerCase() === nama.toLowerCase());
  const avgDurasi = trx.length
    ? Math.round(trx.filter((t) => t.durasiMixingMenit).reduce((s, t) => s + (t.durasiMixingMenit ?? 0), 0) / (trx.filter((t) => t.durasiMixingMenit).length || 1))
    : null;

  return (
    <div>
      <PageHeader
        title={nama}
        desc="Detail kinerja tinter — transaksi & durasi mixing per pekerjaan"
        breadcrumb={[
          { label: "HRIS", href: "/hris" },
          { label: "Kinerja Tinter", href: "/hris/kinerja" },
          { label: nama },
        ]}
      />

      <Link href="/hris/kinerja" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Transaksi Bulan Ini" value={String(kinerja?.trxBulan ?? trx.length)} icon={Paintbrush} color="orange" />
        <StatCard label="Avg Durasi Mixing" value={avgDurasi ? formatDurasi(avgDurasi) : kinerja?.avgDurasi ?? "—"} icon={Clock} color="blue" />
        <StatCard label="Pemakaian Bahan" value={kinerja?.pemakaianBahan ?? "—"} icon={Package} color="green" />
      </div>

      <DataTable
        columns={[
          {
            key: "id",
            label: "No. Trx",
            render: (r) => (
              <Link href={`/operasional/transaksi/${r.id}`} className="font-mono text-brand font-semibold hover:underline">
                {String(r.id)}
              </Link>
            ),
          },
          { key: "tanggal", label: "Tanggal" },
          { key: "warna", label: "Warna" },
          { key: "mobil", label: "Mobil" },
          {
            key: "durasiMixingMenit",
            label: "Durasi Mixing",
            render: (r) => formatDurasi(r.durasiMixingMenit as number | null),
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
        ]}
        data={trx}
        emptyMessage={`Belum ada transaksi untuk ${nama}`}
      />
    </div>
  );
}

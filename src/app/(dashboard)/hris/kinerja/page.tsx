"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { Paintbrush, Clock, Users } from "lucide-react";
import { MOCK_KINERJA } from "@/lib/mock-data";
import { slugify } from "@/lib/preview-store";

export default function KinerjaPage() {
  return (
    <div>
      <PageHeader
        title="Kinerja Tinter"
        desc="Scan kinerja tinter · klik nama untuk durasi mixing & pemakaian bahan"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "Kinerja Tinter" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Total Transaksi" value="101" sub="Agustus 2026" icon={Paintbrush} color="orange" />
        <StatCard label="Avg Durasi Mixing" value="20 menit" sub="Semua tinter" icon={Clock} color="blue" />
        <StatCard label="Tinter Aktif" value="3" sub="Dari 4 cabang" icon={Users} color="green" />
      </div>

      <DataTable
        columns={[
          {
            key: "nama",
            label: "Tinter",
            render: (r) => (
              <Link href={`/hris/kinerja/${slugify(String(r.nama))}`} className="font-semibold text-brand hover:underline">
                {String(r.nama)}
              </Link>
            ),
          },
          { key: "cabang", label: "Cabang" },
          { key: "trxBulan", label: "Transaksi", render: (r) => `${r.trxBulan} trx` },
          { key: "kehadiran", label: "Kehadiran" },
        ]}
        data={MOCK_KINERJA}
      />
    </div>
  );
}

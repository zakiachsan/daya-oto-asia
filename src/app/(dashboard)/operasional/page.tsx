import Link from "next/link";
import { Paintbrush, FileText, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_TRANSAKSI, MOCK_CABANG, MOCK_STOK, formatIDR } from "@/lib/mock-data";

export default function OperasionalDashboard() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard Operasional"
        desc="Ringkasan transaksi warna, stok cabang, dan OPB"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Transaksi Hari Ini" value="12" sub="4 cabang aktif" icon={Paintbrush} color="orange" />
        <StatCard label="OPB Pending" value="3" sub="Menunggu tanda tangan" icon={FileText} color="amber" />
        <StatCard label="Stok Kritis" value="4" sub="Perlu segera dipesan" icon={AlertTriangle} color="red" />
        <StatCard label="Omset Bulan Ini" value={formatIDR(45200000)} sub="+8% vs bulan lalu" icon={TrendingUp} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slds-text">Transaksi Terbaru</h2>
            <Link href="/operasional/transaksi" className="text-[12px] text-brand font-semibold">Lihat semua</Link>
          </div>
          <DataTable
            columns={[
              { key: "id", label: "No. Trx" },
              { key: "cabang", label: "Cabang" },
              { key: "warna", label: "Warna" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
            ]}
            data={MOCK_TRANSAKSI.slice(0, 4)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slds-text">Stok Perlu Perhatian</h2>
            <Link href="/operasional/inventori" className="text-[12px] text-brand font-semibold">Lihat semua</Link>
          </div>
          <DataTable
            columns={[
              { key: "produk", label: "Produk" },
              { key: "cabang", label: "Cabang" },
              { key: "qty", label: "Qty", render: (r) => `${r.qty} ${r.satuan}` },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
            ]}
            data={MOCK_STOK.filter((s) => s.status !== "Aman")}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slds-text">Cabang</h2>
          <Link href="/operasional/cabang" className="text-[12px] text-brand font-semibold">Kelola cabang</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_CABANG.map((c) => (
            <div key={c.id} className="bg-white border border-slds-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-bold text-slds-text">{c.nama}</p>
                  <p className="text-[11px] text-slds-text-weak">{c.kota}</p>
                </div>
                {c.stokAlert > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                    <Package className="h-3 w-3" /> {c.stokAlert}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slds-text-weak mt-2">{c.tinter} tinter aktif</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

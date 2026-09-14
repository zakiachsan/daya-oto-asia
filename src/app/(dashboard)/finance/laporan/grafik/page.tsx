"use client";

import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";
import { MOCK_GRAFIK_BEBAN, MOCK_GRAFIK_PENJUALAN, formatIDR } from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function GrafikPage() {
  return (
    <div>
      <PageHeader
        title="Grafik Keuangan"
        desc="Visualisasi tren penjualan & beban — UI preview (mock data, jutaan Rp)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Grafik" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>6 Bulan Terakhir</option>
            <option>12 Bulan Terakhir</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Penjualan Sep" value={formatIDR(26000000)} sub="2 faktur posted" icon={TrendingUp} color="green" />
        <StatCard label="Penerimaan Sep" value={formatIDR(18000000)} sub="62% collection rate" icon={BarChart3} color="blue" />
        <StatCard label="Beban Sep" value={formatIDR(14000000)} sub="HPP + operasional" icon={PieChart} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Penjualan vs Penerimaan (jt Rp)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_GRAFIK_PENJUALAN}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" jt" />
              <Tooltip formatter={(v) => [`${v} jt`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="penjualan" name="Penjualan" fill="#e85d04" radius={[4, 4, 0, 0]} />
              <Bar dataKey="penerimaan" name="Penerimaan" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Trend Beban (jt Rp)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MOCK_GRAFIK_BEBAN}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" jt" />
              <Tooltip formatter={(v) => [`${v} jt`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="hpp" name="HPP" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="operasional" name="Operasional" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

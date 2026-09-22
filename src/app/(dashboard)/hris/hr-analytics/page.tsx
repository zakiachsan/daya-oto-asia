"use client";

import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const KEHADIRAN = [
  { cabang: "Surabaya", pct: 95 },
  { cabang: "Malang", pct: 100 },
  { cabang: "Jember", pct: 90 },
];

const LEMBUR_TREND = [
  { bulan: "Apr", jam: 12 },
  { bulan: "Mei", jam: 18 },
  { bulan: "Jun", jam: 8 },
  { bulan: "Jul", jam: 24 },
  { bulan: "Agu", jam: 16 },
  { bulan: "Sep", jam: 20 },
];

export default function HRAnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="HR Analytics"
        desc="KPI kehadiran, izin, lembur · port pt-gis dengan recharts"
        breadcrumb={[{ label: "HRIS", href: "/hris" }, { label: "HR Analytics" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Kehadiran Rata-rata" value="95%" sub="September 2026" icon={Calendar} color="green" />
        <StatCard label="Total Lembur" value="20 jam" sub="3 tinter" icon={Clock} color="amber" />
        <StatCard label="Izin/Cuti" value="3 hari" sub="2 pengajuan" icon={Users} color="blue" />
        <StatCard label="Headcount Tinter" value="3" sub="Aktif di cabang" icon={TrendingUp} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Kehadiran per Cabang</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={KEHADIRAN}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="cabang" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, "Kehadiran"]} />
              <Bar dataKey="pct" fill="#e85d04" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3">Trend Lembur (6 Bulan)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={LEMBUR_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" jam" />
              <Tooltip formatter={(v) => [`${v} jam`, "Lembur"]} />
              <Line type="monotone" dataKey="jam" stroke="#e85d04" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

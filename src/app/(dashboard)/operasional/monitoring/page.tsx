"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StokChainVisual } from "@/components/ui/stok-chain-visual";
import { Paintbrush, TrendingUp, Package, AlertTriangle, GitBranch } from "lucide-react";
import { DEMO_STOK_CHAIN } from "@/lib/stok-chain-utils";

export default function MonitoringPage() {
  return (
    <div>
      <PageHeader
        title="Monitoring"
        desc="Trend operasional + alur stok end-to-end (transaksi → opname → penyesuaian → restock)"
        breadcrumb={[{ label: "Operasional", href: "/operasional" }, { label: "Monitoring" }]}
        actions={
          <Link href="/demo" className="text-[13px] font-semibold text-brand hover:underline">
            Demo checklist →
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Trx Bulan Ini" value="101" icon={Paintbrush} color="orange" />
        <StatCard label="Warna Terpopuler" value="Silver Met." icon={TrendingUp} color="blue" />
        <StatCard label="Toner Terpakai" value="27.3 kg" icon={Package} color="green" />
        <StatCard label="Follow-up Pending" value="2" icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slds-border rounded-lg p-4">
          <h3 className="text-[13px] font-bold text-slds-text mb-3 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-brand" /> Alur Stok End-to-End
          </h3>
          <p className="text-[12px] text-slds-text-weak mb-4">Contoh kasus Silver Metallic Surabaya · klik setiap langkah untuk drill-down</p>
          <StokChainVisual steps={DEMO_STOK_CHAIN} />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-3">Top Warna per Cabang</h3>
            {[
              { cabang: "Surabaya", warna: "Silver Metallic", count: 18 },
              { cabang: "Malang", warna: "Merah Solid", count: 9 },
              { cabang: "Jember", warna: "Pearl White", count: 12 },
            ].map((r) => (
              <div key={r.cabang} className="flex justify-between py-2 border-b border-slds-border last:border-0 text-[13px]">
                <span><strong>{r.cabang}</strong> · {r.warna}</span>
                <span className="font-bold text-brand">{r.count}x</span>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slds-border rounded-lg p-4">
            <h3 className="text-[13px] font-bold text-slds-text mb-3">Follow-up Pesanan Stok</h3>
            {[
              { cabang: "Surabaya", item: "HS-30 Black", note: "2 kaleng, belum pesan 5 hari", href: "/operasional/ajuan-stok/AJ-001" },
              { cabang: "Jember", item: "Pearl White", note: "Habis, ajuan pending approval", href: "/operasional/ajuan-stok/AJ-002" },
            ].map((r) => (
              <Link key={r.cabang + r.item} href={r.href} className="block py-2 border-b border-slds-border last:border-0 hover:bg-slds-bg/50 -mx-2 px-2 rounded">
                <p className="text-[13px] font-bold text-slds-text">{r.cabang} · {r.item}</p>
                <p className="text-[11px] text-amber-700">{r.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

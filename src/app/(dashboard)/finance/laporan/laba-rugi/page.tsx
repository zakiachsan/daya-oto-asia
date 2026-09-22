import { PageHeader } from "@/components/ui/page-header";
import { MOCK_LABA_RUGI, formatIDR } from "@/lib/mock-data";

export default function LabaRugiPage() {
  const labaBersih = MOCK_LABA_RUGI.reduce((s, r) => s + r.jumlah, 0);

  return (
    <div>
      <PageHeader
        title="Laba Rugi"
        desc="Laporan laba rugi · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Laba Rugi" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
        }
      />

      <div className="bg-white border border-slds-border rounded-lg overflow-hidden max-w-xl">
        <div className="px-4 py-3 bg-slds-bg border-b border-slds-border">
          <h3 className="text-[13px] font-bold text-slds-text">Pendapatan & Beban</h3>
        </div>
        <div className="p-4 space-y-2">
          {MOCK_LABA_RUGI.map((r) => (
            <div key={r.akun} className="flex justify-between text-[13px]">
              <span className="text-slds-text-weak">{r.akun}</span>
              <span className={`font-semibold ${r.jumlah < 0 ? "text-red-600" : "text-green-600"}`}>
                {formatIDR(Math.abs(r.jumlah))}
                {r.jumlah < 0 ? " (beban)" : ""}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-[15px] font-bold pt-4 border-t-2 border-slds-border">
            <span>Laba Bersih</span>
            <span className="text-brand">{formatIDR(labaBersih)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/ui/page-header";
import { MOCK_NERACA, formatIDR } from "@/lib/mock-data";

export default function NeracaPage() {
  const totalAktiva = MOCK_NERACA.aktiva.reduce((s, a) => s + a.saldo, 0);
  const totalPasiva = MOCK_NERACA.pasiva.reduce((s, a) => s + a.saldo, 0);

  return (
    <div>
      <PageHeader
        title="Neraca"
        desc="Laporan posisi keuangan per 10 September 2026"
        breadcrumb={[{ label: "Finance", href: "/finance" }, { label: "Neraca" }]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slds-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-slds-bg border-b border-slds-border">
            <h3 className="text-[13px] font-bold text-slds-text">AKTIVA</h3>
          </div>
          <div className="p-4 space-y-2">
            {MOCK_NERACA.aktiva.map((a) => (
              <div key={a.akun} className="flex justify-between text-[13px]">
                <span className="text-slds-text-weak">{a.akun}</span>
                <span className="font-semibold">{formatIDR(a.saldo)}</span>
              </div>
            ))}
            <div className="flex justify-between text-[14px] font-bold pt-3 border-t border-slds-border">
              <span>Total Aktiva</span>
              <span className="text-brand">{formatIDR(totalAktiva)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slds-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-slds-bg border-b border-slds-border">
            <h3 className="text-[13px] font-bold text-slds-text">PASIVA</h3>
          </div>
          <div className="p-4 space-y-2">
            {MOCK_NERACA.pasiva.map((a) => (
              <div key={a.akun} className="flex justify-between text-[13px]">
                <span className="text-slds-text-weak">{a.akun}</span>
                <span className="font-semibold">{formatIDR(a.saldo)}</span>
              </div>
            ))}
            <div className="flex justify-between text-[14px] font-bold pt-3 border-t border-slds-border">
              <span>Total Pasiva</span>
              <span className="text-brand">{formatIDR(totalPasiva)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

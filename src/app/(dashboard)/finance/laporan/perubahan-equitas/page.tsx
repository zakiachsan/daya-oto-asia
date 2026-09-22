import { PageHeader } from "@/components/ui/page-header";
import { formatIDR, MOCK_PERUBAHAN_EKUITAS } from "@/lib/mock-data";

export default function PerubahanEquitasPage() {
  const totalAwal = MOCK_PERUBAHAN_EKUITAS.reduce((s, r) => s + r.saldoAwal, 0);
  const totalAkhir = MOCK_PERUBAHAN_EKUITAS.reduce((s, r) => s + r.saldoAkhir, 0);

  return (
    <div>
      <PageHeader
        title="Perubahan Ekuitas"
        desc="Laporan perubahan modal & laba ditahan · UI preview (mock data)"
        breadcrumb={[
          { label: "Finance", href: "/finance" },
          { label: "Laporan Keuangan" },
          { label: "Perubahan Ekuitas" },
        ]}
        actions={
          <select className="px-3 py-2 border border-slds-border rounded-md text-[13px] bg-white">
            <option>September 2026</option>
            <option>Agustus 2026</option>
          </select>
        }
      />

      <div className="bg-white border border-slds-border rounded-lg overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-slds-border text-left text-[11px] uppercase text-slds-text-weak bg-slds-bg">
              <th className="px-4 py-2 font-semibold">Komponen Ekuitas</th>
              <th className="px-4 py-2 font-semibold text-right">Saldo Awal</th>
              <th className="px-4 py-2 font-semibold text-right">Penambahan</th>
              <th className="px-4 py-2 font-semibold text-right">Pengurangan</th>
              <th className="px-4 py-2 font-semibold text-right">Saldo Akhir</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PERUBAHAN_EKUITAS.map((r) => (
              <tr key={r.komponen} className="border-b border-slds-border last:border-0">
                <td className="px-4 py-2 font-semibold">{r.komponen}</td>
                <td className="px-4 py-2 text-right">{formatIDR(r.saldoAwal)}</td>
                <td className="px-4 py-2 text-right text-green-600">{r.penambahan > 0 ? formatIDR(r.penambahan) : "-"}</td>
                <td className="px-4 py-2 text-right text-red-600">{r.pengurangan > 0 ? formatIDR(r.pengurangan) : "-"}</td>
                <td className="px-4 py-2 text-right font-semibold">{formatIDR(r.saldoAkhir)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-slds-bg">
              <td className="px-4 py-3">Total Ekuitas</td>
              <td className="px-4 py-3 text-right">{formatIDR(totalAwal)}</td>
              <td className="px-4 py-3 text-right">-</td>
              <td className="px-4 py-3 text-right">-</td>
              <td className="px-4 py-3 text-right text-brand">{formatIDR(totalAkhir)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

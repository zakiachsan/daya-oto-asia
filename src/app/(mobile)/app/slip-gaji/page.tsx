import { formatIDR } from "@/lib/mock-data";

export default function AppSlipGajiPage() {
  return (
    <div className="space-y-4">
      <select className="w-full px-3 py-2.5 border border-slds-border rounded-xl text-[14px] bg-white focus:border-brand focus:outline-none">
        <option>Agustus 2026</option>
        <option>Juli 2026</option>
      </select>

      <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
        <div className="px-4 py-3 bg-brand text-white">
          <p className="text-[12px] opacity-80">Slip Gaji</p>
          <p className="text-base font-bold">Agustus 2026</p>
        </div>
        <div className="p-4 space-y-2">
          {[
            { label: "Gaji Pokok", value: 4500000 },
            { label: "Tunjangan", value: 500000 },
            { label: "Upah Lembur (8 jam)", value: 320000 },
            { label: "Potongan Absensi", value: -150000 },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-[13px]">
              <span className="text-slds-text-weak">{row.label}</span>
              <span className={`font-semibold ${row.value < 0 ? "text-red-600" : "text-slds-text"}`}>
                {formatIDR(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-[14px] font-bold pt-3 border-t border-slds-border">
            <span>Gaji Bersih</span>
            <span className="text-brand">{formatIDR(5170000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

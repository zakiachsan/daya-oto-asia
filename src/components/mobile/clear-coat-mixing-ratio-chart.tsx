"use client";

import {
  chartForClearCoat,
  clearCoatDisplayName,
  type ClearCoatChartKode,
} from "@/lib/clear-coat-mixing-chart";

function fmtGram(n: number) {
  return n.toFixed(1).replace(".", ",");
}

type Props = {
  kode: ClearCoatChartKode;
  selectedTotal: number;
  onSelectTotal: (grams: number) => void;
};

export function ClearCoatMixingRatioChart({ kode, selectedTotal, onSelectTotal }: Props) {
  const rows = chartForClearCoat(kode);
  const title = clearCoatDisplayName(kode);

  return (
    <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
      <div className="px-3 py-2.5 bg-slds-bg border-b border-slds-border">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slds-text-weak">AXT Mixing Ratio</p>
        <p className="text-[13px] font-bold text-slds-text">{title}</p>
        <p className="text-[10px] text-slds-text-weak mt-0.5">Mixing ratio by weight (Gram) · ketuk kolom total</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-brand/5">
              <th className="sticky left-0 z-10 bg-brand/5 px-2 py-1.5 text-left font-bold text-slds-text border-b border-r border-slds-border/60 min-w-[72px]">
                Total (g)
              </th>
              {rows.map((r) => {
                const active = selectedTotal === r.total;
                return (
                  <th
                    key={r.total}
                    className={`px-1.5 py-1.5 font-bold border-b border-slds-border/40 min-w-[44px] text-center
                      ${active ? "bg-brand text-white" : "text-brand"}`}
                  >
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => onSelectTotal(r.total)}
                      className="w-full font-bold tabular-nums"
                    >
                      {r.total}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(
              [
                { key: "base", label: "Base (A)" },
                { key: "hardener", label: "Hardener (B)" },
                { key: "thinner", label: "Thinner (T)" },
              ] as const
            ).map((line) => (
              <tr key={line.key} className="border-b border-slds-border/40 last:border-0">
                <td className="sticky left-0 z-10 bg-white px-2 py-1.5 font-semibold text-slds-text border-r border-slds-border/60">
                  {line.label}
                </td>
                {rows.map((r) => {
                  const val = r[line.key];
                  const active = selectedTotal === r.total;
                  return (
                    <td
                      key={`${line.key}-${r.total}`}
                      className={`px-1.5 py-1.5 text-center tabular-nums font-medium
                        ${active ? "bg-brand/10 text-brand font-bold" : "text-slds-text"}`}
                    >
                      {fmtGram(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

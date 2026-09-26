"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useDistribusiList, useInventoriStok } from "@/lib/preview-store";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";

export default function TerimaBarangPage() {
  const { toast } = useToast();
  const { items, update } = useDistribusiList();
  const { adjust } = useInventoriStok();
  const inbound = useMemo(() => items.filter((d) => d.status !== "Selesai"), [items]);
  const [distId, setDistId] = useState(inbound[0]?.id ?? "");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [bocorGram, setBocorGram] = useState<Record<string, number>>({});

  const detail = items.find((d) => d.id === distId);

  function toggle(kode: string) {
    setChecked((p) => ({ ...p, [kode]: !p[kode] }));
  }

  function handleTerima() {
    if (!detail) return;
    const lines = detail.lines.filter((i) => checked[i.kode]);
    if (!lines.length) {
      toast("Centang minimal satu barang", "error");
      return;
    }
    lines.forEach((line) => {
      const selisih = bocorGram[line.kode] ?? 0;
      const net = Math.max(0, line.qty - selisih);
      adjust({
        kodeProduk: line.kode,
        cabang: "Surabaya",
        gramDelta: net,
        kalengDelta: 0,
        keterangan: selisih ? `Terima ${detail.id} · bocor ${selisih}` : `Terima ${detail.id}`,
        oleh: MOBILE_USER,
      });
    });
    update(detail.id, {
      status: "Selesai",
      waktuTerima: new Date().toISOString(),
    });
    toast(`${lines.length} item masuk stok cabang`, "success");
    setChecked({});
    setBocorGram({});
  }

  return (
    <div className="space-y-4">
      <Link href="/app" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Beranda
      </Link>
      <h1 className="text-lg font-bold flex items-center gap-2">
        <PackageCheck className="h-5 w-5 text-brand" /> Terima Barang
      </h1>
      <p className="text-[12px] text-slds-text-weak">{MOBILE_CABANG} · checklist inbound distribusi</p>
      <select value={distId} onChange={(e) => setDistId(e.target.value)} className="w-full px-3 py-2.5 border border-slds-border rounded-xl text-[13px] bg-white">
        {inbound.map((d) => (
          <option key={d.id} value={d.id}>{d.id} · {d.tanggal} → {d.ke}</option>
        ))}
      </select>
      {detail && (
        <div className="bg-white rounded-xl border border-slds-border divide-y">
          {detail.lines.map((line) => (
            <div key={line.kode} className="p-3 space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={!!checked[line.kode]} onChange={() => toggle(line.kode)} />
                {line.kode} · {line.nama} ({line.qty} unit)
              </label>
              {checked[line.kode] && (
                <input
                  type="number"
                  min={0}
                  placeholder="Selisih bocor/kurang (gram)"
                  value={bocorGram[line.kode] ?? ""}
                  onChange={(e) => setBocorGram((p) => ({ ...p, [line.kode]: Number(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 border border-slds-border rounded-lg text-[12px]"
                />
              )}
            </div>
          ))}
        </div>
      )}
      <button type="button" data-no-toast onClick={handleTerima} className="w-full py-3 bg-brand text-white rounded-xl font-bold">
        Konfirmasi Terima
      </button>
    </div>
  );
}

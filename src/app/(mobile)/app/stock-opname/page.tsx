"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Scale, ArrowLeft, Search, Check, Save, Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useInventoriStok, useStockOpname, useStockOpnameDraft } from "@/lib/preview-store";
import { formatStokBreakdown } from "@/lib/inventori-utils";
import { MOBILE_USER } from "@/lib/mobile-app-utils";
import {
  buildOpnameRowFromDraft,
  createOpnameBatchId,
  matchesOpnameSearch,
} from "@/lib/stock-opname-mobile-utils";

const OPNAME_CABANG = "Surabaya";

export default function AppStockOpnamePage() {
  const { toast } = useToast();
  const { rows } = useInventoriStok();
  const { addMany } = useStockOpname();
  const { ready, drafts, draftCount, saveItem, removeItem, clearSession } = useStockOpnameDraft(
    OPNAME_CABANG,
    MOBILE_USER,
  );

  const [search, setSearch] = useState("");
  const [fisik, setFisik] = useState<Record<string, string>>({});
  const [lastBatchId, setLastBatchId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.cabang === OPNAME_CABANG &&
          (r.kalengUtuh > 0 || r.gramTerbuka > 0) &&
          matchesOpnameSearch(r, search),
      ),
    [rows, search],
  );

  function getInputValues(itemId: string, fallbackKaleng: number, fallbackGram: number) {
    const draft = drafts[itemId];
    const kRaw = fisik[`${itemId}-k`];
    const gRaw = fisik[`${itemId}-g`];
    const kaleng = kRaw !== undefined && kRaw !== "" ? Number(kRaw) : draft?.kalengFisik ?? fallbackKaleng;
    const gram = gRaw !== undefined && gRaw !== "" ? Number(gRaw) : draft?.gramFisik ?? fallbackGram;
    return { kaleng, gram };
  }

  function handleSaveItem(itemId: string) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const { kaleng, gram } = getInputValues(itemId, item.kalengUtuh, item.gramTerbuka);
    if (Number.isNaN(kaleng) || Number.isNaN(gram) || kaleng < 0 || gram < 0) {
      toast("Isi kaleng dan gram fisik dengan angka valid", "error");
      return;
    }
    saveItem(item, kaleng, gram);
    toast(`${item.produk} tersimpan · lanjut produk lain atau kirim batch`, "success");
  }

  function handleSubmitBatch() {
    const draftList = Object.values(drafts);
    if (draftList.length === 0) {
      toast("Simpan minimal 1 produk dulu sebelum kirim ke supervisor", "error");
      return;
    }
    const tanggal = new Date().toISOString().slice(0, 10);
    const batchId = createOpnameBatchId(OPNAME_CABANG);
    const rows = draftList.map((draft, i) =>
      buildOpnameRowFromDraft(draft, {
        cabang: OPNAME_CABANG,
        tinter: MOBILE_USER,
        tanggal,
        batchId,
        seq: i + 1,
      }),
    );
    addMany(rows);
    clearSession();
    setFisik({});
    setLastBatchId(batchId);
    toast(`${rows.length} produk dikirim ke supervisor (${batchId})`, "success");
  }

  return (
    <div className="space-y-4 pb-28">
      <Link href="/app/stok" className="inline-flex items-center gap-1 text-[13px] text-brand font-semibold">
        <ArrowLeft className="h-4 w-4" /> Stok Cabang
      </Link>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-[12px] font-bold text-blue-800">Stock Opname Mingguan</p>
        <p className="text-[11px] text-blue-700 mt-0.5">
          Simpan per produk (draft) · tidak harus sekaligus. Kirim batch ke supervisor setelah selesai.
        </p>
      </div>

      {lastBatchId && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-[13px] font-bold text-green-800">Batch terkirim</p>
          <p className="text-[11px] text-green-700 mt-0.5 font-mono">{lastBatchId}</p>
          <p className="text-[11px] text-green-700">Supervisor review di dashboard Operasional → Stock Opname</p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slds-text-weak" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk atau kode AXT..."
          className="w-full pl-9 pr-3 py-2.5 border border-slds-border rounded-xl text-[14px] bg-white focus:border-brand focus:outline-none"
        />
      </div>

      {ready && draftCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
          <p className="text-[12px] text-amber-900 font-semibold">{draftCount} produk tersimpan (draft)</p>
          <p className="text-[11px] text-amber-700 shrink-0">{draftCount} siap kirim</p>
        </div>
      )}

      {!ready ? (
        <p className="text-center text-[13px] text-slds-text-weak py-6">Memuat daftar produk...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-[13px] text-slds-text-weak py-6">
          {search.trim() ? "Produk tidak ditemukan" : "Belum ada stok untuk opname"}
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const saved = drafts[item.id];
            const kVal = fisik[`${item.id}-k`] ?? (saved ? String(saved.kalengFisik) : "");
            const gVal = fisik[`${item.id}-g`] ?? (saved ? String(saved.gramFisik) : "");

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-3.5 border overflow-hidden ${
                  saved ? "border-green-300 ring-1 ring-green-100" : "border-slds-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-slds-text truncate">{item.produk}</p>
                    <p className="text-[10px] font-mono text-slds-text-weak mt-0.5">{item.kodeProduk}</p>
                  </div>
                  {saved && (
                    <span className="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                      <Check className="h-3 w-3" /> Draft
                    </span>
                  )}
                </div>

                <p className="text-[10px] font-semibold text-slds-text-weak uppercase mt-3 mb-1.5">Stok sistem</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slds-bg rounded-lg p-2 text-center min-w-0">
                    <p className="text-[10px] text-slds-text-weak uppercase font-semibold">Kaleng</p>
                    <p className="text-lg font-bold text-slds-text tabular-nums">{item.kalengUtuh}</p>
                  </div>
                  <div className="bg-brand/5 rounded-lg p-2 text-center min-w-0">
                    <p className="text-[10px] text-brand uppercase font-semibold">Gram</p>
                    <p className="text-lg font-bold text-brand tabular-nums">{item.gramTerbuka.toLocaleString("id-ID")}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slds-text-weak mt-1.5">{formatStokBreakdown(item)}</p>

                <p className="text-[10px] font-semibold text-slds-text-weak uppercase mt-3 mb-1.5">Hasil timbang fisik</p>
                <div className="grid grid-cols-2 gap-2 items-end">
                  <div className="min-w-0 flex flex-col">
                    <label className="text-[10px] font-semibold text-slds-text-weak uppercase flex items-center gap-1 min-h-[14px] mb-1">
                      <span className="inline-block w-3 h-3 shrink-0" aria-hidden />
                      Kaleng fisik
                    </label>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder={String(item.kalengUtuh)}
                      value={kVal}
                      onChange={(e) => setFisik((p) => ({ ...p, [`${item.id}-k`]: e.target.value }))}
                      className="w-full min-w-0 px-3 py-2 border border-slds-border rounded-lg text-[14px] tabular-nums"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <label className="text-[10px] font-semibold text-slds-text-weak uppercase flex items-center gap-1 min-h-[14px] mb-1">
                      <Scale className="h-3 w-3 text-brand shrink-0" aria-hidden />
                      Gram fisik
                    </label>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder={String(item.gramTerbuka)}
                      value={gVal}
                      onChange={(e) => setFisik((p) => ({ ...p, [`${item.id}-g`]: e.target.value }))}
                      className="w-full min-w-0 px-3 py-2 border border-slds-border rounded-lg text-[14px] tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    data-no-toast
                    onClick={() => handleSaveItem(item.id)}
                    className="flex-1 py-2.5 border border-brand text-brand bg-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Simpan
                  </button>
                  {saved && (
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => {
                        removeItem(item.id);
                        setFisik((p) => {
                          const next = { ...p };
                          delete next[`${item.id}-k`];
                          delete next[`${item.id}-g`];
                          return next;
                        });
                        toast("Draft dihapus", "info");
                      }}
                      className="px-3 py-2.5 border border-slds-border text-slds-text-weak rounded-xl text-[12px] font-semibold"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="fixed bottom-[4.5rem] left-0 right-0 max-w-md mx-auto px-4 z-20">
        <div className="bg-white border border-slds-border rounded-xl p-3 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-slds-text-weak">Progress draft</span>
            <span className="font-bold text-slds-text">
              {draftCount} / {items.length} produk
            </span>
          </div>
          <button
            type="button"
            data-no-toast
            onClick={handleSubmitBatch}
            disabled={draftCount === 0}
            className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Kirim ke Supervisor ({draftCount})
          </button>
          <p className="text-[10px] text-slds-text-weak text-center">
            Hanya produk yang sudah disimpan yang dikirim · sisanya bisa dilanjut nanti
          </p>
        </div>
      </div>
    </div>
  );
}

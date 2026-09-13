"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Printer, Check, PenLine, Clock, Plus, Scale } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { NotaPenjualanPreview, printNotaPenjualanPreview } from "@/components/ui/nota-penjualan-preview";
import { useNotaPrint, useTransaksiList } from "@/lib/preview-store";
import { formatDurasi, formatIDR, getHargaKategori, MOCK_KODE_WARNA } from "@/lib/mock-data";
import type { TransaksiRow } from "@/lib/mock-data";
import { findFormula } from "@/lib/kode-warna-formulas";
import { resolveFormulaNames, scaleFormulaGrams, totalGram, withAcum } from "@/lib/formula-utils";

const STEPS = ["Mobil & Warna", "Formula Bahan", "Review & Cetak"];
const VOLUME_PRESETS = [50, 100, 150, 200];

function BuatTransaksiContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const { add } = useTransaksiList();
  const { recordPrint } = useNotaPrint();
  const [trxId] = useState(() => `TRX-2026-${String(150 + Math.floor(Math.random() * 50)).padStart(4, "0")}`);

  const parentId = params.get("parent");
  const isPenambahan = !!parentId;
  const prefMobil = params.get("mobil") ?? "";
  const prefWarna = params.get("warna") ?? "Silver Metallic";

  const defaultFormula = findFormula(prefWarna) ?? findFormula("1G3")!;

  const [step, setStep] = useState(0);
  const [mobil, setMobil] = useState(prefMobil || "Toyota Avanza 2024");
  const [mfr, setMfr] = useState("Toyota");
  const [modelYear, setModelYear] = useState("2024");
  const [kodeWarna, setKodeWarna] = useState(defaultFormula.kodeWarna);
  const [warna, setWarna] = useState(defaultFormula.nama);
  const [kategori, setKategori] = useState(defaultFormula.kategori);
  const [recipeId, setRecipeId] = useState(defaultFormula.recipeId);
  const [platNomor, setPlatNomor] = useState("L 1234 ABC");
  const [noPkb, setNoPkb] = useState("");
  const [jumlahPanel, setJumlahPanel] = useState(1);
  const [noVendor, setNoVendor] = useState("VND-AXT-001");
  const [mixingVolume, setMixingVolume] = useState(defaultFormula.baseVolume);
  const [printed, setPrinted] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showNota, setShowNota] = useState(false);

  const [waktuMulai, setWaktuMulai] = useState<number | null>(null);
  const [waktuSelesaiMixing, setWaktuSelesaiMixing] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [mixingActive, setMixingActive] = useState(false);

  const [formulaBase, setFormulaBase] = useState(defaultFormula.items);
  const [gramOverrides, setGramOverrides] = useState<Record<string, number>>({});

  const scaledItems = useMemo(() => {
    const scaled = scaleFormulaGrams(formulaBase, defaultFormula.baseVolume, mixingVolume);
    return resolveFormulaNames(
      scaled.map((item) => ({
        ...item,
        gram: gramOverrides[item.kode] ?? item.gram,
      }))
    );
  }, [formulaBase, defaultFormula.baseVolume, mixingVolume, gramOverrides]);

  const formulaLines = useMemo(() => withAcum(scaledItems), [scaledItems]);
  const harga = getHargaKategori(kategori);

  useEffect(() => {
    if (step === 1 && !waktuMulai) {
      setWaktuMulai(Date.now());
      setMixingActive(true);
    }
  }, [step, waktuMulai]);

  useEffect(() => {
    if (!mixingActive) return;
    const id = setInterval(() => {
      if (waktuMulai) setElapsedSec(Math.floor((Date.now() - waktuMulai) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [mixingActive, waktuMulai]);

  function selectKodeWarna(kode: string) {
    const kw = MOCK_KODE_WARNA.find((k) => k.kode === kode);
    const formula = findFormula(kode) ?? findFormula(kw?.nama ?? "");
    if (!formula) return;
    setKodeWarna(formula.kodeWarna);
    setWarna(formula.nama);
    setKategori(formula.kategori);
    setRecipeId(formula.recipeId);
    setFormulaBase(formula.items);
    setGramOverrides({});
    setMixingVolume(formula.baseVolume);
  }

  function handleVolumeChange(vol: number) {
    setMixingVolume(vol);
    setGramOverrides({});
  }

  function finishMixing() {
    setMixingActive(false);
    setWaktuSelesaiMixing(Date.now());
    setStep(2);
  }

  function formatElapsed(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function handleCetakNota() {
    recordPrint(trxId, "Andi Wijaya", "Auto 2000 Surabaya");
    setShowNota(true);
    setPrinted(true);
    printNotaPenjualanPreview();
    toast("Nota penjualan dicetak — stok dikurangi", "success");
  }

  function handleSelesai() {
    const now = new Date();
    const mulai = waktuMulai ? new Date(waktuMulai) : now;
    const selesai = waktuSelesaiMixing ? new Date(waktuSelesaiMixing) : now;
    const durasiMixingMenit = Math.max(1, Math.round((selesai.getTime() - mulai.getTime()) / 60000));

    const row: TransaksiRow = {
      id: trxId,
      tanggal: now.toISOString().slice(0, 10),
      cabang: "Auto 2000 Surabaya",
      warna,
      kodeWarna,
      kategori,
      tinter: "Andi Wijaya",
      status: signed ? "Selesai" : "Menunggu TTD",
      total: harga,
      mobil: `${mfr} ${mobil.replace(/^Toyota\s?/i, "")} ${modelYear}`.trim(),
      platNomor,
      noPkb: noPkb || undefined,
      jumlahPanel,
      noVendor,
      mixingVolume,
      recipeId,
      waktuMulai: mulai.toISOString(),
      waktuSelesaiMixing: selesai.toISOString(),
      durasiMixingMenit,
      waktuCetakNota: printed ? new Date(mulai.getTime() + durasiMixingMenit * 60000 + 60000).toISOString() : null,
      waktuTTD: signed ? now.toISOString() : null,
      durasiTotalMenit: signed ? durasiMixingMenit + 3 : null,
      bahan: formulaLines.map((f) => ({ kode: f.kode, nama: f.nama, gram: f.gram })),
      opbId: null,
      ...(isPenambahan && parentId ? { parentId } : {}),
    };

    add(row);
    toast(`Transaksi ${trxId} tersimpan`, "success");
    router.push(`/app/transaksi/${trxId}`);
  }

  const previewTrx: TransaksiRow = {
    id: trxId,
    tanggal: new Date().toISOString().slice(0, 10),
    cabang: "Auto 2000 Surabaya",
    warna,
    kodeWarna,
    kategori,
    tinter: "Andi Wijaya",
    status: "Draft",
    total: harga,
    mobil: `${mfr} ${mobil} ${modelYear}`,
    platNomor,
    noPkb,
    jumlahPanel,
    noVendor,
    mixingVolume,
    recipeId,
    waktuMulai: new Date().toISOString(),
    waktuSelesaiMixing: null,
    durasiMixingMenit: null,
    waktuCetakNota: null,
    waktuTTD: null,
    durasiTotalMenit: null,
    bahan: formulaLines.map((f) => ({ kode: f.kode, nama: f.nama, gram: f.gram })),
    opbId: null,
  };

  return (
    <div className="space-y-4">
      {isPenambahan && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
          <Plus className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-blue-900">Penambahan Bahan</p>
            <p className="text-[11px] text-blue-800">Lanjutan transaksi {parentId} — mobil yang sama, belum di-lock</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold shrink-0
              ${i <= step ? "bg-brand text-white" : "bg-slds-bg text-slds-text-weak border border-slds-border"}`}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold hidden sm:block ${i <= step ? "text-brand" : "text-slds-text-weak"}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-slds-text-weak mx-auto" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">MFR / Merek</label>
                <input
                  value={mfr}
                  onChange={(e) => setMfr(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Tahun</label>
                <input
                  value={modelYear}
                  onChange={(e) => setModelYear(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Model Mobil</label>
              <input
                value={mobil}
                onChange={(e) => !isPenambahan && setMobil(e.target.value)}
                disabled={isPenambahan}
                className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none disabled:bg-slds-bg"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Kode Warna</label>
              <select
                value={kodeWarna}
                onChange={(e) => selectKodeWarna(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none"
              >
                {MOCK_KODE_WARNA.map((k) => (
                  <option key={k.kode} value={k.kode}>
                    {k.kode} — {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">No. Polisi</label>
                <input
                  value={platNomor}
                  onChange={(e) => setPlatNomor(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">No. PKB</label>
                <input
                  value={noPkb}
                  onChange={(e) => setNoPkb(e.target.value)}
                  placeholder="PKB-2026-xxxx"
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Jumlah Panel</label>
                <input
                  type="number"
                  min={1}
                  value={jumlahPanel}
                  onChange={(e) => setJumlahPanel(Number(e.target.value) || 1)}
                  className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Recipe ID</label>
                <div className="mt-1 px-3 py-2 bg-slds-bg border border-slds-border rounded-lg text-[13px] font-mono">{recipeId}</div>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Kategori Harga (Bogor)</label>
              <div className="mt-1 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[14px] font-bold text-amber-800">
                {kategori} — {formatIDR(harga)}/L
              </div>
            </div>
          </div>
          <button
            type="button"
            data-no-toast
            onClick={() => setStep(1)}
            className="w-full py-3.5 bg-brand text-white rounded-xl font-bold text-[14px]"
          >
            Mulai Mixing — Formula Bahan
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="bg-brand text-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase opacity-80 font-semibold">Durasi Mixing</p>
                <p className="text-2xl font-bold tabular-nums">{formatElapsed(elapsedSec)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-80 font-semibold flex items-center gap-1 justify-end">
                <Scale className="h-3 w-3" /> Volume
              </p>
              <p className="text-lg font-bold">{mixingVolume}G</p>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {VOLUME_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                data-no-toast
                onClick={() => handleVolumeChange(v)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border ${
                  mixingVolume === v ? "bg-brand text-white border-brand" : "bg-white border-slds-border text-slds-text"
                }`}
              >
                {v}G
              </button>
            ))}
            <input
              type="number"
              value={mixingVolume}
              onChange={(e) => handleVolumeChange(Number(e.target.value) || 50)}
              className="w-16 px-2 py-1.5 border border-slds-border rounded-lg text-[12px] text-center font-bold"
            />
          </div>

          <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
            <div className="px-4 py-2.5 bg-slds-bg border-b border-slds-border flex justify-between items-center">
              <div>
                <p className="text-[12px] font-bold text-slds-text">{warna}</p>
                <p className="text-[10px] text-slds-text-weak font-mono">{recipeId}</p>
              </div>
              <p className="text-[11px] font-bold text-brand">Target: {totalGram(formulaLines)}G</p>
            </div>
            <div className="grid grid-cols-[1fr_1fr_72px_72px] gap-0 px-3 py-2 bg-gray-50 border-b border-slds-border text-[10px] font-bold text-slds-text-weak uppercase">
              <span>Toner</span>
              <span>Nama</span>
              <span className="text-right">Weight</span>
              <span className="text-right text-brand">ACUM</span>
            </div>
            {formulaLines.map((f, idx) => (
              <div
                key={f.kode}
                className={`grid grid-cols-[1fr_1fr_72px_72px] gap-0 px-3 py-2.5 border-b border-slds-border last:border-0 items-center ${
                  idx === formulaLines.length - 1 ? "bg-brand/5" : ""
                }`}
              >
                <p className="text-[12px] font-bold font-mono text-slds-text">{f.kode}</p>
                <p className="text-[10px] text-slds-text-weak truncate pr-1">{f.nama.replace(/^AXT-\d+\s/, "")}</p>
                <input
                  type="number"
                  step="0.1"
                  value={f.gram}
                  onChange={(e) => setGramOverrides((prev) => ({ ...prev, [f.kode]: Number(e.target.value) || 0 }))}
                  className="w-full px-1.5 py-1 border border-slds-border rounded text-[13px] text-right font-bold tabular-nums"
                />
                <p className="text-[14px] font-bold text-brand text-right tabular-nums">{f.acum}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slds-text-weak text-center px-2">
            Tuang bahan sambil lihat kolom ACUM di timbangan — referensi YATU formula app
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              data-no-toast
              onClick={() => {
                setStep(0);
                setMixingActive(false);
                setWaktuMulai(null);
                setElapsedSec(0);
              }}
              className="flex-1 py-3 border border-slds-border rounded-xl text-[14px] font-semibold"
            >
              Kembali
            </button>
            <button type="button" data-no-toast onClick={finishMixing} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
              Selesai Mixing
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-[11px] text-green-800 font-semibold uppercase">Durasi Mixing Tercatat</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatDurasi(waktuMulai && waktuSelesaiMixing ? Math.max(1, Math.round((waktuSelesaiMixing - waktuMulai) / 60000)) : null)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slds-border space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Mobil</span>
              <span className="font-semibold">{mfr} {mobil} {modelYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Warna</span>
              <span className="font-semibold">{kodeWarna} — {warna}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Total Bahan</span>
              <span className="font-semibold">{totalGram(formulaLines)} gr</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slds-border font-bold">
              <span>Total Tagihan</span>
              <span className="text-brand">{formatIDR(harga)}</span>
            </div>
          </div>

          {showNota && (
            <div className="overflow-x-auto -mx-1">
              <NotaPenjualanPreview trx={previewTrx} className="min-w-[320px] shadow-sm" />
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-[12px] font-bold text-red-800">Wajib cetak nota penjualan sebelum selesai</p>
          </div>

          {!printed ? (
            <button
              type="button"
              data-no-toast
              onClick={handleCetakNota}
              className="w-full py-3.5 bg-slds-text text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" /> Cetak Nota Penjualan
            </button>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800">✓ Nota tercetak</div>
              {!signed ? (
                <button
                  type="button"
                  data-no-toast
                  onClick={() => {
                    setSigned(true);
                    toast("DocuMatrix TTD berhasil", "success");
                  }}
                  className="w-full py-3 border-2 border-brand text-brand rounded-xl font-bold text-[14px] flex items-center justify-center gap-2"
                >
                  <PenLine className="h-4 w-4" /> DocuMatrix — TTD Kepala Bengkel
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800">✓ Ditandatangani kepala bengkel</div>
              )}
              {signed && (
                <button type="button" data-no-toast onClick={handleSelesai} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
                  Selesaikan Transaksi
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function BuatTransaksiPage() {
  return (
    <Suspense fallback={<div className="p-4 text-[13px] text-slds-text-weak">Memuat...</div>}>
      <BuatTransaksiContent />
    </Suspense>
  );
}

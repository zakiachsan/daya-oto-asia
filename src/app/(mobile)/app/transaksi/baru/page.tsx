"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Printer, Check, PenLine, Clock, Plus, Scale, Camera, Tag, Save, Bookmark, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { NotaPenjualanPreview, printNotaPenjualanPreview } from "@/components/ui/nota-penjualan-preview";
import { LabelCatPreview, printLabelCatPreview } from "@/components/ui/label-cat-preview";
import { useExtraKodeWarna, useNotaPrint, useSavedFormulas, useTransaksiList } from "@/lib/preview-store";
import { formatDurasi, formatIDR, getHargaKategori, MOCK_KODE_WARNA } from "@/lib/mock-data";
import type { TransaksiLayer, TransaksiRow } from "@/lib/mock-data";
import { findFormula } from "@/lib/kode-warna-formulas";
import { resolveFormulaNames, scaleFormulaGrams, totalGram, withAcum } from "@/lib/formula-utils";
import { PRODUK_KATEGORI, type ProdukKategoriId, type TransaksiStatus } from "@/lib/transaksi-status-utils";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";
import {
  applySavedFormula,
  captureFormulaForSave,
  defaultFormulaLabel,
  type LayerFormulaItem,
  type SavedFormulaRow,
} from "@/lib/saved-formula-utils";
import { findAxtProduct } from "@/lib/formula-utils";
import { TonerPickerModal } from "@/components/mobile/toner-picker-modal";
import { buildDraftWizardSnapshot, hydrateDraftWizard } from "@/lib/transaksi-draft-utils";

const STEPS = ["Mobil & Produk", "Mixing", "Foto & Nota"];
const VOLUME_PRESETS = [50, 100, 150, 200];

function createTrxId() {
  return `TRX-2026-${String(150 + Math.floor(Math.random() * 50)).padStart(4, "0")}`;
}

function layerTypeLabel(layer: number) {
  if (layer === 1) return "Warna standar";
  if (layer === 2) return "Xyralic / pearl";
  return `Layer ${layer}`;
}

function DraftSaveSection({ onSave, disabled }: { onSave: () => void; disabled?: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-slds-border bg-slds-bg/60 p-3 space-y-2">
      <p className="text-[11px] text-slds-text-weak text-center leading-snug">
        Simpan draft untuk betulkan lagi nanti · tambah toner, thinner, atau bahan lain sebelum cetak nota.
      </p>
      <button
        type="button"
        data-no-toast
        onClick={onSave}
        disabled={disabled}
        className="w-full py-2.5 border border-brand text-brand bg-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <Save className="h-4 w-4" /> Simpan Draft
      </button>
    </div>
  );
}

function BuatTransaksiContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const { add, all, ready } = useTransaksiList();
  const draftLoadedRef = useRef(false);
  const { recordPrint } = useNotaPrint();
  const { items: savedFormulas, save: saveFormula, remove: removeSavedFormula } = useSavedFormulas(MOBILE_USER);
  const { items: persistedExtraKodes, add: addExtraKode, merge: mergeExtraKodes } = useExtraKodeWarna();
  const draftId = params.get("draft");
  const isResumingDraft = !!draftId;
  const parentId = params.get("parent");
  const isPenambahan = !!parentId;
  const [trxId, setTrxId] = useState("");

  useEffect(() => {
    if (draftId) {
      setTrxId(draftId);
      return;
    }
    setTrxId(createTrxId());
  }, [draftId]);

  useEffect(() => {
    if (!ready || !draftId || draftLoadedRef.current) return;
    const trx = all.find((t) => t.id === draftId);
    if (!trx) {
      toast("Draft tidak ditemukan", "error");
      return;
    }
    if (trx.status !== "Draft") {
      toast("Transaksi ini bukan draft", "error");
      router.replace(`/app/transaksi/${draftId}`);
      return;
    }
    draftLoadedRef.current = true;
    const h = hydrateDraftWizard(trx);
    setKodeWarna(trx.kodeWarna);
    setWarna(trx.warna);
    setKategori(trx.kategori);
    setRecipeId(trx.recipeId ?? `RCP-${trx.kodeWarna}-50G`);
    setPlatNomor(trx.platNomor);
    setNoPkb(trx.noPkb ?? "");
    setJumlahPanel(trx.jumlahPanel ?? 1);
    setStep(h.step);
    setMfr(h.mfr);
    setModelYear(h.modelYear);
    setMobil(h.mobil);
    setProdukKategori(h.produkKategori);
    setMixingVolume(h.mixingVolume);
    setLayerCount(h.layerCount);
    setActiveLayer(h.activeLayer);
    setLayerFormulas(h.layerFormulas);
    setGramOverrides(h.gramOverrides);
    setFotoSample(h.fotoSample);
    setWaktuMulai(h.waktuMulai);
    setWaktuSelesaiMixing(h.waktuSelesaiMixing);
    setMixingActive(h.mixingActive);
    setElapsedSec(h.elapsedSec);
    toast(`Draft ${draftId} dimuat · lanjutkan pekerjaan`, "info");
  }, [ready, draftId, all, toast, router]);
  const prefMobil = params.get("mobil") ?? "";
  const prefWarna = params.get("warna") ?? "Silver Metallic";

  const defaultFormula = findFormula(prefWarna) ?? findFormula("1G3")!;

  const [step, setStep] = useState(0);
  const [mobil, setMobil] = useState(prefMobil || "Avanza");
  const [mfr, setMfr] = useState("Toyota");
  const [modelYear, setModelYear] = useState("2024");
  const [kodeWarna, setKodeWarna] = useState(defaultFormula.kodeWarna);
  const [warna, setWarna] = useState(defaultFormula.nama);
  const [kategori, setKategori] = useState(defaultFormula.kategori);
  const [recipeId, setRecipeId] = useState(defaultFormula.recipeId);
  const [platNomor, setPlatNomor] = useState("L 1234 ABC");
  const [noPkb, setNoPkb] = useState("");
  const [jumlahPanel, setJumlahPanel] = useState(1);
  const [produkKategori, setProdukKategori] = useState<ProdukKategoriId>("basecoat");
  const [mixingVolume, setMixingVolume] = useState(defaultFormula.baseVolume);
  const [layerCount, setLayerCount] = useState(1);
  const [activeLayer, setActiveLayer] = useState(1);
  const [printed, setPrinted] = useState(false);
  const [signed, setSigned] = useState(false);
  const [fotoSample, setFotoSample] = useState(false);
  const [showNota, setShowNota] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [showSaveFormulaModal, setShowSaveFormulaModal] = useState(false);
  const [showTonerPicker, setShowTonerPicker] = useState(false);
  const [formulaLabel, setFormulaLabel] = useState("");
  const [formulaCatatan, setFormulaCatatan] = useState("");
  const [loadedFormulaId, setLoadedFormulaId] = useState<string | null>(null);

  const [waktuMulai, setWaktuMulai] = useState<number | null>(null);
  const [waktuSelesaiMixing, setWaktuSelesaiMixing] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [mixingActive, setMixingActive] = useState(false);

  const [layerFormulas, setLayerFormulas] = useState<Record<number, LayerFormulaItem[]>>({
    1: defaultFormula.items,
    2: defaultFormula.items,
    3: defaultFormula.items,
  });
  const [gramOverrides, setGramOverrides] = useState<Record<string, number>>({});

  const kodeOptions = useMemo(
    () => [
      ...MOCK_KODE_WARNA,
      ...persistedExtraKodes.map((k) => ({ kode: k.kode, nama: k.nama, kategori: "Special" as const })),
    ],
    [persistedExtraKodes],
  );

  const savedForKode = useMemo(
    () => savedFormulas.filter((f) => f.kodeWarna === kodeWarna),
    [savedFormulas, kodeWarna],
  );

  const formulaBase = layerFormulas[activeLayer] ?? defaultFormula.items;

  const scaledItems = useMemo(() => {
    const customNames = Object.fromEntries(
      (layerFormulas[activeLayer] ?? []).filter((b) => b.nama).map((b) => [b.kode, b.nama!]),
    );
    const scaled = scaleFormulaGrams(formulaBase, defaultFormula.baseVolume, mixingVolume);
    return resolveFormulaNames(
      scaled.map((item) => ({
        ...item,
        gram: gramOverrides[`${activeLayer}-${item.kode}`] ?? item.gram,
      })),
    ).map((item) => ({
      ...item,
      nama: customNames[item.kode] ?? item.nama,
    }));
  }, [formulaBase, defaultFormula.baseVolume, mixingVolume, gramOverrides, activeLayer, layerFormulas]);

  const formulaLines = useMemo(() => withAcum(scaledItems), [scaledItems]);
  const harga = getHargaKategori(kategori);
  const mobilLabel = `${mfr} ${mobil.replace(/^Toyota\s?/i, "")}${modelYear ? ` ${modelYear}` : ""}`.trim();

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

  function validateStep0() {
    if (!mfr.trim()) {
      toast("Merk wajib diisi", "error");
      return false;
    }
    if (!mobil.trim()) {
      toast("Model wajib diisi", "error");
      return false;
    }
    if (!kodeWarna.trim()) {
      toast("Kode warna wajib diisi", "error");
      return false;
    }
    if (!platNomor.trim()) {
      toast("No. polisi wajib diisi", "error");
      return false;
    }
    if (jumlahPanel < 1) {
      toast("Jumlah panel wajib diisi", "error");
      return false;
    }
    return true;
  }

  function selectKodeWarna(kode: string) {
    const kw = kodeOptions.find((k) => k.kode === kode);
    const formula = findFormula(kode) ?? findFormula(kw?.nama ?? "");
    setLoadedFormulaId(null);
    if (!formula) {
      if (!kw) return;
      setKodeWarna(kw.kode);
      setWarna(kw.nama);
      setKategori(kw.kategori ?? "Special");
      setRecipeId(`RCP-${kw.kode}-50G`);
      setLayerFormulas({ 1: [{ kode: "AXT-207", gram: 0 }], 2: [{ kode: "AXT-207", gram: 0 }], 3: [{ kode: "AXT-207", gram: 0 }] });
      setGramOverrides({});
      setMixingVolume(50);
      return;
    }
    setKodeWarna(formula.kodeWarna);
    setWarna(formula.nama);
    setKategori(formula.kategori);
    setRecipeId(formula.recipeId);
    setLayerFormulas({ 1: formula.items, 2: formula.items, 3: formula.items });
    setGramOverrides({});
    setMixingVolume(formula.baseVolume);
  }

  function loadSavedFormula(saved: SavedFormulaRow) {
    const applied = applySavedFormula(saved);
    setKodeWarna(applied.kodeWarna);
    setWarna(applied.namaWarna);
    setKategori(applied.kategori);
    setRecipeId(applied.recipeId);
    setLayerCount(applied.layerCount);
    setActiveLayer(1);
    setLayerFormulas(applied.layerFormulas);
    setGramOverrides(applied.gramOverrides);
    setMixingVolume(applied.mixingVolume);
    setLoadedFormulaId(saved.id);
    mergeExtraKodes(applied.extraKodes);
    toast(`Formula "${saved.label}" dimuat`, "success");
  }

  function openSaveFormulaModal() {
    setFormulaLabel(defaultFormulaLabel(kodeWarna, warna));
    setFormulaCatatan("");
    setShowSaveFormulaModal(true);
  }

  function handleSaveFormula() {
    if (!formulaLabel.trim()) {
      toast("Nama formula wajib diisi", "error");
      return;
    }
    const captured = captureFormulaForSave({
      layerCount,
      mixingVolume,
      formulaBaseVolume: defaultFormula.baseVolume,
      layerFormulas,
      gramOverrides,
    });
    const row: SavedFormulaRow = {
      id: loadedFormulaId ?? `FM-${Date.now()}`,
      kodeWarna,
      namaWarna: warna,
      kategori,
      label: formulaLabel.trim(),
      catatan: formulaCatatan.trim() || undefined,
      tinter: MOBILE_USER,
      disimpan: new Date().toISOString(),
      ...captured,
    };
    saveFormula(row);
    mergeExtraKodes(
      captured.layers
        .flatMap((l) => l.items)
        .filter((i) => !findAxtProduct(i.kode))
        .map((i) => ({ kode: i.kode, nama: i.nama })),
    );
    setLoadedFormulaId(row.id);
    setShowSaveFormulaModal(false);
    toast(`Formula "${row.label}" tersimpan · bisa dipakai lagi`, "success");
  }

  function handleVolumeChange(vol: number) {
    setMixingVolume(vol);
    setGramOverrides({});
  }

  function addCustomKode() {
    const kode = prompt("Kode warna baru (mis. 2XY):");
    if (!kode?.trim()) return;
    const nama = prompt("Nama warna:") ?? kode;
    const normalized = kode.trim().toUpperCase();
    addExtraKode({ kode: normalized, nama: nama.trim() });
    selectKodeWarna(normalized);
    toast("Kode warna ditambahkan ke daftar", "success");
  }

  function addTonerFromPicker(product: { kode: string; nama: string }) {
    const existing = (layerFormulas[activeLayer] ?? []).map((i) => i.kode);
    if (existing.includes(product.kode)) {
      toast("Toner sudah ada di layer ini", "error");
      return;
    }
    setLayerFormulas((prev) => ({
      ...prev,
      [activeLayer]: [...(prev[activeLayer] ?? []), { kode: product.kode, nama: product.nama, gram: 0 }],
    }));
    toast(`${product.kode} ditambahkan`, "success");
  }

  const activeLayerTonerKodes = useMemo(
    () => (layerFormulas[activeLayer] ?? []).map((i) => i.kode),
    [layerFormulas, activeLayer],
  );

  const isBasecoat = produkKategori === "basecoat";

  function addLayer() {
    if (!isBasecoat || layerCount >= 3) return;
    const next = layerCount + 1;
    setLayerCount(next);
    setActiveLayer(next);
    toast(`Layer ${next} ditambahkan · ${layerTypeLabel(next)}`, "info");
  }

  function buildLayers(): TransaksiLayer[] {
    const count = isBasecoat ? layerCount : 1;
    return Array.from({ length: count }, (_, i) => {
      const layer = i + 1;
      const base = layerFormulas[layer] ?? defaultFormula.items;
      const scaled = scaleFormulaGrams(base, defaultFormula.baseVolume, mixingVolume);
      const customNames = Object.fromEntries(base.filter((b) => b.nama).map((b) => [b.kode, b.nama!]));
      const items = resolveFormulaNames(
        scaled.map((item) => ({
          ...item,
          gram: gramOverrides[`${layer}-${item.kode}`] ?? item.gram,
        })),
      ).map((item) => ({
        ...item,
        nama: customNames[item.kode] ?? item.nama,
      }));
      return {
        layer,
        label: layerTypeLabel(layer),
        bahan: items.map((f) => ({ kode: f.kode, nama: f.nama, gram: f.gram })),
      };
    });
  }

  function buildRow(status: TransaksiStatus): TransaksiRow {
    const now = new Date();
    const mulai = waktuMulai ? new Date(waktuMulai) : now;
    const selesai = waktuSelesaiMixing ? new Date(waktuSelesaiMixing) : now;
    const durasiMixingMenit = Math.max(1, Math.round((selesai.getTime() - mulai.getTime()) / 60000));
    const layers = buildLayers();
    const bahan = layers.flatMap((l) => l.bahan);

    return {
      id: trxId,
      receiptId: trxId,
      tanggal: now.toISOString().slice(0, 10),
      cabang: MOBILE_CABANG,
      warna,
      kodeWarna,
      kategori,
      produkKategori,
      layers: isBasecoat && layerCount > 1 ? layers : undefined,
      tinter: MOBILE_USER,
      status,
      total: harga,
      mobil: mobilLabel,
      platNomor,
      noPkb: noPkb || undefined,
      jumlahPanel,
      mixingVolume,
      recipeId,
      fotoSample,
      waktuMulai: mulai.toISOString(),
      waktuSelesaiMixing: waktuSelesaiMixing ? selesai.toISOString() : null,
      durasiMixingMenit: waktuSelesaiMixing ? durasiMixingMenit : null,
      waktuCetakNota: printed ? now.toISOString() : null,
      waktuTTD: signed ? now.toISOString() : null,
      durasiTotalMenit: signed ? durasiMixingMenit + 3 : null,
      bahan,
      opbId: null,
      draftWizard: buildDraftWizardSnapshot({
        step,
        layerCount,
        activeLayer,
        layerFormulas,
        gramOverrides,
        mfr,
        modelYear,
        mobil,
        produkKategori,
        mixingVolume,
        fotoSample,
        waktuMulai,
        waktuSelesaiMixing,
      }),
      ...(isPenambahan && parentId ? { parentId } : {}),
    };
  }

  function handleSaveDraft() {
    if (!trxId) return;
    if (step === 0 && !validateStep0()) return;
    add(buildRow("Draft"));
    toast(`Draft ${trxId} tersimpan · bisa lanjut edit atau buka dari daftar transaksi`, "success");
  }

  function backToMixing() {
    setStep(1);
    setMixingActive(true);
    setWaktuSelesaiMixing(null);
    if (waktuMulai) {
      setElapsedSec(Math.floor((Date.now() - waktuMulai) / 1000));
    }
    toast("Kembali ke mixing · tambah atau ubah bahan", "info");
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
    if (!fotoSample) {
      toast("Foto sample plat wajib diambil sebelum cetak nota", "error");
      return;
    }
    recordPrint(trxId, MOBILE_USER, MOBILE_CABANG);
    setShowNota(true);
    setPrinted(true);
    printNotaPenjualanPreview();
    toast("Nota penjualan dicetak · stok dikurangi", "success");
  }

  function handleSelesai() {
    if (!trxId) return;
    const status: TransaksiStatus = signed ? "Menunggu OPB" : printed ? "Cetak Nota" : "Draft";
    add(buildRow(status));
    toast(`Transaksi ${trxId} → ${status}`, "success");
    router.push(`/app/transaksi/${trxId}`);
  }

  const previewTrx = trxId
    ? buildRow(printed ? (signed ? "Menunggu OPB" : "Cetak Nota") : "Draft")
    : null;

  return (
    <div className="space-y-4">
      <div className="bg-brand/10 border border-brand/20 rounded-xl px-3 py-2">
        <p className="text-[10px] font-bold uppercase text-brand">Receipt ID</p>
        <p className="text-[13px] font-mono font-bold text-slds-text">{trxId || "…"}</p>
        {isResumingDraft && (
          <p className="text-[10px] text-brand font-semibold mt-1">Melanjutkan draft tersimpan</p>
        )}
      </div>

      {isPenambahan && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
          <Plus className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-blue-900">Penambahan Bahan</p>
            <p className="text-[11px] text-blue-800">Lanjutan transaksi {parentId}</p>
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
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Kategori Produk</label>
              <select
                value={produkKategori}
                onChange={(e) => setProdukKategori(e.target.value as ProdukKategoriId)}
                className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none"
              >
                {PRODUK_KATEGORI.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Merk *</label>
                <input value={mfr} onChange={(e) => setMfr(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Tahun</label>
                <input value={modelYear} onChange={(e) => setModelYear(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Model *</label>
              <input value={mobil} onChange={(e) => !isPenambahan && setMobil(e.target.value)} disabled={isPenambahan} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none disabled:bg-slds-bg" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Kode Warna *</label>
                <button type="button" data-no-toast onClick={addCustomKode} className="text-[11px] font-bold text-brand flex items-center gap-0.5">
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              </div>
              <select value={kodeWarna} onChange={(e) => selectKodeWarna(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] focus:border-brand focus:outline-none">
                {kodeOptions.map((k) => (
                  <option key={k.kode} value={k.kode}>{k.kode} · {k.nama}</option>
                ))}
              </select>
            </div>
            {savedForKode.length > 0 && (
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 space-y-2">
                <p className="text-[11px] font-bold uppercase text-brand flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" /> Formula Tersimpan ({savedForKode.length})
                </p>
                {savedForKode.map((f) => (
                  <div key={f.id} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-slds-border">
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => loadSavedFormula(f)}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-[12px] font-bold text-slds-text truncate">{f.label}</p>
                      <p className="text-[10px] text-slds-text-weak mt-0.5">
                        {f.layerCount} layer · {f.baseVolume}G · {f.layers.reduce((s, l) => s + l.items.length, 0)} toner
                      </p>
                    </button>
                    <button
                      type="button"
                      data-no-toast
                      onClick={() => { removeSavedFormula(f.id); toast("Formula dihapus", "info"); }}
                      className="p-1 text-slds-text-weak hover:text-red-600 shrink-0"
                      aria-label="Hapus formula"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {loadedFormulaId && (
              <p className="text-[11px] text-brand font-semibold bg-brand/10 rounded-lg px-3 py-2">
                ✓ Formula tersimpan dimuat · edit di step Mixing lalu simpan ulang jika perlu
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">No. Polisi *</label>
                <input value={platNomor} onChange={(e) => setPlatNomor(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">No. PKB</label>
                <input value={noPkb} onChange={(e) => setNoPkb(e.target.value)} placeholder="Opsional" className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Jumlah Panel *</label>
                <input type="number" min={1} value={jumlahPanel} onChange={(e) => setJumlahPanel(Number(e.target.value) || 1)} className="w-full mt-1 px-3 py-2 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Recipe ID</label>
                <div className="mt-1 px-3 py-2 bg-slds-bg border border-slds-border rounded-lg text-[13px] font-mono">{recipeId}</div>
              </div>
            </div>
          </div>
          <button type="button" data-no-toast onClick={() => validateStep0() && setStep(1)} className="w-full py-3.5 bg-brand text-white rounded-xl font-bold text-[14px]">
            Mulai Mixing
          </button>
          <DraftSaveSection onSave={handleSaveDraft} disabled={!trxId} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          {isBasecoat && (
            <div className="bg-white rounded-xl p-3 border border-slds-border space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase text-slds-text-weak">
                  Basecoat · {layerCount} layer
                </p>
                {layerCount < 3 && (
                  <button
                    type="button"
                    data-no-toast
                    onClick={addLayer}
                    className="text-[11px] font-bold text-brand flex items-center gap-0.5 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Layer
                  </button>
                )}
              </div>
              {layerCount > 1 ? (
                <div className="flex gap-1">
                  {Array.from({ length: layerCount }, (_, i) => i + 1).map((l) => (
                    <button
                      key={l}
                      type="button"
                      data-no-toast
                      onClick={() => setActiveLayer(l)}
                      className={`flex-1 py-2 rounded-lg text-[11px] font-bold border transition-colors
                        ${activeLayer === l
                          ? "bg-brand/15 text-brand border-brand/30"
                          : "bg-slds-bg text-slds-text-weak border-transparent"}`}
                    >
                      <span className="block">Layer {l}</span>
                      <span className="block text-[9px] font-semibold opacity-80 mt-0.5">{layerTypeLabel(l)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slds-text-weak">Layer 1 · Warna standar</p>
              )}
            </div>
          )}

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
              <button key={v} type="button" data-no-toast onClick={() => handleVolumeChange(v)} className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border ${mixingVolume === v ? "bg-brand text-white border-brand" : "bg-white border-slds-border text-slds-text"}`}>
                {v}G
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slds-border overflow-hidden">
            <div className="px-4 py-2.5 bg-slds-bg border-b border-slds-border flex justify-between items-center">
              <p className="text-[12px] font-bold text-slds-text">
                {warna}
                {isBasecoat && layerCount > 1 ? ` · Layer ${activeLayer} (${layerTypeLabel(activeLayer)})` : ""}
              </p>
              <p className="text-[11px] font-bold text-brand">Target: {totalGram(formulaLines)}G</p>
            </div>
            {formulaLines.map((f, idx) => (
              <div key={`${activeLayer}-${f.kode}-${idx}`} className="grid grid-cols-[1fr_1fr_72px_72px] gap-0 px-3 py-2.5 border-b border-slds-border last:border-0 items-center">
                <p className="text-[12px] font-bold font-mono">{f.kode}</p>
                <p className="text-[10px] text-slds-text-weak truncate">{f.nama.replace(/^AXT-\d+\s/, "")}</p>
                <input
                  type="number"
                  step="0.1"
                  value={f.gram}
                  onChange={(e) => setGramOverrides((prev) => ({ ...prev, [`${activeLayer}-${f.kode}`]: Number(e.target.value) || 0 }))}
                  className="w-full px-1.5 py-1 border border-slds-border rounded text-[13px] text-right font-bold"
                />
                <p className="text-[14px] font-bold text-brand text-right">{f.acum}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-no-toast
            onClick={() => setShowTonerPicker(true)}
            className="w-full py-2.5 border-2 border-dashed border-brand text-brand rounded-xl font-semibold text-[13px] flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" /> Tambah Toner
          </button>

          <button
            type="button"
            data-no-toast
            onClick={openSaveFormulaModal}
            className="w-full py-2.5 bg-white border border-brand text-brand rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5"
          >
            <Bookmark className="h-4 w-4" /> Simpan Formula
          </button>

          <div className="flex gap-2">
            <button type="button" data-no-toast onClick={() => { setStep(0); setMixingActive(false); setWaktuMulai(null); setElapsedSec(0); }} className="flex-1 py-3 border border-slds-border rounded-xl text-[14px] font-semibold">
              Kembali
            </button>
            <button type="button" data-no-toast onClick={finishMixing} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
              Selesai Mixing
            </button>
          </div>
          <DraftSaveSection onSave={handleSaveDraft} disabled={!trxId} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          {!printed && (
            <button
              type="button"
              data-no-toast
              onClick={backToMixing}
              className="w-full py-2.5 border border-slds-border bg-white rounded-xl text-[13px] font-semibold text-slds-text"
            >
              ← Kembali ke Mixing (tambah / ubah bahan)
            </button>
          )}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-[11px] text-green-800 font-semibold uppercase">Durasi Mixing</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatDurasi(waktuMulai && waktuSelesaiMixing ? Math.max(1, Math.round((waktuSelesaiMixing - waktuMulai) / 60000)) : null)}
            </p>
          </div>

          <button
            type="button"
            data-no-toast
            onClick={() => { setFotoSample(true); toast("Foto sample plat tersimpan", "success"); }}
            className={`w-full py-3 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 border-2 ${fotoSample ? "border-green-300 bg-green-50 text-green-800" : "border-slds-border bg-white"}`}
          >
            <Camera className="h-4 w-4" /> {fotoSample ? "Foto Sample ✓" : "Ambil Foto Sample Plat *"}
          </button>

          <button
            type="button"
            data-no-toast
            onClick={() => { setShowLabel(true); printLabelCatPreview(); toast("Label dicetak", "success"); }}
            className="w-full py-3 border border-brand text-brand rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 bg-white"
          >
            <Tag className="h-4 w-4" /> Print Label Cat
          </button>

          {showLabel && previewTrx && <LabelCatPreview trx={previewTrx} className="mx-auto" />}

          {showNota && previewTrx && (
            <div className="overflow-x-auto -mx-1">
              <NotaPenjualanPreview trx={previewTrx} className="min-w-[320px] shadow-sm" />
            </div>
          )}

          {!printed ? (
            <button type="button" data-no-toast onClick={handleCetakNota} className="w-full py-3.5 bg-slds-text text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2">
              <Printer className="h-4 w-4" /> Cetak Nota Penjualan
            </button>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800">✓ Nota tercetak · status: Cetak Nota</div>
              {!signed ? (
                <button type="button" data-no-toast onClick={() => { setSigned(true); toast("TTD GH berhasil", "success"); }} className="w-full py-3 border-2 border-brand text-brand rounded-xl font-bold text-[14px] flex items-center justify-center gap-2">
                  <PenLine className="h-4 w-4" /> TTD GH (Group Head Vendor)
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[12px] text-green-800">✓ Ditandatangani GH</div>
              )}
              {signed && (
                <button type="button" data-no-toast onClick={handleSelesai} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
                  Kirim · Menunggu OPB
                </button>
              )}
            </>
          )}
          {!printed && <DraftSaveSection onSave={handleSaveDraft} disabled={!trxId} />}
        </div>
      )}

      <TonerPickerModal
        open={showTonerPicker}
        onClose={() => setShowTonerPicker(false)}
        onSelect={addTonerFromPicker}
        existingKodes={activeLayerTonerKodes}
        layerLabel={layerCount > 1 ? `Layer ${activeLayer}` : undefined}
      />

      {showSaveFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 pb-8 sm:pb-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-slds-text">Simpan Formula</h2>
                <p className="text-[12px] text-slds-text-weak mt-1">
                  Simpan kombinasi toner + gram untuk dipakai lagi di pekerjaan berikutnya.
                </p>
              </div>
              <button type="button" data-no-toast onClick={() => setShowSaveFormulaModal(false)} className="p-1 text-slds-text-weak">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slds-bg rounded-lg p-3 mb-3 text-[11px] text-slds-text-weak space-y-1">
              <p><span className="font-semibold text-slds-text">Kode:</span> {kodeWarna} · {warna}</p>
              <p><span className="font-semibold text-slds-text">Layer:</span> {layerCount} · Volume referensi: {defaultFormula.baseVolume}G</p>
              <p>
                <span className="font-semibold text-slds-text">Toner:</span>{" "}
                {Array.from({ length: layerCount }, (_, i) => {
                  const layer = i + 1;
                  const count = (layerFormulas[layer] ?? []).length;
                  return layerCount > 1 ? `L${layer}: ${count}` : `${count} item`;
                }).join(" · ")}
              </p>
            </div>

            <label className="block mb-3">
              <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Nama formula *</span>
              <input
                value={formulaLabel}
                onChange={(e) => setFormulaLabel(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[13px] focus:border-brand focus:outline-none"
                placeholder="Mis. 1G3 extra silver Sunter"
              />
            </label>
            <label className="block mb-4">
              <span className="text-[11px] font-semibold text-slds-text-weak uppercase">Catatan (opsional)</span>
              <textarea
                value={formulaCatatan}
                onChange={(e) => setFormulaCatatan(e.target.value)}
                rows={2}
                className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[13px] resize-none focus:border-brand focus:outline-none"
                placeholder="Mis. Hasil match plat customer X"
              />
            </label>

            <div className="flex gap-2">
              <button type="button" data-no-toast onClick={() => setShowSaveFormulaModal(false)} className="flex-1 py-2.5 border border-slds-border rounded-xl font-semibold text-[13px]">
                Batal
              </button>
              <button type="button" data-no-toast onClick={handleSaveFormula} className="flex-1 py-2.5 bg-brand text-white rounded-xl font-bold text-[13px]">
                Simpan
              </button>
            </div>
          </div>
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

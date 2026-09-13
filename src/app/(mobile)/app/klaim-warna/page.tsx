"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Palette, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { MOCK_KODE_WARNA } from "@/lib/mock-data";
import { useKlaimWarna } from "@/lib/preview-store";
import { klaimStatusBadge } from "@/lib/klaim-utils";
import { MOBILE_USER, MOBILE_CABANG } from "@/lib/mobile-app-utils";

function KlaimWarnaContent() {
  const params = useSearchParams();
  const { toast } = useToast();
  const { items, add } = useKlaimWarna();
  const [showForm, setShowForm] = useState(false);
  const [kodeWarna, setKodeWarna] = useState("1G3");
  const [platNomor, setPlatNomor] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [catatan, setCatatan] = useState("");

  const warna = MOCK_KODE_WARNA.find((k) => k.kode === kodeWarna)?.nama ?? "";
  const cabangItems = items.filter((k) => k.cabang === MOBILE_CABANG);

  useEffect(() => {
    const kode = params.get("kode");
    const plat = params.get("plat");
    if (kode || plat) {
      setShowForm(true);
      if (kode) setKodeWarna(kode);
      if (plat) setPlatNomor(plat);
    }
  }, [params]);

  function handleSubmit() {
    if (!platNomor.trim()) {
      toast("No. polisi wajib diisi", "error");
      return;
    }
    const id = `KL-${Date.now().toString().slice(-6)}`;
    add({
      id,
      tanggal,
      cabang: MOBILE_CABANG,
      kodeWarna,
      warna,
      platNomor: platNomor.trim().toUpperCase(),
      klaimOleh: MOBILE_USER,
      status: "Menunggu Verifikasi",
      ...(catatan.trim() ? { catatan: catatan.trim() } : {}),
    });
    setShowForm(false);
    setPlatNomor("");
    setCatatan("");
    toast("Klaim warna terkirim — menunggu verifikasi supervisor", "success");
  }

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-slds-text-weak px-1">
        Laporkan pekerjaan cat yang belum tercatat di sistem. Supervisor akan verifikasi di web admin.
      </p>

      <button
        type="button"
        data-no-toast
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 border-2 border-dashed border-brand text-brand rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Ajukan Klaim Warna
      </button>

      {showForm && (
        <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Tanggal Pekerjaan</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Kode Warna</label>
            <select
              value={kodeWarna}
              onChange={(e) => setKodeWarna(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] bg-white"
            >
              {MOCK_KODE_WARNA.map((k) => (
                <option key={k.kode} value={k.kode}>
                  {k.kode} — {k.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">No. Polisi</label>
            <input
              type="text"
              value={platNomor}
              onChange={(e) => setPlatNomor(e.target.value)}
              placeholder="L 1234 ABC"
              className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] uppercase"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Catatan (opsional)</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Mis. nota hilang, transaksi belum sync..."
              className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]"
            />
          </div>
          <div className="text-[11px] text-slds-text-weak bg-slds-bg rounded-lg p-2">
            Cabang: <strong>{MOBILE_CABANG}</strong> · Klaim oleh: <strong>{MOBILE_USER}</strong>
          </div>
          <button type="button" data-no-toast onClick={handleSubmit} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
            Kirim Klaim
          </button>
        </div>
      )}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat Cabang</p>
        {cabangItems.length === 0 && (
          <p className="text-[12px] text-slds-text-weak px-1">Belum ada klaim di cabang ini</p>
        )}
        {cabangItems.map((r) => (
          <Link
            key={r.id}
            href={`/app/klaim-warna/${r.id}`}
            className="bg-white rounded-xl p-3.5 border border-slds-border flex items-center gap-3 mb-2 hover:border-brand/40"
          >
            <Palette className="h-5 w-5 text-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slds-text truncate">{r.warna}</p>
              <p className="text-[11px] text-slds-text-weak">
                {r.id} · {r.platNomor} · {r.tanggal}
              </p>
            </div>
            <StatusBadge status={klaimStatusBadge(r.status)} />
            <ChevronRight className="h-4 w-4 text-slds-text-weak shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AppKlaimWarnaPage() {
  return (
    <Suspense fallback={<p className="text-[13px] text-slds-text-weak px-1">Memuat...</p>}>
      <KlaimWarnaContent />
    </Suspense>
  );
}

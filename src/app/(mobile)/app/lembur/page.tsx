"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Camera, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useLemburList } from "@/lib/preview-store";

const MOBILE_USER = "Andi Wijaya";

function calcJam(mulai: string, selesai: string) {
  const [h1, m1] = mulai.split(":").map(Number);
  const [h2, m2] = selesai.split(":").map(Number);
  return Math.max(1, Math.round(((h2 * 60 + m2) - (h1 * 60 + m1)) / 60));
}

export default function AppLemburPage() {
  const { toast } = useToast();
  const { items, add } = useLemburList();
  const [showForm, setShowForm] = useState(false);
  const [fotoTaken, setFotoTaken] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [jamMulai, setJamMulai] = useState("17:00");
  const [jamSelesai, setJamSelesai] = useState("20:00");

  const myItems = items.filter((i) => i.nama === MOBILE_USER);

  function handleSubmit() {
    if (!fotoTaken) {
      toast("Foto bukti lembur wajib diambil", "error");
      return;
    }
    const id = `LB-${Date.now().toString().slice(-6)}`;
    const jam = calcJam(jamMulai, jamSelesai);
    add({
      id,
      nama: MOBILE_USER,
      cabang: "Surabaya",
      tanggal,
      jam,
      jamMulai,
      jamSelesai,
      lokasi: "Surabaya",
      gps: "Auto 2000 Surabaya · -7.28, 112.73",
      fotoBukti: true,
      status: "Menunggu TTD",
    });
    setShowForm(false);
    setFotoTaken(false);
    toast("Pengajuan lembur terkirim — menunggu approval", "success");
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        data-no-toast
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 border-2 border-dashed border-brand text-brand rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Ajukan Lembur
      </button>

      {showForm && (
        <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Tanggal</label>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Jam Mulai</label>
              <input type="time" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Jam Selesai</label>
              <input type="time" value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
            </div>
          </div>
          <button
            type="button"
            data-no-toast
            onClick={() => { setFotoTaken(true); toast("Foto bukti diambil", "success"); }}
            className={`w-full py-3 border rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2
              ${fotoTaken ? "border-green-300 bg-green-50 text-green-800" : "border-slds-border"}`}
          >
            <Camera className="h-4 w-4" /> {fotoTaken ? "Foto Tersimpan ✓" : "Ambil Foto Bukti"}
          </button>
          <div className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 rounded-lg p-2">
            <MapPin className="h-3.5 w-3.5" /> GPS: Auto 2000 Surabaya — dalam radius
          </div>
          <button type="button" data-no-toast onClick={handleSubmit} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
            Kirim Pengajuan
          </button>
        </div>
      )}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat</p>
        {myItems.map((r) => (
          <Link key={r.id} href={`/app/lembur/${r.id}`} className="bg-white rounded-xl p-3.5 border border-slds-border flex items-center gap-3 mb-2 hover:border-brand/40">
            <div className="flex-1">
              <p className="text-[13px] font-bold text-slds-text">{r.tanggal}</p>
              <p className="text-[11px] text-slds-text-weak">{r.jam} jam · {r.lokasi}</p>
            </div>
            <StatusBadge status={r.status} />
            <ChevronRight className="h-4 w-4 text-slds-text-weak shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

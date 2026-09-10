"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Calendar, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useIzinList } from "@/lib/preview-store";

const MOBILE_USER = "Andi Wijaya";

export default function AppIzinPage() {
  const { toast } = useToast();
  const { items, add } = useIzinList();
  const [showForm, setShowForm] = useState(false);
  const [tipe, setTipe] = useState("Izin");
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [alasan, setAlasan] = useState("");

  const myItems = items.filter((i) => i.nama === MOBILE_USER);

  function handleSubmit() {
    if (!mulai || !selesai) {
      toast("Tanggal mulai & selesai wajib diisi", "error");
      return;
    }
    const id = `IZ-${Date.now().toString().slice(-6)}`;
    add({
      id,
      nama: MOBILE_USER,
      cabang: "Surabaya",
      tipe,
      mulai,
      selesai,
      alasan: alasan.trim() || "Pengajuan dari mobile app",
      status: "Menunggu TTD",
      diajukanPada: new Date().toISOString(),
    });
    setShowForm(false);
    setMulai("");
    setSelesai("");
    setAlasan("");
    toast("Pengajuan izin terkirim — menunggu approval", "success");
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        data-no-toast
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 border-2 border-dashed border-brand text-brand rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Ajukan Izin / Cuti
      </button>

      {showForm && (
        <div className="bg-white rounded-xl p-4 border border-slds-border space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Tipe</label>
            <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px] bg-white">
              <option>Izin</option>
              <option>Cuti</option>
              <option>Sakit</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Mulai</label>
              <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Selesai</label>
              <input type="date" value={selesai} onChange={(e) => setSelesai(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slds-text-weak uppercase">Alasan</label>
            <textarea rows={2} value={alasan} onChange={(e) => setAlasan(e.target.value)} className="w-full mt-1 px-3 py-2.5 border border-slds-border rounded-lg text-[14px]" />
          </div>
          <button type="button" data-no-toast onClick={handleSubmit} className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[14px]">
            Kirim Pengajuan
          </button>
        </div>
      )}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slds-text-weak mb-2 px-1">Riwayat</p>
        {myItems.length === 0 && (
          <p className="text-[12px] text-slds-text-weak px-1">Belum ada pengajuan</p>
        )}
        {myItems.map((r) => (
          <Link key={r.id} href={`/app/izin/${r.id}`} className="bg-white rounded-xl p-3.5 border border-slds-border flex items-center gap-3 mb-2 hover:border-brand/40">
            <Calendar className="h-5 w-5 text-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slds-text">{r.tipe}</p>
              <p className="text-[11px] text-slds-text-weak truncate">{r.mulai} — {r.selesai}</p>
            </div>
            <StatusBadge status={r.status} />
            <ChevronRight className="h-4 w-4 text-slds-text-weak shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

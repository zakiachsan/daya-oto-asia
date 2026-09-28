"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronUp, History, PackageCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { distribusiStatus } from "@/lib/distribusi-utils";
import { useDistribusiList, useInventoriStok } from "@/lib/preview-store";
import { MOBILE_CABANG, MOBILE_USER } from "@/lib/mobile-app-utils";
import type { DistribusiDetail, TerimaLine, TerimaRecord } from "@/lib/distribusi-utils";

/** Nama cabang yang dipakai baris inventory */
const STOK_CABANG = "Surabaya";

type LineInput = { terima: number; bocor: number };

function formatWaktuLengkap(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Urutan riwayat: yang paling baru diterima di atas */
function waktuRiwayat(d: DistribusiDetail) {
  const iso = d.terima?.waktu ?? d.waktuTerima ?? (d.tanggal ? `${d.tanggal}T00:00:00` : "");
  const t = iso ? new Date(iso).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

/** Catatan terima satu surat jalan; data lama tanpa catatan dianggap diterima penuh (ditandai otomatis) */
function catatanTerima(d: DistribusiDetail): { rec: TerimaRecord; auto: boolean } | null {
  if (d.terima) return { rec: d.terima, auto: false };
  if (d.status !== "Selesai") return null;
  return {
    auto: true,
    rec: {
      oleh: "Sistem · surat jalan lama",
      waktu: d.waktuTerima ?? `${d.tanggal}T08:00:00`,
      lines: d.lines.map((l) => ({
        kode: l.kode,
        nama: l.nama,
        qtyKirim: l.qty,
        qtyTerima: l.qty,
        kurangUnit: 0,
        bocorGram: 0,
      })),
    },
  };
}

export default function TerimaBarangPage() {
  const { toast } = useToast();
  const { items, update } = useDistribusiList();
  const { adjust } = useInventoriStok();

  /* Yang sudah dikirim pusat didahulukan — itu yang boleh dikonfirmasi */
  const inbound = useMemo(() => {
    const belum = items.filter((d) => distribusiStatus(d) !== "Selesai");
    return [...belum].sort((a, b) => {
      const rank = (d: (typeof items)[number]) => (distribusiStatus(d) === "Dalam Perjalanan" ? 0 : 1);
      return rank(a) - rank(b);
    });
  }, [items]);
  /* Riwayat selalu dari yang paling baru diterima */
  const riwayat = useMemo(
    () => items.filter((d) => distribusiStatus(d) === "Selesai").sort((a, b) => waktuRiwayat(b) - waktuRiwayat(a)),
    [items],
  );

  const [distId, setDistId] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, LineInput>>({});
  const [bukaRiwayat, setBukaRiwayat] = useState("");

  /* Pilihan cuma valid selama surat jalannya belum selesai — kalau sudah, otomatis pindah ke berikutnya. */
  const selectedId = inbound.some((d) => d.id === distId) ? distId : (inbound[0]?.id ?? "");
  const detail = items.find((d) => d.id === selectedId);
  /* Cuma distribusi yang sudah dikirim pusat yang bisa dikonfirmasi terima */
  const bisaTerima = !!detail && distribusiStatus(detail) === "Dalam Perjalanan";

  /* Ganti surat jalan = centang & angka direset. */
  useEffect(() => {
    setChecked({});
    setInputs({});
  }, [selectedId]);

  function lineValue(kode: string, qty: number): LineInput {
    return inputs[kode] ?? { terima: qty, bocor: 0 };
  }

  function patchLine(kode: string, qty: number, patch: Partial<LineInput>) {
    setInputs((p) => ({ ...p, [kode]: { ...(p[kode] ?? { terima: qty, bocor: 0 }), ...patch } }));
  }

  /* Rencana terima dari baris yang dicentang */
  const rencana: TerimaLine[] = detail
    ? detail.lines
        .filter((l) => checked[l.kode])
        .map((l) => {
          const v = lineValue(l.kode, l.qty);
          const terima = Math.min(Math.max(0, Math.floor(v.terima)), l.qty);
          return {
            kode: l.kode,
            nama: l.nama,
            qtyKirim: l.qty,
            qtyTerima: terima,
            kurangUnit: l.qty - terima,
            bocorGram: Math.max(0, v.bocor),
          };
        })
    : [];

  const totalTerima = rencana.reduce((s, r) => s + r.qtyTerima, 0);
  const totalKurang = rencana.reduce((s, r) => s + r.kurangUnit, 0);
  const totalBocor = rencana.reduce((s, r) => s + r.bocorGram, 0);
  /* Konfirmasi cuma boleh kalau semua item kiriman sudah diceklis */
  const semuaDicentang = !!detail && detail.lines.length > 0 && detail.lines.every((l) => checked[l.kode]);

  function handleTerima() {
    if (!detail) return;
    if (!bisaTerima) {
      toast("Barang belum dikirim pusat — tunggu status Dalam Perjalanan", "error");
      return;
    }
    if (!semuaDicentang) {
      toast(`Centang semua ${detail.lines.length} item dulu (${rencana.length}/${detail.lines.length})`, "error");
      return;
    }
    const waktu = new Date().toISOString();

    rencana.forEach((r) => {
      const catatan = [
        r.kurangUnit ? `unit kurang ${r.kurangUnit} kaleng` : "",
        r.bocorGram ? `bocor ${r.bocorGram} gram` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      adjust({
        kodeProduk: r.kode,
        cabang: STOK_CABANG,
        kalengDelta: r.qtyTerima,
        gramDelta: 0,
        keterangan: `Terima ${detail.id}${catatan ? ` · ${catatan}` : ""}`,
        oleh: MOBILE_USER,
      });
    });

    update(detail.id, {
      status: "Selesai",
      waktuTerima: waktu,
      driver: detail.driver && detail.driver !== "-" ? detail.driver : "Kurir Distribusi",
      terima: { oleh: MOBILE_USER, waktu, lines: rencana },
    });

    const ringkas = [
      `${totalTerima} kaleng masuk stok`,
      totalKurang ? `unit kurang ${totalKurang} kaleng` : "",
      totalBocor ? `bocor ${totalBocor} gram` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    toast(`${detail.id} diterima · ${ringkas}`, totalKurang || totalBocor ? "info" : "success");

    setChecked({});
    setInputs({});
    setBukaRiwayat(detail.id);
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

      {detail ? (
        <>
          <select
            value={selectedId}
            onChange={(e) => setDistId(e.target.value)}
            className="w-full px-3 py-2.5 border border-slds-border rounded-xl text-[13px] bg-white"
          >
            {inbound.map((d) => {
              const st = distribusiStatus(d);
              return (
                <option key={d.id} value={d.id}>
                  {d.id} · {d.tanggal} → {d.ke}
                  {st === "Draft" ? " · belum dikirim" : " · siap diterima"}
                </option>
              );
            })}
          </select>

          {!bisaTerima && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px] text-amber-800">
              Distribusi ini masih <strong>Draft</strong> — pusat belum klik Kirim Distribusi, jadi belum ada
              surat jalan. Konfirmasi terima aktif setelah statusnya Dalam Perjalanan.
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-slds-text-weak">
              Item kiriman ({rencana.length}/{detail.lines.length} diceklis)
            </p>
            <button
              type="button"
              data-no-toast
              onClick={() =>
                setChecked(semuaDicentang ? {} : Object.fromEntries(detail.lines.map((l) => [l.kode, true])))
              }
              className="text-[11px] font-bold text-brand"
            >
              {semuaDicentang ? "Hapus semua centang" : "Centang semua"}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slds-border divide-y">
            {detail.lines.map((line, li) => {
              const v = lineValue(line.kode, line.qty);
              const terima = Math.min(Math.max(0, Math.floor(v.terima)), line.qty);
              const kurang = line.qty - terima;
              return (
                <div key={`${line.kode}-${li}`} className="p-3 space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-semibold">
                    <input
                      type="checkbox"
                      checked={!!checked[line.kode]}
                      onChange={() => setChecked((p) => ({ ...p, [line.kode]: !p[line.kode] }))}
                    />
                    {line.kode} · {line.nama} ({line.qty} unit)
                  </label>
                  {checked[line.kode] && (
                    <div className="space-y-2 pl-6">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className="text-[10px] font-semibold uppercase text-slds-text-weak">
                            Unit diterima (kaleng)
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={line.qty}
                            value={v.terima}
                            onChange={(e) => patchLine(line.kode, line.qty, { terima: Number(e.target.value) || 0 })}
                            className="w-full mt-1 px-2 py-1.5 border border-slds-border rounded-lg text-[12px]"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] font-semibold uppercase text-slds-text-weak">
                            Selisih bocor (gram)
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={v.bocor}
                            onChange={(e) => patchLine(line.kode, line.qty, { bocor: Number(e.target.value) || 0 })}
                            className="w-full mt-1 px-2 py-1.5 border border-slds-border rounded-lg text-[12px]"
                          />
                        </label>
                      </div>
                      {kurang > 0 ? (
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Unit kurang {kurang} kaleng · kirim {line.qty}, diterima {terima}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slds-text-weak">Unit lengkap · {terima} kaleng</p>
                      )}
                      {v.bocor > 0 && (
                        <p className="text-[11px] font-semibold text-red-700">
                          Bocor {v.bocor} gram · dicatat sebagai selisih
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-slds-border p-3 space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Item diceklis</span>
              <span className={`font-semibold ${semuaDicentang ? "text-green-700" : "text-amber-700"}`}>
                {rencana.length} dari {detail.lines.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slds-text-weak">Kaleng masuk stok</span>
              <span className="font-semibold text-slds-text">{totalTerima}</span>
            </div>
            {totalKurang > 0 && (
              <div className="flex justify-between font-semibold text-amber-700">
                <span>Unit kurang</span>
                <span>{totalKurang} kaleng</span>
              </div>
            )}
            {totalBocor > 0 && (
              <div className="flex justify-between font-semibold text-red-700">
                <span>Bocor</span>
                <span>{totalBocor} gram</span>
              </div>
            )}
          </div>

          <button
            type="button"
            data-no-toast
            onClick={handleTerima}
            className={`w-full py-3 rounded-xl font-bold ${
              semuaDicentang && bisaTerima ? "bg-brand text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            Konfirmasi Terima
          </button>
          <p className={`text-[11px] text-center ${semuaDicentang && bisaTerima ? "text-green-700" : "text-amber-700"}`}>
            {!bisaTerima
              ? "Menunggu pusat mengirim barang dulu"
              : semuaDicentang
                ? "Semua item sudah diceklis · siap dikonfirmasi"
                : `Ceklis semua ${detail.lines.length} item dulu (${rencana.length}/${detail.lines.length})`}
          </p>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slds-border p-5 text-center">
          <PackageCheck className="h-6 w-6 text-brand mx-auto" />
          <p className="text-[13px] font-semibold text-slds-text mt-2">Semua barang sudah diterima</p>
          <p className="text-[11px] text-slds-text-weak mt-1">Tidak ada surat jalan yang menunggu konfirmasi.</p>
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-[13px] font-bold text-slds-text flex items-center gap-1.5">
          <History className="h-4 w-4 text-brand" /> Riwayat Terima Barang
        </h2>
        {riwayat.length === 0 ? (
          <p className="text-[12px] text-slds-text-weak">Belum ada pengiriman yang diterima.</p>
        ) : (
          <div className="bg-white rounded-xl border border-slds-border divide-y">
            {riwayat.map((d) => {
              const data = catatanTerima(d);
              if (!data) return null;
              const { rec, auto } = data;
              const rowsDetail = rec.lines;
              const kaleng = rec.lines.reduce((s, l) => s + l.qtyTerima, 0);
              const kurang = rec.lines.reduce((s, l) => s + l.kurangUnit, 0);
              const bocor = rec.lines.reduce((s, l) => s + l.bocorGram, 0);
              const open = bukaRiwayat === d.id;
              return (
                <div key={d.id}>
                  <button
                    type="button"
                    data-no-toast
                    aria-expanded={open}
                    onClick={() => setBukaRiwayat(open ? "" : d.id)}
                    className="w-full text-left p-3 flex items-start justify-between gap-2"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold font-mono text-slds-text">{d.id}</span>
                      <span className="block text-[11px] text-slds-text-weak">
                        {d.tanggal} · {d.dari} → {d.ke}
                      </span>
                      <span className="block text-[11px] text-slds-text-weak">
                        Diterima {formatWaktuLengkap(rec.waktu)} · oleh {rec.oleh}
                      </span>
                      {kurang > 0 || bocor > 0 || auto ? (
                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase">
                          {kurang > 0 && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                              kurang {kurang} kaleng
                            </span>
                          )}
                          {bocor > 0 && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">bocor {bocor} g</span>
                          )}
                          {auto && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">tercatat otomatis</span>
                          )}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 flex items-center gap-2 pt-0.5">
                      <span className="text-[11px] font-semibold text-slds-text">{kaleng} kaleng</span>
                      {open ? (
                        <ChevronUp className="h-4 w-4 text-slds-text-weak" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slds-text-weak" />
                      )}
                    </span>
                  </button>
                  {open && (
                    <div className="px-3 pb-3">
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px]">
                          <thead className="text-slds-text-weak uppercase">
                            <tr>
                              <th className="text-left font-semibold pb-1">Kode</th>
                              <th className="text-right font-semibold pb-1">Kirim</th>
                              <th className="text-right font-semibold pb-1">Terima</th>
                              <th className="text-right font-semibold pb-1">Kurang</th>
                              <th className="text-right font-semibold pb-1">Bocor (g)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowsDetail.map((l, li) => (
                              <tr key={`${l.kode}-${li}`} className="border-t border-slds-border">
                                <td className="py-1 text-slds-text">
                                  <span className="font-mono font-semibold">{l.kode}</span>
                                </td>
                                <td className="py-1 text-right text-slds-text">{l.qtyKirim}</td>
                                <td className="py-1 text-right font-semibold text-slds-text">{l.qtyTerima}</td>
                                <td
                                  className={`py-1 text-right ${l.kurangUnit ? "font-semibold text-amber-700" : "text-slds-text"}`}
                                >
                                  {l.kurangUnit}
                                </td>
                                <td
                                  className={`py-1 text-right ${l.bocorGram ? "font-semibold text-red-700" : "text-slds-text"}`}
                                >
                                  {l.bocorGram}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {auto && (
                        <p className="text-[10px] text-slds-text-weak mt-1">
                          Surat jalan lama tanpa catatan unit · dihitung diterima penuh.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

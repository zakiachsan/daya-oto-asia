import type { TransaksiRow } from "./mock-data";
import type { OpbRow } from "./mock-data";

/**
 * Rekonsiliasi per cabang: membandingkan **nota tercetak** vs **OPB yang sudah keluar**.
 * - OPB yang sudah keluar = OPB yang sudah diforward ke cabang (status ≠ "Draft").
 *   OPB yang masih Draft belum dihitung karena belum keluar dari HO.
 * - Point B = selisih jumlah nota tercetak vs OPB, dibaca dari sisi nota:
 *   `selisih = notaCetak − opb` → positif berarti ada nota tercetak yang belum masuk OPB
 *   (temuan), 0 berarti match. Karena di app nota selalu dicetak lebih dulu, nilai negatif
 *   (OPB lebih banyak dari nota) menandakan data OPB perlu dicek.
 */
export type RekonsiliasiCabangRow = {
  cabang: string;
  /** Jumlah transaksi di OPB yang sudah keluar (status ≠ Draft) */
  opb: number;
  /** Jumlah nota yang sudah tercetak di cabang */
  notaCetak: number;
  /** Point B · notaCetak − opb */
  selisih: number;
  status: "Selesai" | "Perlu Review";
};

export function buildRekonsiliasiFromData(transaksi: TransaksiRow[], opbList: OpbRow[]): RekonsiliasiCabangRow[] {
  const byCabang = new Map<string, { nota: number; opb: number }>();

  for (const t of transaksi) {
    /* Nota tercetak = transaksi yang sudah punya waktu cetak nota.
       Transaksi di OPB yang notanya belum keluar TIDAK dihitung sebagai nota. */
    if (!t.waktuCetakNota) continue;
    const key = t.cabang;
    const cur = byCabang.get(key) ?? { nota: 0, opb: 0 };
    cur.nota += 1;
    byCabang.set(key, cur);
  }

  /* Hanya OPB yang sudah keluar (bukan Draft) yang ikut dibandingkan */
  const opbKeluar = opbList.filter((o) => o.status !== "Draft");

  for (const o of opbKeluar) {
    const key = o.cabang.includes("Auto") ? "Auto 2000 Surabaya" : o.cabang;
    for (const [cab, cur] of byCabang.entries()) {
      if (cab.includes(o.cabang.split(" ").pop() ?? o.cabang) || o.cabang.includes(cab.split(" ").pop() ?? cab)) {
        /* Dijumlah, bukan diambil terbesar: satu cabang bisa punya lebih dari satu OPB
           (mis. periode beda atau OPB tambahan hasil input nota di halaman rekonsiliasi) */
        cur.opb += o.jumlahTrx;
        byCabang.set(cab, cur);
      }
    }
    if (![...byCabang.keys()].some((k) => o.cabang.includes(k.split(" ").pop() ?? ""))) {
      byCabang.set(o.cabang, { nota: 0, opb: o.jumlahTrx });
    }
  }

  return [...byCabang.entries()].map(([cabang, v]) => {
    /* Point B · dibaca dari sisi nota: positif = ada nota yang belum masuk OPB */
    const selisih = v.nota - v.opb;
    return {
      cabang,
      opb: v.opb,
      notaCetak: v.nota,
      selisih,
      status: selisih === 0 ? "Selesai" : "Perlu Review",
    };
  });
}

/** Satu cabang dianggap cocok kalau kata terakhir namanya sama (mis. "Surabaya") */
function cabangCocok(a: string, b: string) {
  const lastA = a.split(" ").pop() ?? a;
  const lastB = b.split(" ").pop() ?? b;
  return a.includes(lastB) || b.includes(lastA);
}

/** Rincian untuk menjawab "selisihnya dari transaksi mana" per cabang */
export type SelisihDetail = {
  /** OPB cabang ini yang sudah keluar */
  opbKeluar: OpbRow[];
  /** Jumlah trx yang tercatat di header OPB keluar (angka agregat OPB) */
  opbKeluarTrx: number;
  /** Semua transaksi cabang ini yang punya OPB keluar */
  trxDiOpbKeluar: TransaksiRow[];
  /** Semua nota cabang ini yang sudah tercetak */
  notaTercetak: TransaksiRow[];
  /** Transaksi di OPB keluar yang nota-nya belum tercetak · tidak boleh terjadi di app */
  masukOpbTanpaNota: TransaksiRow[];
  /** Nota yang sudah tercetak tapi belum masuk OPB keluar · temuan utama */
  notaTanpaOpbKeluar: TransaksiRow[];
};

export function buildSelisihDetail(transaksi: TransaksiRow[], opbList: OpbRow[], cabang: string): SelisihDetail {
  const opbKeluar = opbList.filter((o) => o.status !== "Draft" && cabangCocok(o.cabang, cabang));
  const opbKeluarIds = new Set(opbKeluar.map((o) => o.id));
  const trxCabang = transaksi.filter((t) => cabangCocok(t.cabang, cabang));
  const trxDiOpbKeluar = trxCabang.filter((t) => Boolean(t.opbId) && opbKeluarIds.has(t.opbId as string));
  const notaTercetak = trxCabang.filter((t) => Boolean(t.waktuCetakNota));

  return {
    opbKeluar,
    /* Sama seperti kolom OPB Keluar di ringkasan · jumlahkan semua OPB keluar cabang ini */
    opbKeluarTrx: opbKeluar.reduce((total, o) => total + o.jumlahTrx, 0),
    trxDiOpbKeluar,
    notaTercetak,
    masukOpbTanpaNota: trxDiOpbKeluar.filter((t) => !t.waktuCetakNota),
    notaTanpaOpbKeluar: notaTercetak.filter((t) => !t.opbId || !opbKeluarIds.has(t.opbId)),
  };
}

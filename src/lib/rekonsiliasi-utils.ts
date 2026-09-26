import type { TransaksiRow } from "./mock-data";
import type { OpbRow } from "./mock-data";

/** Point B: selisih jumlah nota tercetak vs OPB per cabang/periode */
export type RekonsiliasiCabangRow = {
  cabang: string;
  opb: number;
  notaCetak: number;
  selisih: number;
  status: "Selesai" | "Perlu Review";
};

export function buildRekonsiliasiFromData(transaksi: TransaksiRow[], opbList: OpbRow[]): RekonsiliasiCabangRow[] {
  const byCabang = new Map<string, { nota: number; opb: number }>();

  for (const t of transaksi) {
    if (!t.waktuCetakNota && t.status === "Draft") continue;
    const key = t.cabang;
    const cur = byCabang.get(key) ?? { nota: 0, opb: 0 };
    cur.nota += 1;
    byCabang.set(key, cur);
  }

  for (const o of opbList) {
    const key = o.cabang.includes("Auto") ? "Auto 2000 Surabaya" : o.cabang;
    for (const [cab, cur] of byCabang.entries()) {
      if (cab.includes(o.cabang.split(" ").pop() ?? o.cabang) || o.cabang.includes(cab.split(" ").pop() ?? cab)) {
        cur.opb = Math.max(cur.opb, o.jumlahTrx);
        byCabang.set(cab, cur);
      }
    }
    if (![...byCabang.keys()].some((k) => o.cabang.includes(k.split(" ").pop() ?? ""))) {
      byCabang.set(o.cabang, { nota: 0, opb: o.jumlahTrx });
    }
  }

  return [...byCabang.entries()].map(([cabang, v]) => {
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

import { MOCK_COA } from "./mock-data";
import type { JurnalDetail } from "./jurnal-utils";
import { COA } from "./jurnal-builders";

export type CoaRow = (typeof MOCK_COA)[number];

export type ReportPeriod = {
  year: number;
  month: number;
  label: string;
  key: string;
};

export const REPORT_PERIODS: ReportPeriod[] = [
  { year: 2026, month: 9, label: "September 2026", key: "2026-09" },
  { year: 2026, month: 8, label: "Agustus 2026", key: "2026-08" },
  { year: 2026, month: 7, label: "Juli 2026", key: "2026-07" },
];

export const MODAL_EKUITAS = 500_000_000;

export type AccountMovement = { debit: number; credit: number };

export function postedJurnals(jurnals: JurnalDetail[]) {
  return jurnals.filter((j) => j.status === "Posted");
}

export function filterJurnalsByPeriod(jurnals: JurnalDetail[], periodKey: string) {
  return jurnals.filter((j) => j.tanggal.startsWith(periodKey));
}

export function sumAccountMovements(jurnals: JurnalDetail[]): Map<string, AccountMovement> {
  const map = new Map<string, AccountMovement>();
  for (const j of jurnals) {
    for (const line of j.lines) {
      const cur = map.get(line.accountKode) ?? { debit: 0, credit: 0 };
      cur.debit += line.debit;
      cur.credit += line.credit;
      map.set(line.accountKode, cur);
    }
  }
  return map;
}

function coaByKode(kode: string): CoaRow | undefined {
  return MOCK_COA.find((a) => a.kode === kode);
}

/** Saldo akun neraca = saldo awal + mutasi posted jurnal (kumulatif). */
export function balanceSheetSaldo(coa: CoaRow, movements: AccountMovement | undefined) {
  const m = movements ?? { debit: 0, credit: 0 };
  if (coa.tipe === "Aset") return coa.saldo + m.debit - m.credit;
  if (coa.tipe === "Kewajiban") return coa.saldo + m.credit - m.debit;
  return 0;
}

export type NeracaSection = { akun: string; kode: string; saldo: number };

export function buildNeraca(jurnals: JurnalDetail[]) {
  const movements = sumAccountMovements(postedJurnals(jurnals));

  const aktiva: NeracaSection[] = MOCK_COA.filter((a) => a.tipe === "Aset").map((a) => ({
    akun: a.nama,
    kode: a.kode,
    saldo: balanceSheetSaldo(a, movements.get(a.kode)),
  }));

  const kewajiban: NeracaSection[] = MOCK_COA.filter((a) => a.tipe === "Kewajiban").map((a) => ({
    akun: a.nama,
    kode: a.kode,
    saldo: balanceSheetSaldo(a, movements.get(a.kode)),
  }));

  const totalAktiva = aktiva.reduce((s, a) => s + a.saldo, 0);
  const totalKewajiban = kewajiban.reduce((s, a) => s + a.saldo, 0);
  const labaBerjalan = totalAktiva - totalKewajiban - MODAL_EKUITAS;

  const ekuitas: NeracaSection[] = [
    { akun: "Modal Disetor", kode: "310101", saldo: MODAL_EKUITAS },
    { akun: "Laba Berjalan", kode: "320101", saldo: labaBerjalan },
  ];

  const pasiva = [...kewajiban, ...ekuitas];
  const totalPasiva = pasiva.reduce((s, a) => s + a.saldo, 0);

  return { aktiva, pasiva, kewajiban, ekuitas, totalAktiva, totalPasiva, balanced: totalAktiva === totalPasiva };
}

export type LabaRugiRow = { akun: string; kode: string; jumlah: number; tipe: "Pendapatan" | "Beban" };

export function buildLabaRugi(jurnals: JurnalDetail[], periodKey: string) {
  const periodJurnals = filterJurnalsByPeriod(postedJurnals(jurnals), periodKey);
  const movements = sumAccountMovements(periodJurnals);

  const rows: LabaRugiRow[] = MOCK_COA.filter((a) => a.tipe === "Pendapatan" || a.tipe === "Beban").map((a) => {
    const m = movements.get(a.kode) ?? { debit: 0, credit: 0 };
    const jumlah = a.tipe === "Pendapatan" ? m.credit - m.debit : m.debit - m.credit;
    return { akun: a.nama, kode: a.kode, jumlah, tipe: a.tipe as "Pendapatan" | "Beban" };
  });

  const pendapatan = rows.filter((r) => r.tipe === "Pendapatan").reduce((s, r) => s + r.jumlah, 0);
  const beban = rows.filter((r) => r.tipe === "Beban").reduce((s, r) => s + r.jumlah, 0);
  const labaBersih = pendapatan - beban;

  return { rows: rows.filter((r) => r.jumlah !== 0), pendapatan, beban, labaBersih, jurnalCount: periodJurnals.length };
}

export type ArusKasRow = { item: string; jumlah: number; tanggal: string; source?: string };

const CASH_CODES = new Set<string>([COA.KAS, COA.BANK]);

export function buildArusKas(jurnals: JurnalDetail[], periodKey: string) {
  const periodJurnals = filterJurnalsByPeriod(postedJurnals(jurnals), periodKey);
  const rows: ArusKasRow[] = [];

  for (const j of periodJurnals) {
    for (const line of j.lines) {
      if (!CASH_CODES.has(line.accountKode)) continue;
      const net = line.debit - line.credit;
      if (net === 0) continue;
      rows.push({
        item: j.keterangan,
        jumlah: net,
        tanggal: j.tanggal,
        source: j.sourceType,
      });
    }
  }

  const masuk = rows.filter((r) => r.jumlah > 0).reduce((s, r) => s + r.jumlah, 0);
  const keluar = rows.filter((r) => r.jumlah < 0).reduce((s, r) => s + Math.abs(r.jumlah), 0);
  const neto = masuk - keluar;

  return { rows, masuk, keluar, neto };
}

export function kasBankSaldo(jurnals: JurnalDetail[]) {
  const movements = sumAccountMovements(postedJurnals(jurnals));
  const kas = coaByKode(COA.KAS);
  const bank = coaByKode(COA.BANK);
  const saldoKas = kas ? balanceSheetSaldo(kas, movements.get(COA.KAS)) : 0;
  const saldoBank = bank ? balanceSheetSaldo(bank, movements.get(COA.BANK)) : 0;
  return { saldoKas, saldoBank, total: saldoKas + saldoBank };
}

export function piutangSaldo(jurnals: JurnalDetail[]) {
  const coa = coaByKode(COA.PIUTANG);
  if (!coa) return 0;
  const movements = sumAccountMovements(postedJurnals(jurnals));
  return balanceSheetSaldo(coa, movements.get(COA.PIUTANG));
}

export function hutangSaldo(jurnals: JurnalDetail[]) {
  const coa = coaByKode(COA.HUTANG);
  if (!coa) return 0;
  const movements = sumAccountMovements(postedJurnals(jurnals));
  return balanceSheetSaldo(coa, movements.get(COA.HUTANG));
}

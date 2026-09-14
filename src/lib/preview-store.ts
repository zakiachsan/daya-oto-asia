"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MOCK_TRANSAKSI,
  MOCK_OPB,
  MOCK_KLAIM,
  MOCK_KARYAWAN,
  MOCK_FAKTUR_JUAL,
  MOCK_FAKTUR_BELI,
  MOCK_KAS_BANK,
  type TransaksiRow,
  type OpbRow,
  type KlaimWarnaRow,
} from "./mock-data";
import type { FakturJualRow } from "./faktur-utils";
import type { FakturBeliRow } from "./faktur-beli-utils";
import type { FinancePaymentRow } from "./finance-payment-utils";
import { MOCK_JURNAL_DETAILS, type JurnalDetail } from "./jurnal-utils";
import { INITIAL_STOCK_OPNAME, type StockOpnameRow } from "./stock-opname-utils";
import { INITIAL_PO, type PoDetail } from "./po-utils";
import { INITIAL_DISTRIBUSI, type DistribusiDetail } from "./distribusi-utils";
import { INITIAL_AJUAN_STOK, type AjuanStokDetail } from "./ajuan-stok-utils";
import { INITIAL_PENYESUAIAN, type PenyesuaianDetail } from "./penyesuaian-stok-utils";
import { INITIAL_HUTANG_PIUTANG, type HutangPiutangDetail } from "./hutang-piutang-utils";
import { INITIAL_IZIN, type IzinDetail } from "./izin-utils";
import { INITIAL_LEMBUR, type LemburDetail } from "./lembur-utils";
import {
  INITIAL_PELANGGAN,
  INITIAL_PEMASOK,
  INITIAL_SYARAT_PEMBAYARAN,
  INITIAL_TRANSFER_BANK,
  type PelangganRow,
  type PemasokRow,
  type SyaratPembayaranRow,
  type TransferBankRow,
} from "./finance-master-data";

export type AjuanStokRow = AjuanStokDetail;

export type BukaKalengRow = {
  id: string;
  produk: string;
  beratKosong: number;
  beratIsi: number;
  netGram: number;
  tinter: string;
  cabang: string;
  tanggal: string;
};

const TRX_KEY = "daya-oto-extra-trx";
const AJUAN_KEY = "daya-oto-ajuan-stok";
const BUKA_KEY = "daya-oto-buka-kaleng";
const OPB_KEY = "daya-oto-opb";
const ASSIGN_KEY = "daya-oto-assignment";
const KLAIM_KEY = "daya-oto-klaim-warna";
const CETAK_NOTA_KEY = "daya-oto-cetak-nota-log";
const FAKTUR_KEY = "daya-oto-faktur-jual";
const JURNAL_KEY = "daya-oto-jurnal-extra";
const OPNAME_KEY = "daya-oto-stock-opname";
const PO_KEY = "daya-oto-po";
const DIST_KEY = "daya-oto-distribusi";
const PENYESUAIAN_KEY = "daya-oto-penyesuaian-stok";
const HUTANG_KEY = "daya-oto-hutang-piutang";
const FAKTUR_BELI_KEY = "daya-oto-faktur-beli";
const PAYMENT_KEY = "daya-oto-finance-payments";
const KAS_BANK_KEY = "daya-oto-kas-bank";
const IZIN_KEY = "daya-oto-izin";
const LEMBUR_KEY = "daya-oto-lembur";
const DEMO_CHECKLIST_KEY = "daya-oto-demo-checklist";
const SYARAT_BAYAR_KEY = "daya-oto-syarat-pembayaran";
const PELANGGAN_KEY = "daya-oto-pelanggan";
const PEMASOK_KEY = "daya-oto-pemasok";
const TRANSFER_BANK_KEY = "daya-oto-transfer-bank";

export type AssignmentMap = Record<string, string>;

function read<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function readObj<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeObj<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const INITIAL_AJUAN = INITIAL_AJUAN_STOK;

export function useTransaksiList() {
  const [extra, setExtra] = useState<TransaksiRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setExtra(read<TransaksiRow>(TRX_KEY, []));
    setReady(true);
  }, []);

  const add = useCallback((row: TransaksiRow) => {
    setExtra((prev) => {
      const next = [row, ...prev];
      write(TRX_KEY, next);
      return next;
    });
  }, []);

  const all = ready ? [...extra, ...MOCK_TRANSAKSI] : MOCK_TRANSAKSI;

  return { all, add, ready };
}

export function useAjuanStok() {
  const [items, setItems] = useState<AjuanStokRow[]>(INITIAL_AJUAN);

  useEffect(() => {
    setItems(read<AjuanStokRow>(AJUAN_KEY, INITIAL_AJUAN));
  }, []);

  const add = useCallback((row: AjuanStokRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(AJUAN_KEY, next);
      return next;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: AjuanStokRow["status"]) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      write(AJUAN_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<AjuanStokRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(AJUAN_KEY, next);
      return next;
    });
  }, []);

  return { items, add, updateStatus, update };
}

export function useBukaKaleng() {
  const [items, setItems] = useState<BukaKalengRow[]>([]);

  useEffect(() => {
    setItems(read<BukaKalengRow>(BUKA_KEY, []));
  }, []);

  const add = useCallback((row: BukaKalengRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(BUKA_KEY, next);
      return next;
    });
  }, []);

  return { items, add };
}

export function useOpbList() {
  const [items, setItems] = useState<OpbRow[]>(MOCK_OPB);

  useEffect(() => {
    setItems(read<OpbRow>(OPB_KEY, MOCK_OPB));
  }, []);

  const persist = useCallback((next: OpbRow[]) => {
    setItems(next);
    write(OPB_KEY, next);
  }, []);

  const add = useCallback(
    (row: OpbRow) => {
      setItems((prev) => {
        const next = [row, ...prev];
        write(OPB_KEY, next);
        return next;
      });
    },
    [],
  );

  const updateStatus = useCallback(
    (id: string, status: OpbRow["status"]) => {
      setItems((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
        write(OPB_KEY, next);
        return next;
      });
    },
    [],
  );

  const setSap = useCallback((id: string, sap: string) => {
    setItems((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, sap, status: "Ditagihkan" as const } : r,
      );
      write(OPB_KEY, next);
      return next;
    });
  }, []);

  return { items, add, updateStatus, setSap };
}

function initialAssignment(): AssignmentMap {
  return Object.fromEntries(
    MOCK_KARYAWAN.filter((k) => k.jabatan === "Tinter").map((k) => [k.id, k.cabang]),
  );
}

export function useAssignment() {
  const [map, setMap] = useState<AssignmentMap>(initialAssignment);

  useEffect(() => {
    setMap(readObj(ASSIGN_KEY, initialAssignment()));
  }, []);

  const updateCabang = useCallback((karyawanId: string, cabang: string) => {
    setMap((prev) => {
      const next = { ...prev, [karyawanId]: cabang };
      writeObj(ASSIGN_KEY, next);
      return next;
    });
  }, []);

  return { map, updateCabang };
}

export function useKlaimWarna() {
  const [items, setItems] = useState<KlaimWarnaRow[]>(MOCK_KLAIM);

  useEffect(() => {
    setItems(read<KlaimWarnaRow>(KLAIM_KEY, MOCK_KLAIM));
  }, []);

  const updateStatus = useCallback(
    (id: string, status: KlaimWarnaRow["status"], catatan?: string) => {
      setItems((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, status, ...(catatan !== undefined ? { catatan } : {}) } : r,
        );
        write(KLAIM_KEY, next);
        return next;
      });
    },
    [],
  );

  const add = useCallback((row: KlaimWarnaRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(KLAIM_KEY, next);
      return next;
    });
  }, []);

  return { items, updateStatus, add };
}

export function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function nameFromSlug(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export type CetakNotaLogRow = {
  id: string;
  trxId: string;
  tinter: string;
  cabang: string;
  waktu: string;
  /** true = cetak ulang (anti-fraud audit) */
  isReprint: boolean;
  oleh: string;
};

export function useCetakNotaLog() {
  const [items, setItems] = useState<CetakNotaLogRow[]>([]);

  useEffect(() => {
    setItems(read<CetakNotaLogRow>(CETAK_NOTA_KEY, []));
  }, []);

  const log = useCallback((row: Omit<CetakNotaLogRow, "id" | "waktu">) => {
    const entry: CetakNotaLogRow = {
      ...row,
      id: `CN-${Date.now()}`,
      waktu: new Date().toISOString(),
    };
    setItems((prev) => {
      const next = [entry, ...prev];
      write(CETAK_NOTA_KEY, next);
      return next;
    });
    return entry;
  }, []);

  const byTrxId = useCallback(
    (trxId: string) => items.filter((r) => r.trxId === trxId).sort((a, b) => b.waktu.localeCompare(a.waktu)),
    [items],
  );

  const hasPrinted = useCallback(
    (trxId: string) => items.some((r) => r.trxId === trxId),
    [items],
  );

  return { items, log, byTrxId, hasPrinted };
}

/** Cetak nota + audit log anti-fraud */
export function useNotaPrint() {
  const { log, byTrxId, hasPrinted } = useCetakNotaLog();

  const recordPrint = useCallback(
    (trxId: string, tinter: string, cabang: string, oleh = "Andi Wijaya") => {
      const isReprint = hasPrinted(trxId);
      log({ trxId, tinter, cabang, isReprint, oleh });
      return isReprint;
    },
    [log, hasPrinted],
  );

  return { recordPrint, byTrxId, hasPrinted, log };
}

const INITIAL_FAKTUR: FakturJualRow[] = MOCK_FAKTUR_JUAL.map((f) => ({
  ...f,
  status: f.status as "Draft" | "Posted",
  opbId: f.pelanggan.includes("Surabaya")
    ? "OPB-2026-0089"
    : f.pelanggan.includes("Malang")
      ? "OPB-2026-0088"
      : "OPB-2026-0087",
}));

export function useFakturJual() {
  const [items, setItems] = useState<FakturJualRow[]>(INITIAL_FAKTUR);

  useEffect(() => {
    setItems(read(FAKTUR_KEY, INITIAL_FAKTUR));
  }, []);

  const persist = useCallback((next: FakturJualRow[]) => {
    setItems(next);
    write(FAKTUR_KEY, next);
  }, []);

  const add = useCallback(
    (row: FakturJualRow) => {
      setItems((prev) => {
        const next = [row, ...prev];
        write(FAKTUR_KEY, next);
        return next;
      });
    },
    [],
  );

  const updateStatus = useCallback(
    (id: string, status: FakturJualRow["status"]) => {
      setItems((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
        write(FAKTUR_KEY, next);
        return next;
      });
    },
    [],
  );

  const update = useCallback((id: string, patch: Partial<FakturJualRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(FAKTUR_KEY, next);
      return next;
    });
  }, []);

  return { all: items, add, updateStatus, update };
}

export function useJurnalList() {
  const [items, setItems] = useState<JurnalDetail[]>(MOCK_JURNAL_DETAILS);

  useEffect(() => {
    setItems(read(JURNAL_KEY, MOCK_JURNAL_DETAILS));
  }, []);

  const add = useCallback((row: JurnalDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(JURNAL_KEY, next);
      return next;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: JurnalDetail["status"]) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      write(JURNAL_KEY, next);
      return next;
    });
  }, []);

  return { all: items, add, updateStatus };
}

export function useStockOpname() {
  const [items, setItems] = useState<StockOpnameRow[]>(INITIAL_STOCK_OPNAME);

  useEffect(() => {
    setItems(read(OPNAME_KEY, INITIAL_STOCK_OPNAME));
  }, []);

  const updateStatus = useCallback((id: string, status: string, patch?: Partial<StockOpnameRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status, ...patch } : r));
      write(OPNAME_KEY, next);
      return next;
    });
  }, []);

  const bulkUpdate = useCallback((updater: (rows: StockOpnameRow[]) => StockOpnameRow[]) => {
    setItems((prev) => {
      const next = updater(prev);
      write(OPNAME_KEY, next);
      return next;
    });
  }, []);

  return { items, updateStatus, bulkUpdate };
}

export function usePoList() {
  const [items, setItems] = useState<PoDetail[]>(INITIAL_PO);

  useEffect(() => {
    setItems(read(PO_KEY, INITIAL_PO));
  }, []);

  const add = useCallback((row: PoDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(PO_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<PoDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(PO_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function useDistribusiList() {
  const [items, setItems] = useState<DistribusiDetail[]>(INITIAL_DISTRIBUSI);

  useEffect(() => {
    setItems(read(DIST_KEY, INITIAL_DISTRIBUSI));
  }, []);

  const add = useCallback((row: DistribusiDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(DIST_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<DistribusiDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(DIST_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function usePenyesuaianStok() {
  const [items, setItems] = useState<PenyesuaianDetail[]>(INITIAL_PENYESUAIAN);

  useEffect(() => {
    setItems(read(PENYESUAIAN_KEY, INITIAL_PENYESUAIAN));
  }, []);

  const add = useCallback((row: PenyesuaianDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(PENYESUAIAN_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<PenyesuaianDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(PENYESUAIAN_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function useHutangPiutang() {
  const [items, setItems] = useState<HutangPiutangDetail[]>(INITIAL_HUTANG_PIUTANG);

  useEffect(() => {
    setItems(read(HUTANG_KEY, INITIAL_HUTANG_PIUTANG));
  }, []);

  const persist = useCallback((next: HutangPiutangDetail[]) => {
    setItems(next);
    write(HUTANG_KEY, next);
  }, []);

  const update = useCallback((id: string, patch: Partial<HutangPiutangDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(HUTANG_KEY, next);
      return next;
    });
  }, []);

  const replaceAll = useCallback(
    (next: HutangPiutangDetail[]) => {
      persist(next);
    },
    [persist],
  );

  return { items, update, replaceAll };
}

const INITIAL_FAKTUR_BELI: FakturBeliRow[] = MOCK_FAKTUR_BELI.map((f) => ({
  ...f,
  status: f.status as FakturBeliRow["status"],
}));

export function useFakturBeli() {
  const [items, setItems] = useState<FakturBeliRow[]>(INITIAL_FAKTUR_BELI);

  useEffect(() => {
    setItems(read(FAKTUR_BELI_KEY, INITIAL_FAKTUR_BELI));
  }, []);

  const updateStatus = useCallback((id: string, status: FakturBeliRow["status"]) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      write(FAKTUR_BELI_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<FakturBeliRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(FAKTUR_BELI_KEY, next);
      return next;
    });
  }, []);

  const add = useCallback((row: FakturBeliRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(FAKTUR_BELI_KEY, next);
      return next;
    });
  }, []);

  return { all: items, add, updateStatus, update };
}

export type KasBankRow = {
  id: string;
  tanggal: string;
  tipe: "Penerimaan" | "Pembayaran";
  akun: string;
  keterangan: string;
  jumlah: number;
  jurnalId?: string;
};

const INITIAL_KAS_BANK: KasBankRow[] = MOCK_KAS_BANK.map((r): KasBankRow => ({
  id: r.id,
  tanggal: r.tanggal,
  tipe: r.tipe === "Penerimaan" ? "Penerimaan" : "Pembayaran",
  akun: r.akun,
  keterangan: r.keterangan,
  jumlah: r.jumlah,
}));

export function useKasBank() {
  const [items, setItems] = useState<KasBankRow[]>(INITIAL_KAS_BANK);

  useEffect(() => {
    setItems(read(KAS_BANK_KEY, INITIAL_KAS_BANK));
  }, []);

  const add = useCallback((row: KasBankRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(KAS_BANK_KEY, next);
      return next;
    });
  }, []);

  return { items, add };
}

export function useFinancePayments() {
  const [items, setItems] = useState<FinancePaymentRow[]>([]);

  useEffect(() => {
    setItems(read(PAYMENT_KEY, []));
  }, []);

  const add = useCallback((row: FinancePaymentRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(PAYMENT_KEY, next);
      return next;
    });
  }, []);

  return { items, add };
}

export function useIzinList() {
  const [items, setItems] = useState<IzinDetail[]>(INITIAL_IZIN);

  useEffect(() => {
    setItems(read(IZIN_KEY, INITIAL_IZIN));
  }, []);

  const add = useCallback((row: IzinDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(IZIN_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<IzinDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(IZIN_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function useLemburList() {
  const [items, setItems] = useState<LemburDetail[]>(INITIAL_LEMBUR);

  useEffect(() => {
    setItems(read(LEMBUR_KEY, INITIAL_LEMBUR));
  }, []);

  const add = useCallback((row: LemburDetail) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(LEMBUR_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<LemburDetail>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(LEMBUR_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function useDemoChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(readObj(DEMO_CHECKLIST_KEY, {}));
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeObj(DEMO_CHECKLIST_KEY, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked({});
    writeObj(DEMO_CHECKLIST_KEY, {});
  }, []);

  return { checked, toggle, reset };
}

export function useSyaratPembayaran() {
  const [items, setItems] = useState<SyaratPembayaranRow[]>(INITIAL_SYARAT_PEMBAYARAN);

  useEffect(() => {
    setItems(read(SYARAT_BAYAR_KEY, INITIAL_SYARAT_PEMBAYARAN));
  }, []);

  const add = useCallback((row: SyaratPembayaranRow) => {
    setItems((prev) => {
      const next = [...prev, row];
      write(SYARAT_BAYAR_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<SyaratPembayaranRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(SYARAT_BAYAR_KEY, next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((r) => r.id !== id);
      write(SYARAT_BAYAR_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update, remove };
}

export function usePelanggan() {
  const [items, setItems] = useState<PelangganRow[]>(INITIAL_PELANGGAN);

  useEffect(() => {
    setItems(read(PELANGGAN_KEY, INITIAL_PELANGGAN));
  }, []);

  const add = useCallback((row: PelangganRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(PELANGGAN_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<PelangganRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(PELANGGAN_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function usePemasok() {
  const [items, setItems] = useState<PemasokRow[]>(INITIAL_PEMASOK);

  useEffect(() => {
    setItems(read(PEMASOK_KEY, INITIAL_PEMASOK));
  }, []);

  const add = useCallback((row: PemasokRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(PEMASOK_KEY, next);
      return next;
    });
  }, []);

  const update = useCallback((id: string, patch: Partial<PemasokRow>) => {
    setItems((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      write(PEMASOK_KEY, next);
      return next;
    });
  }, []);

  return { items, add, update };
}

export function useTransferBank() {
  const [items, setItems] = useState<TransferBankRow[]>(INITIAL_TRANSFER_BANK);

  useEffect(() => {
    setItems(read(TRANSFER_BANK_KEY, INITIAL_TRANSFER_BANK));
  }, []);

  const add = useCallback((row: TransferBankRow) => {
    setItems((prev) => {
      const next = [row, ...prev];
      write(TRANSFER_BANK_KEY, next);
      return next;
    });
  }, []);

  return { items, add };
}

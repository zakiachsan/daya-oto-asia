import type { TransaksiRow } from "./mock-data";

/**
 * Arsip transaksi periode **Agustus 2026** · data contoh untuk OPB & rekonsiliasi.
 *
 * Tujuannya supaya angka OPB (rekap bulanan, mis. 47 trx) nyambung dengan jumlah
 * nota yang tercetak di cabang, sehingga kolom "Selisih (Point B)" di rekonsiliasi
 * menunjukkan selisih yang realistis (2–3 trx), bukan lompatan puluhan.
 *
 * Aturan yang dipegang (sama seperti alur di app tinter): nota SELALU dicetak lebih dulu,
 * baru transaksi bisa masuk OPB — `Menunggu TTD → Menunggu OPB → OPB Terbit`.
 * Jadi tidak ada baris contoh yang punya OPB tanpa nota, dan jumlah nota selalu ≥ jumlah OPB.
 *
 * Komposisi tiap cabang:
 * - `notaDiOpb`   : transaksi Agustus yang notanya sudah tercetak DAN sudah masuk OPB
 * - `notaLuarOpb` : nota sudah tercetak tapi belum masuk OPB → temuan "nota belum masuk OPB"
 *
 * Total nota tercetak per cabang (arsip Agustus + transaksi terkini September) dipakai
 * sebagai pembanding jumlah trx di header OPB.
 */

const PALET = [
  {
    kodeWarna: "1G3",
    warna: "Silver Metallic",
    kategori: "Silver",
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)" },
      { kode: "AXT-814", nama: "AXT-814 ULTRA FINE BRIGHT SILVER (0,9L)" },
      { kode: "AXT-811", nama: "AXT-811 FINE WHITE SILVER (0,9L)" },
    ],
  },
  {
    kodeWarna: "3R1",
    warna: "Merah Solid",
    kategori: "Red",
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)" },
      { kode: "AXT-501", nama: "AXT-501 TRANSOXIDE RED (0,9L)" },
    ],
  },
  {
    kodeWarna: "PW2",
    warna: "Pearl White",
    kategori: "Pearl",
    bahan: [
      { kode: "AXT-101", nama: "AXT-101 TRANSPARENT WHITE (0,9L)" },
      { kode: "AXT-910", nama: "AXT-910 WHITE PEARL (0,9L)" },
      { kode: "AXT-911", nama: "AXT-911 FINE WHITE PEARL (0,9L)" },
    ],
  },
  {
    kodeWarna: "SP9",
    warna: "Hitam Special",
    kategori: "Special",
    bahan: [
      { kode: "AXT-207", nama: "AXT-207 BLACK TONER (0,9L)" },
      { kode: "AXT-203", nama: "AXT-203 BLUE BLACK (0,9L)" },
      { kode: "AXT-60", nama: "AXT-60 FLIP CONTROLLER (0,9L)" },
    ],
  },
];

const MOBIL = [
  "Toyota Avanza 2024",
  "Daihatsu Xenia 2023",
  "Honda Mobilio 2022",
  "Suzuki Ertiga 2023",
  "Toyota Kijang Innova 2024",
  "Daihatsu Terios 2023",
  "Mitsubishi Xpander 2024",
  "Honda Brio 2023",
];

/** Prefix plat per cabang (L = Surabaya, N = Malang, P = Jember) */
const PLAT_PREFIX: Record<string, string> = {
  "Auto 2000 Surabaya": "L",
  "Cakrawala Malang": "N",
  "Prima Jember": "P",
};

const HURUF = ["AB", "CD", "EF", "GH", "JK", "LM", "NP", "QR", "ST", "UV", "WX", "YZ"];

type CabangSeed = {
  /** Kode cabang 3 huruf untuk ID transaksi (DOA-<kode>-<ddMMyy>-<urut>) */
  kode: string;
  cabang: string;
  tinter: string;
  prefixReceipt: string;
  opbId: string;
  notaDiOpb: number;
  notaLuarOpb: number;
};

const SEED: CabangSeed[] = [
  /* Agustus: Auto 2000 Surabaya — OPB-2026-0089 mencatat 47 trx, semua sudah ada notanya,
     2 nota belum masuk OPB (transaksi terkini DOA-SBY-260926-001 + 1 arsip) */
  {
    kode: "SBY",
    cabang: "Auto 2000 Surabaya",
    tinter: "Andi Wijaya",
    prefixReceipt: "Auto2000Surabaya",
    opbId: "OPB-2026-0089",
    notaDiOpb: 45,
    notaLuarOpb: 1,
  },
  /* Agustus: Cakrawala Malang — OPB-2026-0088 mencatat 23 trx, nota juga 23 (match bersih) */
  {
    kode: "MLG",
    cabang: "Cakrawala Malang",
    tinter: "Rudi Hartono",
    prefixReceipt: "CakrawalaMalang",
    opbId: "OPB-2026-0088",
    notaDiOpb: 22,
    notaLuarOpb: 0,
  },
  /* Agustus: Prima Jember — OPB-2026-0087 mencatat 31 trx (semua ada notanya);
     4 nota lagi belum masuk OPB */
  {
    kode: "JBR",
    cabang: "Prima Jember",
    tinter: "Eko Prasetyo",
    prefixReceipt: "PrimaJember",
    opbId: "OPB-2026-0087",
    notaDiOpb: 31,
    notaLuarOpb: 4,
  },
];

/** "2026-08-07T08:35:00" + menit → string waktu yang sama formatnya */
function geserMenit(isoTanpaTz: string, menit: number) {
  const d = new Date(isoTanpaTz);
  d.setMinutes(d.getMinutes() + menit);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

type Jenis = "notaDiOpb" | "notaLuarOpb";

function buildRow(
  seed: CabangSeed,
  jenis: Jenis,
  seq: number,
  urutHarian: Map<string, number>,
): TransaksiRow {
  const hari = String(1 + (seq % 28)).padStart(2, "0");
  const tanggal = `2026-08-${hari}`;
  const jam = String(8 + (seq % 8)).padStart(2, "0");
  const menit = String((seq * 7) % 60).padStart(2, "0");
  const waktuMulai = `${tanggal}T${jam}:${menit}:00`;

  /* ID transaksi: DOA-<kode cabang>-<ddMMyy>-<urut harian cabang itu> */
  const tokenTanggal = `${hari}0826`;
  const kunciUrut = `${seed.kode}-${tokenTanggal}`;
  const urut = (urutHarian.get(kunciUrut) ?? 0) + 1;
  urutHarian.set(kunciUrut, urut);
  const id = `DOA-${seed.kode}-${tokenTanggal}-${String(urut).padStart(3, "0")}`;

  const durasiMixingMenit = 12 + (seq % 4) * 6;
  const waktuSelesaiMixing = geserMenit(waktuMulai, durasiMixingMenit);
  /* Semua transaksi contoh sudah cetak nota — di app, nota selalu dicetak sebelum OPB */
  const waktuCetakNota = geserMenit(waktuSelesaiMixing, 4 + (seq % 5));
  const waktuTTD = geserMenit(waktuCetakNota, 3);

  const palet = PALET[seq % PALET.length];
  const bahan = palet.bahan.map((b, bi) => ({
    kode: b.kode,
    nama: b.nama,
    gram: 4 + ((seq + bi * 3) % 9) * 5,
  }));

  const platNomor = `${PLAT_PREFIX[seed.cabang] ?? "L"} ${1001 + (seq % 899)} ${HURUF[seq % HURUF.length]}`;
  const status =
    jenis === "notaLuarOpb" ? "Menunggu OPB" : seq % 5 === 0 ? "Proses Invoice" : "OPB Terbit";

  return {
    id,
    tanggal,
    cabang: seed.cabang,
    warna: palet.warna,
    kodeWarna: palet.kodeWarna,
    kategori: palet.kategori,
    tinter: seed.tinter,
    status,
    receiptId: `RCP-DOA-${seed.prefixReceipt}-${hari}/08/2026-${platNomor.replace(/\s/g, "")}`,
    fotoSample: true,
    total: 150000 + (seq % 7) * 35000,
    mobil: MOBIL[seq % MOBIL.length],
    platNomor,
    noPkb: `PKB-2026-${String(500 + (seq % 400)).padStart(4, "0")}`,
    noVendor: "VND-AXT-001",
    jumlahPanel: 1 + (seq % 3),
    mixingVolume: 40 + (seq % 4) * 10,
    recipeId: `RCP-${palet.kodeWarna}-${40 + (seq % 4) * 10}G`,
    waktuMulai,
    waktuSelesaiMixing,
    durasiMixingMenit,
    waktuCetakNota,
    waktuTTD,
    durasiTotalMenit: durasiMixingMenit + 8,
    bahan,
    opbId: jenis === "notaLuarOpb" ? null : seed.opbId,
  };
}

export const MOCK_TRANSAKSI_ARSIP: TransaksiRow[] = (() => {
  const rows: TransaksiRow[] = [];
  /* urut harian per cabang, reset tiap tanggal */
  const urutHarian = new Map<string, number>();
  let seq = 0;

  for (const seed of SEED) {
    const jadwal: Jenis[] = [
      ...Array<Jenis>(seed.notaDiOpb).fill("notaDiOpb"),
      ...Array<Jenis>(seed.notaLuarOpb).fill("notaLuarOpb"),
    ];
    for (const jenis of jadwal) {
      rows.push(buildRow(seed, jenis, seq, urutHarian));
      seq += 1;
    }
  }

  return rows;
})();

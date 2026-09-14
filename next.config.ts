import type { NextConfig } from "next";

const financeRedirects = [
  ["/finance/coa", "/finance/buku-besar/akun-perkiraan"],
  ["/finance/jurnal", "/finance/buku-besar/jurnal-umum"],
  ["/finance/kas-bank", "/finance/kas-bank/pembayaran"],
  ["/finance/faktur-penjualan", "/finance/penjualan/faktur-penjualan"],
  ["/finance/faktur-pembelian", "/finance/pembelian/faktur-pembelian"],
  ["/finance/hutang-piutang", "/finance/laporan/hutang-piutang"],
  ["/finance/penyesuaian-stok", "/finance/persediaan/penyesuaian-persediaan"],
  ["/finance/neraca", "/finance/laporan/neraca"],
  ["/finance/laba-rugi", "/finance/laporan/laba-rugi"],
  ["/finance/arus-kas", "/finance/laporan/arus-kas"],
  ["/finance/perpajakan", "/finance/laporan/perpajakan"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return financeRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default nextConfig;

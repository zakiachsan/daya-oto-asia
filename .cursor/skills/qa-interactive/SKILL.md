---
name: qa-interactive
description: >-
  Interactive browser-harness QA for daya-oto-asia. Use when the user asks for QA,
  uji, test browser, verifikasi UI, cek feedback, or before marking UI work done.
---

# QA interaktif (browser-harness)

## Prasyarat

1. Dev server: `npm run dev` (port **3300**)
2. Chrome: remote debugging + **Allow** sudah diklik
3. `browser-harness doctor` → daemon OK

## Perintah wajib (urutan)

```bash
npm run qa:interactive
```

Setara:

```bash
python scripts/qa-interactive-harness.py
```

Script ini menjalankan:

1. **Smoke** — `scripts/qa-browser-harness.py` (19 halaman, teks kunci)
2. **Interaktif** — ~35 skenario (feedback #21–#60): wizard transaksi, stok/buka kaleng, stock opname, tukar-nota, terima barang, ops (transaksi/OPB/rekonsiliasi/SJ/PO/ajuan), finance (proses invoice, batch faktur, rekap). Lihat `scripts/qa-interactive-harness-body.py`.

## Smoke saja (tanpa klik)

```bash
npm run qa:harness
npm run qa:smoke        # HTTP only, node
npm run qa:browser      # Playwright headless
```

## Laporan ke user

- Ringkas PASS/FAIL per baris output
- Sebut jika smoke OK tapi interaktif FAIL (biasanya selector/hydration)
- Jangan commit API key; QA tidak butuh Deepseek

## User trigger phrases (Indonesia)

- "QA interaktif" / "QA browser" / "uji UI" / "cek feedback di browser"
→ jalankan **`npm run qa:interactive`** tanpa ditanya lagi, kecuali user bilang **smoke only**.

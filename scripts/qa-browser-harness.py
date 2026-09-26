"""QA via browser-harness CDP (Chrome). Jalankan saat dev server :3300 hidup."""
import subprocess
import sys

BASE = "http://localhost:3300"

# Selaras dengan qa-feedback-check.mjs + qa-feedback-browser.mjs (batch 21–60)
CHECKS = [
    {"no": 21, "path": "/app/transaksi/baru", "must": ["Receipt", "Mulai Mixing"]},
    {"no": 24, "path": "/app/transaksi/baru", "must": ["Clear Coat"]},
    {"no": 30, "path": "/app/transaksi/baru", "must": ["Mixing"]},
    {"no": 32, "path": "/app/transaksi/baru", "must": ["Foto & Nota"]},
    {"no": 32, "path": "/app/transaksi", "must": ["Transaksi"]},
    {"no": 36, "path": "/app/transaksi", "must": ["Transaksi"]},
    {"no": 37, "path": "/app", "must": ["Buat Transaksi"], "must_not": ["Buka Kaleng"]},
    {"no": 38, "path": "/app/stok", "must": ["Stok"], "must_not": ["Ajukan Stok"]},
    {"no": 40, "path": "/app", "must": ["Admin"]},
    {"no": 42, "path": "/app/tukar-nota", "must": ["Tukar-Tambah Nota"]},
    {"no": 43, "path": "/app/terima-barang", "must": ["Terima Barang"]},
    {"no": 46, "path": "/operasional/transaksi", "must": ["Plat"]},
    {"no": 48, "path": "/operasional/opb", "must": ["Proses Invoice"]},
    {"no": 50, "path": "/operasional/rekonsiliasi", "must": ["Rekonsiliasi OPB"]},
    {"no": 51, "path": "/modules", "must_not": ["verifikasi-klaim"]},
    {"no": 54, "path": "/operasional/surat-jalan", "must": ["Surat Jalan"]},
    {"no": 56, "path": "/finance/penjualan/proses-invoice", "must": ["Proses Invoice"]},
    {"no": 59, "path": "/finance/surat-jalan", "must": ["View Only"]},
    {"no": 60, "path": "/finance/laporan/rekap-pemakaian-cabang", "must": ["Rekap Pemakaian Cabang"]},
]

script = """
ensure_real_tab()
import time
results = []
"""

first_url = f"{BASE}{CHECKS[0]['path']}"
script += f"new_tab({first_url!r})\n"

for i, c in enumerate(CHECKS):
    url = f"{BASE}{c['path']}"
    if i > 0:
        script += f"goto_url({url!r})\n"
    script += "time.sleep(2.5)\n"
    script += 'body = js("return document.body.innerText") or ""\n'
    script += "body_l = body.lower()\n"
    must = c.get("must") or []
    must_not = c.get("must_not") or []
    script += f"""
miss = [t for t in {must!r} if t.lower() not in body_l]
bad = [t for t in {must_not!r} if t.lower() in body_l]
ok = len(miss) == 0 and len(bad) == 0
results.append(({c['no']!r}, {url!r}, ok, miss, bad))
"""

script += """
for no, url, ok, miss, bad in results:
    detail = ""
    if miss:
        detail += " miss=" + ",".join(miss)
    if bad:
        detail += " forbid=" + ",".join(bad)
    print(f"{'PASS' if ok else 'FAIL'} | #{no} | {url}{detail}")
pass_n = sum(1 for r in results if r[2])
print(f"\\nBrowser-harness QA: {pass_n}/{len(results)} pass")
if not all(r[2] for r in results):
    raise SystemExit(1)
"""

proc = subprocess.run(
    ["browser-harness"],
    input=script,
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)
print(proc.stdout)
if proc.stderr:
    print(proc.stderr, file=sys.stderr)
sys.exit(proc.returncode)

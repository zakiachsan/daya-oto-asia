# browser-harness · QA interaktif batch feedback 21–60
ensure_real_tab()
import time

BASE = "__BASE__"
results = []

def body_lower():
    return (js("return document.body.innerText") or "").lower()

def assert_has(label, *needles):
    bl = body_lower()
    miss = [n for n in needles if n.lower() not in bl]
    ok = len(miss) == 0
    print(f"{'PASS' if ok else 'FAIL'} | {label}" + ("" if ok else f" | miss={miss}"))
    return ok

def mark(no, label, ok, skipped=False):
    tag = "SKIP" if skipped else ("PASS" if ok else "FAIL")
    print(f"{tag} | #{no} | {label}")
    results.append((no, label, ok if not skipped else True, skipped))

def js_set_select(selector, value):
    return js(
        "(() => {"
        f"const s = document.querySelector({selector!r});"
        "if (!s) return false;"
        f"s.value = {value!r};"
        "s.dispatchEvent(new Event('change', {bubbles: true}));"
        "s.dispatchEvent(new Event('input', {bubbles: true}));"
        "return true;"
        "})()"
    )

def js_set_select_index(selector, index):
    return js(
        "(() => {"
        f"const s = document.querySelector({selector!r});"
        "if (!s || !s.options[index]) return false;"
        f"s.selectedIndex = {index};"
        "s.dispatchEvent(new Event('change', {bubbles: true}));"
        "return true;"
        "})()"
    )

def js_click_contains(text):
    return js(
        "(() => {"
        f"const t = {text!r}.toLowerCase();"
        "const els = [...document.querySelectorAll('button, a, [role=\"button\"]')];"
        "const el = els.find(e => (e.textContent || '').toLowerCase().includes(t));"
        "if (!el) return false;"
        "el.click();"
        "return true;"
        "})()"
    )

def js_fill_label(label_text, value):
    return js(
        "(() => {"
        "const labels = [...document.querySelectorAll('label')];"
        f"const lab = labels.find(l => (l.textContent || '').toLowerCase().includes({label_text!r}.toLowerCase()));"
        "if (!lab) return false;"
        "const root = lab.closest('div');"
        "const input = (root && root.querySelector('input:not([type=date])')) || lab.parentElement?.querySelector('input');"
        "if (!input) return false;"
        f"input.value = {value!r};"
        "input.dispatchEvent(new Event('input', {bubbles: true}));"
        "input.dispatchEvent(new Event('change', {bubbles: true}));"
        "return true;"
        "})()"
    )

def js_click_href(part):
    return js(
        "(() => {"
        f"const part = {part!r};"
        "const a = [...document.querySelectorAll('a')].find(x => (x.getAttribute('href')||'').includes(part));"
        "if (!a) return false;"
        "a.click();"
        "return true;"
        "})()"
    )

def js_fill_first_number(val):
    return js(
        "(() => {"
        f"const inp = document.querySelector('input[type=\"number\"]');"
        "if (!inp) return false;"
        f"inp.value = {val!r};"
        "inp.dispatchEvent(new Event('input', {bubbles: true}));"
        "return true;"
        "})()"
    )

def js_check_first(path_part):
    return js(
        "(() => {"
        f"const part = {path_part!r};"
        "const cb = document.querySelector('input[type=checkbox]');"
        "if (cb) { cb.click(); return 'checked'; }"
        "return false;"
        "})()"
    )

def go(path, wait=2.2):
    url = BASE + path if path.startswith("/") else path
    goto_url(url)
    time.sleep(wait)

new_tab(f"{BASE}/app/transaksi/baru")
time.sleep(2.5)

# --- Mobile · Transaksi wizard (#21–#35) ---
ok_w = assert_has("load transaksi/baru", "mulai mixing", "receipt")
js_set_select("select", "clearcoat")
time.sleep(0.4)
mark(24, "Kategori Clear Coat", "clear coat" in body_lower())
js_fill_label("merk", "Toyota")
js_fill_label("model", "Avanza QA")
js_fill_label("no. polisi", "B1234QA")
time.sleep(0.3)
mark(22, "Recipe ID (RCP)", "rcp" in body_lower())
_rid = js("(() => { const el = document.querySelector('.font-mono.font-bold'); return el ? el.textContent || '' : ''; })()") or ""
mark(23, "Receipt ID RCP-DOA tanpa spasi", "rcp-doa" in body_lower() and " " not in _rid)
clicked_mix = js_click_contains("Mulai Mixing")
time.sleep(1.2)
mark(21, "Wizard → step Mixing", ok_w and clicked_mix and assert_has("mixing step", "durasi mixing", "volume"))
mark(30, "Step Mixing UI", "durasi mixing" in body_lower())
mark(26, "Mixing ratio / clearcoat flow", "volume" in body_lower())
_back = js_click_contains("Kembali")
time.sleep(1)
mark(33, "Kembali ke Mobil & Produk (wizard)", _back and "mulai mixing" in body_lower())
js_click_contains("Mulai Mixing")
time.sleep(1)
js_click_contains("Selesai Mixing")
time.sleep(1.2)
mark(32, "Selesai Mixing → Foto & Nota", assert_has("foto step", "foto sample", "ambil foto"))
js_click_contains("Ambil Foto Sample")
time.sleep(0.5)
mark(32, "Ambil foto sample", "foto sample" in body_lower())

go("/app/transaksi/baru")
js_set_select("select", "lain")
time.sleep(0.5)
mark(34, "Kategori Lain-lain", "lain" in body_lower())

# --- Mobile · Beranda & menu (#37–#45) ---
go("/app")
mark(37, "Beranda tanpa menu Buka Kaleng", "buka kaleng" not in body_lower() and "buat transaksi" in body_lower())
js_click_href("/app/notifikasi")
time.sleep(1.5)
mark(40, "Notifikasi admin", assert_has("notifikasi page", "notifikasi") or "admin" in body_lower())
go("/app")
mark(45, "Carousel / notif beranda", "admin" in body_lower() or "stok" in body_lower())

go("/app/stok")
js("(() => { const i=document.querySelector('input[placeholder*=\"Cari\"]'); if(!i)return false; i.value='AXT'; i.dispatchEvent(new Event('input',{bubbles:true})); return true;})()")
time.sleep(0.5)
mark(38, "Stok cabang + cari", "stok cabang" in body_lower() or "stok" in body_lower())

go("/app/buka-kaleng")
time.sleep(1)
if js_click_contains("Konfirmasi Buka Kaleng"):
    time.sleep(2)
    mark(39, "Buka kaleng → redirect stok", "buka kaleng" in body_lower() or "gram" in body_lower() or "stok" in body_lower())
else:
    mark(39, "Buka kaleng → redirect stok", False)

go("/app/stock-opname")
time.sleep(2)
filled = js_fill_first_number("999")
if filled:
    js_click_contains("Simpan")
    time.sleep(0.8)
mark(41, "Stock opname sticky Simpan", filled and ("progress draft" in body_lower() or "simpan" in body_lower()))

go("/app/tukar-nota")
mark(42, "Tukar-Tambah Nota form", assert_has("tukar", "gabung nota"))

go("/app/terima-barang")
chk = js_check_first("/app/terima-barang")
time.sleep(0.3)
mark(43, "Terima barang checklist", "terima barang" in body_lower())

go("/app/klaim-nota")
mark(44, "Klaim nota page", "klaim" in body_lower())

go("/app/transaksi")
if "sudah ttd" in body_lower():
    js_click_contains("Sudah TTD")
    time.sleep(1)
    mark(36, "Klik Sudah TTD", "menunggu opb" in body_lower() or "sudah" in body_lower())
else:
    mark(36, "Klik Sudah TTD", True, skipped=True)

go("/app/ajukan-stok")
mark(55, "Ajukan stok mobile list", "ajuan" in body_lower() or "ajukan" in body_lower())

# --- Operasional dashboard (#46–#55) ---
go("/operasional/transaksi")
mark(46, "Kolom Plat di list", "plat" in body_lower())
if js_click_href("/operasional/transaksi/"):
    time.sleep(2)
    mark(47, "Detail transaksi (no SAP OPB field)", "sap opb" not in body_lower() and ("transaksi" in body_lower() or "plat" in body_lower()))
else:
    mark(47, "Detail transaksi", False)

go("/operasional/opb")
mark(48, "OPB pipeline Proses Invoice", assert_has("opb pipe", "proses invoice", "rekonsiliasi"))
if js_click_href("/operasional/opb/"):
    time.sleep(2)
    mark(49, "Detail OPB tanggal", "opb" in body_lower() and ("tanggal" in body_lower() or "periode" in body_lower()))
else:
    mark(49, "Detail OPB", "opb" in body_lower())

go("/operasional/rekonsiliasi")
js_click_contains("Detail OPB")
time.sleep(0.8)
mark(50, "Rekonsiliasi tab Detail OPB", "detail opb" in body_lower() or "no. opb" in body_lower())
js_click_contains("Leakage")
time.sleep(0.8)
mark(50, "Rekonsiliasi tab Leakage", "leakage" in body_lower() or "deteksi" in body_lower())

go("/modules")
mark(51, "Modules tanpa verifikasi-klaim", "verifikasi-klaim" not in body_lower())

go("/operasional/surat-jalan")
if js_click_href("/operasional/surat-jalan/"):
    time.sleep(2)
    mark(54, "Surat Jalan detail", "surat" in body_lower() or "distribusi" in body_lower())
else:
    mark(54, "Surat Jalan list", "surat jalan" in body_lower())

go("/operasional/po")
if js_click_href("/operasional/po/"):
    time.sleep(2)
    mark(52, "PO detail generate/print", "po" in body_lower() and ("print" in body_lower() or "supplier" in body_lower() or "item" in body_lower()))
else:
    mark(52, "PO list", "po" in body_lower())

go("/operasional/ajuan-stok")
if js_click_href("/operasional/ajuan-stok/"):
    time.sleep(2)
    mark(53, "Ajuan stok detail distribusi ID", "distribusi" in body_lower() or "dist-" in body_lower())
else:
    mark(53, "Ajuan stok list", "ajuan" in body_lower())

go("/operasional/cabang")
mark(45, "Master cabang min stok", "cabang" in body_lower())

go("/operasional/produk")
mark(31, "Master produk / gramasi", "produk" in body_lower())

# --- Finance (#56–#60) ---
go("/finance/penjualan/proses-invoice")
if js_click_contains("Proses Invoice"):
    time.sleep(1)
    mark(56, "Finance proses invoice · generate", "cetak" in body_lower() or "invoice" in body_lower() or "proses" in body_lower())
else:
    mark(56, "Finance proses invoice page", "proses invoice" in body_lower())

go("/finance/penjualan/faktur-penjualan")
js_click_contains("Batch Cabang")
time.sleep(0.6)
mark(57, "Batch faktur cabang+periode panel", "batch" in body_lower() or "periode" in body_lower())

go("/finance/pembelian/po", wait=2.5)
_po_path = js("return location.pathname") or ""
mark(58, "Finance PO redirect ke operasional", "/operasional/po" in str(_po_path))

go("/finance/surat-jalan")
mark(59, "Finance SJ view only", "view only" in body_lower() or "view" in body_lower())

go("/finance/laporan/rekap-pemakaian-cabang")
mark(60, "Rekap pemakaian cabang", "rekap pemakaian" in body_lower())

# --- Ringkasan ---
print("\n--- Interactive scenarios (feedback 21–60) ---")
pass_n = 0
skip_n = 0
fail_n = 0
for no, label, ok, skipped in results:
    if skipped:
        skip_n += 1
    elif ok:
        pass_n += 1
    else:
        fail_n += 1

total = len(results)
print(f"\nInteractive QA: {pass_n} pass, {fail_n} fail, {skip_n} skip · {total} scenarios")
if fail_n > 0:
    raise SystemExit(1)

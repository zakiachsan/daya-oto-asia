import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "Bahan Brainstorming" / "List Produk AXT.xlsx"
OUT = ROOT / "src" / "lib" / "axt-products.ts"


def parse_kode(product: str) -> str:
    m = re.match(r"^(AXT[\s-]?[\w-]+)", product.upper())
    if m:
        return m.group(1).replace(" ", "-").replace("--", "-")
    return product[:20]


def map_satuan(category: str) -> str:
    cat = category.upper()
    toner_cats = [
        "1K SOLID",
        "1K SILVER",
        "1K PEARL",
        "1K CRYSTAL",
        "1K SPECIAL",
        "1K COLORFUL",
        "BINDER",
        "CLEAR COAT",
        "PRIMER",
        "DEGREASER",
    ]
    if any(x in cat for x in toner_cats):
        return "gram"
    return "liter"


def map_kategori_tarif(category: str) -> str:
    cat = category.upper()
    if "XYRALIC" in cat or "CRYSTAL PEARL" in cat:
        return "Xyralic"
    if "PEARL" in cat:
        return "Pearl"
    if "SILVER" in cat or "COLORFUL EFFECT SILVER" in cat:
        return "Silver"
    if "SPECIAL EFFECT" in cat:
        return "Special"
    if "SOLID" in cat:
        return "Standard"
    if "CLEAR COAT" in cat:
        return "Clear Coat"
    if "PRIMER" in cat or "SURFACER" in cat or "FILLER" in cat:
        return "Surfacers"
    if "THINNER" in cat:
        return "Thinner"
    if "DEGREASER" in cat:
        return "Degreaser"
    return "Lainnya"


def main() -> None:
    wb = openpyxl.load_workbook(XLSX)
    ws = wb.active
    products = []
    seen: set[str] = set()

    for row in ws.iter_rows(min_row=4, values_only=True):
        no, product, category, berat_kaleng, berat_bersih = row[:5]
        if not product:
            continue
        product = str(product).strip()
        category = str(category or "").strip()
        kode = parse_kode(product)
        if kode in seen:
            kode = f"{kode}-{len(seen)}"
        seen.add(kode)

        vol_match = re.search(r"\(([\d,\.]+)\s*L\)", product, re.I)
        default_berat = 900 if vol_match else 1000

        products.append(
            {
                "kode": kode,
                "nama": product,
                "kategoriAxalta": category,
                "kategoriTarif": map_kategori_tarif(category),
                "satuan": map_satuan(category),
                "beratKaleng": int(berat_kaleng) if berat_kaleng else default_berat,
                "beratBersih": int(berat_bersih) if berat_bersih else default_berat,
                "status": "Aktif",
            }
        )

    header = """/** Auto-generated from List Produk AXT.xlsx — 76 produk Axalta */
export type AxtProduk = {
  kode: string;
  nama: string;
  kategoriAxalta: string;
  kategoriTarif: string;
  satuan: "gram" | "liter";
  beratKaleng: number;
  beratBersih: number;
  status: "Aktif" | "Nonaktif";
};

export const AXT_PRODUK: AxtProduk[] = """

    OUT.write_text(header + json.dumps(products, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"written {len(products)} products -> {OUT}")


if __name__ == "__main__":
    main()

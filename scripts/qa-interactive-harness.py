"""
QA interaktif · browser-harness (Chrome CDP).

Prasyarat:
  - npm run dev  (port 3300)
  - browser-harness doctor OK (Chrome + Allow remote debugging)

Jalankan:
  python scripts/qa-interactive-harness.py
  npm run qa:interactive
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "http://localhost:3300"
BODY_FILE = Path(__file__).resolve().parent / "qa-interactive-harness-body.py"


def load_interactive_script() -> str:
    return BODY_FILE.read_text(encoding="utf-8").replace("__BASE__", BASE)


def main() -> int:
    print("=== Smoke (browser-harness, halaman) ===")
    smoke = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "qa-browser-harness.py")],
        cwd=ROOT,
    )
    if smoke.returncode != 0:
        print("Smoke gagal — hentikan sebelum interaktif.")
        return smoke.returncode

    print("\n=== Interactive (browser-harness, klik/isian) ===")
    proc = subprocess.run(
        ["browser-harness"],
        input=load_interactive_script(),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    print(proc.stdout)
    if proc.stderr:
        print(proc.stderr, file=sys.stderr)
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())

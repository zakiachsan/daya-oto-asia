"""
QA agent browser-use + DeepSeek API.

Setup (sekali):
  1. Buat `.env.local` di root project (gitignored):
     DEEPSEEK_API_KEY=sk-...
     DEEPSEEK_BASE_URL=https://api.deepseek.com/v1   # opsional
  2. npm run dev  →  http://localhost:3300
  3. python scripts/qa-browser-use-deepseek.py

Tanpa key → fallback `npm run qa:interactive` (browser-harness, gratis).
"""
from __future__ import annotations

import asyncio
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASK_FILE = ROOT / "scripts" / "qa-agent-task.md"
MAX_STEPS = int(os.environ.get("QA_AGENT_MAX_STEPS", "45"))


def load_env_local() -> None:
    env_local = ROOT / ".env.local"
    if not env_local.exists():
        return
    for line in env_local.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def fallback_harness() -> int:
    print("Fallback → QA interaktif browser-harness (tanpa LLM)\n")
    return subprocess.call(
        [sys.executable, str(ROOT / "scripts" / "qa-interactive-harness.py")],
        cwd=ROOT,
    )


def load_task() -> str:
    if TASK_FILE.exists():
        return TASK_FILE.read_text(encoding="utf-8")
    return "QA http://localhost:3300 — laporkan PASS/FAIL per halaman utama."


async def run_agent() -> int:
    from browser_use import Agent, ChatDeepSeek

    key = os.environ.get("DEEPSEEK_API_KEY")
    if not key:
        return fallback_harness()

    llm = ChatDeepSeek(
        model=os.environ.get("DEEPSEEK_MODEL", "deepseek-chat"),
        api_key=key,
        base_url=os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1"),
        temperature=0.1,
    )

    task = load_task()
    print(f"=== browser-use Agent + DeepSeek ({llm.model}) ===")
    print(f"Max steps: {MAX_STEPS}\n")

    agent = Agent(task=task, llm=llm)
    history = await agent.run(max_steps=MAX_STEPS)
    print("\n=== Agent selesai ===")
    if history is not None:
        final = getattr(history, "final_result", None) or str(history)
        print(final)
    return 0


def main() -> int:
    load_env_local()
    key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    if not key or key.startswith("sk-your"):
        print("DEEPSEEK_API_KEY belum diisi — fallback harness (gratis).\n")
        print("Isi key di .env.local lalu jalankan lagi: npm run qa:agent\n")
        return fallback_harness()
    try:
        return asyncio.run(run_agent())
    except ImportError as e:
        print(f"Dependency missing: {e}")
        print("Install: pip install browser-use")
        return fallback_harness()
    except Exception as e:
        print(f"Agent error: {e}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

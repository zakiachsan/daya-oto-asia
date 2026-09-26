---
name: qa-agent-deepseek
description: >-
  LLM browser-use QA with DeepSeek API for daya-oto-asia. Use when user asks QA agent,
  QA DeepSeek, browser-use QA, or intelligent/exploratory QA (not smoke-only).
---

# QA Agent + DeepSeek

## Prasyarat

1. `npm run dev` on port **3300**
2. File **`.env.local`** with `DEEPSEEK_API_KEY` (see `.env.example`) — never commit keys
3. `pip install browser-use` (already on user machine)

## Jalankan

```bash
npm run qa:agent
```

Uses `scripts/qa-agent-task.md` as the agent task (checklist feedback #21–#60).

Without API key → auto-fallback **`npm run qa:interactive`**.

## vs browser-harness

| | `qa:agent` | `qa:interactive` |
|---|------------|-------------------|
| Otak | DeepSeek via API | Script tetap |
| Browser | browser-use (Playwright) | Chrome user + CDP |
| Biaya | API tokens | Gratis |
| Fleksibel | Ya, adaptif | Ya, deterministik |

## User phrases

- "QA pakai DeepSeek" / "QA agent" / "browser-use QA"
→ run **`npm run qa:agent`** if `.env.local` exists; else ask user to add key to `.env.local` once, then run.

Do not paste API keys into chat or tracked files.

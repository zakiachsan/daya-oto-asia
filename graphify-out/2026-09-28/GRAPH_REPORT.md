# Graph Report - daya-oto-asia  (2026-09-26)

## Corpus Check
- 291 files · ~611,136 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1424 nodes · 3786 edges · 124 communities (79 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4db92ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- useHutangPiutang
- PoDetailPage
- mock-data.ts
- module-guide-page.tsx
- preview-store.ts
- setup-github-actions.mjs
- finance-payment-page.tsx
- jurnal-utils.ts
- useToast
- lucide-react
- absensi-utils.ts
- jurnal-builders.ts
- useMobileHrPending
- slip-gaji-utils.ts
- useInventoriStok
- laporan-pemakaian-preview.tsx
- operasional/transaksi/[id]/page.tsx
- BuatTransaksiContent
- dashboard-shell.tsx
- What You Must Do When Invoked
- FinanceContactMasterPage
- baru/page.tsx
- opb/[id]/page.tsx
- compilerOptions
- formula-utils.ts
- useDistribusiList
- po/[id]/page.tsx
- inventori-utils.ts
- package.json
- useIzinList
- clear-coat-mixing-chart.ts
- stock-opname-utils.ts
- FinancePaymentPage
- useTransaksiList
- penyesuaian-persediaan/page.tsx
- hr-analytics/page.tsx
- qa-interactive-harness-body.py
- FinanceMockPreviewPage
- ajukan-stok/page.tsx
- devDependencies
- useLemburList
- graphify reference: extra exports and benchmark
- scripts
- graphify reference: query, path, explain
- preview-click-handler.tsx
- graphify reference: add a URL and watch a folder
- POPage
- app/transaksi/[id]/page.tsx
- daftar-laporan/page.tsx
- finance-mock-preview-page.tsx
- useStockOpnameDraft
- generate-feedback-import.mjs
- SyaratPembayaranPage
- toner-picker-modal.tsx
- mixing-ratio-master.ts
- QA interaktif (browser-harness)
- assess-feedback-sheet.mjs
- qa-browser-use-deepseek.py
- finance-mock-preview-data.ts
- QA Agent + DeepSeek
- dependencies
- AssignmentPage
- write
- graphify reference: commit hook and native CLAUDE.md integration
- vercel.json
- setup-server.sh
- eslint.config.mjs
- check-sheet-detail.mjs
- check-sheet-rows.mjs
- gen-axt-products.py
- gen-finance-placeholders.mjs
- QA Agent Task · Daya Oto Asia (feedback batch 21–60)
- update-finance-mock-pages.mjs
- distribusi-utils.ts
- graphify reference: incremental update and cluster-only
- transaksi-draft-utils.ts
- next.config.ts
- qa-interactive-harness.py
- update-finance-paths.mjs
- kode-warna-formulas.ts
- setup-ssl.sh
- playwright
- qa-feedback-check.mjs
- login/page.tsx
- guide-sections.tsx
- graphify reference: GitHub clone and cross-repo merge
- This is NOT the Next.js you know
- deploy-app.sh
- List Produk AXT_8b30c956.md
- next-env.d.ts
- postcss.config.mjs
- qa-browser-harness.py
- kasbon/page.tsx
- lembur-utils.ts
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 111 edges
2. `lucide-react` - 100 edges
3. `formatIDR()` - 96 edges
4. `PageHeader()` - 71 edges
5. `react` - 69 edges
6. `StatusBadge()` - 52 edges
7. `DataTable()` - 44 edges
8. `BuatTransaksiContent()` - 43 edges
9. `useTransaksiList()` - 40 edges
10. `FinanceMockPreviewPage()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `FinanceDashboard()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/page.tsx → src/lib/mock-data.ts
- `AbsensiPage()` --calls--> `useIzinList()`  [EXTRACTED]
  src/app/(dashboard)/hris/absensi/page.tsx → src/lib/preview-store.ts
- `handleGenerate()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/operasional/opb/page.tsx → src/lib/mock-data.ts
- `TransaksiPage()` --calls--> `useTransaksiList()`  [EXTRACTED]
  src/app/(dashboard)/operasional/transaksi/page.tsx → src/lib/preview-store.ts
- `useTransaksiList()` --indirect_call--> `normalizeTransaksiRow()`  [INFERRED]
  src/lib/preview-store.ts → src/lib/transaksi-row-normalize.ts

## Import Cycles
- None detected.

## Communities (124 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.15
Nodes (24): react, KaryawanRow, CabangRow, PRODUK_AKTIF, LOKASI, PRODUK_AKTIF, KatRow, KodeRow (+16 more)

### Community 1 - "useHutangPiutang"
Cohesion: 0.20
Nodes (13): ProsesInvoicePage(), prosesInvoice(), STEPS, OpbDetailPage(), OPBPage(), handleGenerate(), buildBatchFaktur(), transaksiForBatch() (+5 more)

### Community 2 - "PoDetailPage"
Cohesion: 0.24
Nodes (12): FakturPembelianPage(), handleGenerate(), initReceiveDraft(), PoDetailPage(), handleProsesPenerimaan(), setLineQty(), toggleLine(), buildFakturBeliFromPo() (+4 more)

### Community 3 - "mock-data.ts"
Cohesion: 0.06
Nodes (37): ArusKasPage(), GrafikPage(), HutangPiutangPage(), HutangPiutangDetailPage(), LabaDitahanPage(), LabaRugiPage(), LaporanPembelianPage(), LaporanPenjualanPage() (+29 more)

### Community 4 - "module-guide-page.tsx"
Cohesion: 0.09
Nodes (26): GUIDE_RAIL_ACCENT, MODULE_LABELS, MODULE_THEME, ModuleGuidePage(), ModuleGuidePageProps, F, financeGuideNav, H (+18 more)

### Community 5 - "preview-store.ts"
Cohesion: 0.07
Nodes (33): AdminNotification, SEED_ADMIN_NOTIFICATIONS, HUTANG_BY_VENDOR, INITIAL_PELANGGAN, INITIAL_PEMASOK, INITIAL_SYARAT_PEMBAYARAN, INITIAL_TRANSFER_BANK, KAS_BANK_ACCOUNTS (+25 more)

### Community 6 - "setup-github-actions.mjs"
Cohesion: 0.06
Nodes (26): conn, __dirname, nginx, nginxB64, ssl, sslB64, conn, conn (+18 more)

### Community 7 - "finance-payment-page.tsx"
Cohesion: 0.15
Nodes (23): handlePost(), FakturPenjualanDetailPage(), handlePost(), handleSave(), resolveHutang(), resolvePiutang(), PaymentMode, FakturBeliRow (+15 more)

### Community 8 - "jurnal-utils.ts"
Cohesion: 0.09
Nodes (29): HistoriAkunPage(), JurnalPage(), handlePost(), LineDraft, JurnalDetailPage(), FinanceDashboard(), PenyesuaianStokDetailPage(), handlePost() (+21 more)

### Community 9 - "useToast"
Cohesion: 0.07
Nodes (16): COAPage(), FakturPenjualanPage(), KaryawanPage(), UsersPage(), CabangPage(), KategoriHargaPage(), KodeWarnaPage(), ProdukPage() (+8 more)

### Community 10 - "lucide-react"
Cohesion: 0.12
Nodes (25): lucide-react, COARow, AbsensiPage(), MOCK_ABSENSI, REKAP, TABS, INITIAL_USERS, UserRow (+17 more)

### Community 11 - "absensi-utils.ts"
Cohesion: 0.11
Nodes (28): AppAbsensiContent(), completeCheckIn(), handleCheckIn(), handleConfirmLuarRadius(), AbsensiRiwayatRow, AbsensiStatus, absensiStatusClass(), buildInitialAbsensiRiwayat() (+20 more)

### Community 12 - "jurnal-builders.ts"
Cohesion: 0.11
Nodes (36): AccountMovement, ArusKasRow, balanceSheetSaldo(), buildArusKas(), buildLabaRugi(), buildNeraca(), CASH_CODES, coaByKode() (+28 more)

### Community 13 - "useMobileHrPending"
Cohesion: 0.25
Nodes (6): ProfilPage(), MobileShell(), NAV, isPendingHrStatus(), useMobileHrPending(), useMobileKinerjaRingkas()

### Community 14 - "slip-gaji-utils.ts"
Cohesion: 0.11
Nodes (26): KinerjaPage(), SlipGajiPage(), SlipGajiDetailPage(), AppSlipGajiPage(), handlePrint(), printSlipGajiPreview(), SlipGajiPreview(), SlipGajiPreviewProps (+18 more)

### Community 15 - "useInventoriStok"
Cohesion: 0.20
Nodes (16): AppStockOpnamePage(), getInputValues(), handleSaveAllDraft(), handleSubmitBatch(), StokContent(), InventoriAlertTable(), formatStokBreakdown(), InventoriStokRow (+8 more)

### Community 16 - "laporan-pemakaian-preview.tsx"
Cohesion: 0.18
Nodes (20): LaporanPemakaianPage(), handlePrint(), DayBlock(), LaporanPemakaianPreview(), LaporanPemakaianPreviewProps, printLaporanPemakaianPreview(), buildLaporanGrid(), buildLaporanPemakaian() (+12 more)

### Community 17 - "operasional/transaksi/[id]/page.tsx"
Cohesion: 0.06
Nodes (49): TransaksiDetailPage(), advanceAdminStatus(), CABANG_OPTIONS, STATUS_OPTIONS, TransaksiPage(), Props, TransaksiCatatanPanel(), Props (+41 more)

### Community 18 - "BuatTransaksiContent"
Cohesion: 0.13
Nodes (22): BuatTransaksiContent(), addCustomKode(), applyAutoMixingFormula(), buildLayers(), buildRow(), finishMixing(), handleSaveDraft(), handleTambahBahan() (+14 more)

### Community 19 - "dashboard-shell.tsx"
Cohesion: 0.16
Nodes (11): HRISPage(), DashboardShell(), ModuleLanding(), ModuleLandingProps, MOCK_USER, getModuleByPath(), getModuleMenus(), MOBILE_MODULE (+3 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "FinanceContactMasterPage"
Cohesion: 0.24
Nodes (5): FinanceContactMasterPage(), handleSave(), openAdd(), resetForm(), findSyaratBayar()

### Community 22 - "baru/page.tsx"
Cohesion: 0.12
Nodes (18): STEPS, VOLUME_PRESETS, MOCK_KODE_WARNA, TransaksiLayer, BASECOAT, CLEAR_COAT, DEMPUL, ExtraKodeForOptions (+10 more)

### Community 23 - "opb/[id]/page.tsx"
Cohesion: 0.06
Nodes (55): handlePrint(), RekonsiliasiPage(), NotaPreview(), NotaPreviewProps, printNotaPreview(), OpbPreview(), OpbPreviewProps, printOpbPreview() (+47 more)

### Community 24 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "formula-utils.ts"
Cohesion: 0.19
Nodes (13): handleSaveFormula(), loadSavedFormula(), findAxtProduct(), FormulaLine, formulaStorageBaseVolume(), mixingGuideLinesForLayer(), resolveFormulaNames(), scaleFormulaGrams() (+5 more)

### Community 26 - "useDistribusiList"
Cohesion: 0.22
Nodes (8): FinanceSuratJalanPage(), DistribusiDetailPage(), DistribusiPage(), handleSave(), emptyLine(), SuratJalanDetailPage(), SuratJalanOpsPage(), useDistribusiList()

### Community 27 - "po/[id]/page.tsx"
Cohesion: 0.17
Nodes (14): ReceiveDraft, LineItem, FinanceLinkBadge(), MOCK_PRODUK, FINANCE_STATUS_CLASS, FINANCE_STATUS_LABELS, FinanceLinkStatus, HARGA_EST (+6 more)

### Community 28 - "inventori-utils.ts"
Cohesion: 0.18
Nodes (13): InventoriPage(), namaTanpaKode(), ProductSearchSelect(), ProductSearchSelectProps, buildInventoriRow(), deriveStatus(), formatProdukOptionLabel(), INITIAL_INVENTORI (+5 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (14): allowScripts, ssh2@1.17.0, name, private, version, eslint, eslint-config-next, react-dom (+6 more)

### Community 30 - "useIzinList"
Cohesion: 0.24
Nodes (5): IzinDetailPage(), IzinPage(), MobileIzinDetailPage(), AppIzinPage(), useIzinList()

### Community 31 - "clear-coat-mixing-chart.ts"
Cohesion: 0.24
Nodes (13): ClearCoatMixingRatioChart(), fmtGram(), Props, AXT_280_MS_WEIGHT_CHART, AXT_360_HS_WEIGHT_CHART, chartForClearCoat(), ClearCoatChartKode, clearCoatDisplayName() (+5 more)

### Community 32 - "stock-opname-utils.ts"
Cohesion: 0.21
Nodes (9): StockOpnameDetailPage(), StockOpnamePage(), approveAll(), flagLarge(), MOCK_STOCK_OPNAME, INITIAL_STOCK_OPNAME, isDalamToleransi(), isOpnameRowDalamToleransi() (+1 more)

### Community 33 - "FinancePaymentPage"
Cohesion: 0.27
Nodes (6): FinancePaymentPage(), handleFakturChange(), sisaForFakturBeli(), sisaForFakturJual(), dedupeFakturBeliById(), useFakturBeli()

### Community 34 - "useTransaksiList"
Cohesion: 0.18
Nodes (12): KlaimNotaPage(), NotifikasiPage(), AppHome(), salam(), AppTransaksiPage(), STATUS_OPTIONS, TukarNotaPage(), klaimNotaStatusBadge() (+4 more)

### Community 35 - "penyesuaian-persediaan/page.tsx"
Cohesion: 0.30
Nodes (8): PenyesuaianPersediaanContent(), handleSave(), penyesuaianForOpname(), PenyesuaianDetail, PenyesuaianLine, penyesuaianSlug(), usePenyesuaianStok(), TOLERANSI_GRAM

### Community 36 - "hr-analytics/page.tsx"
Cohesion: 0.40
Nodes (3): recharts, KEHADIRAN, LEMBUR_TREND

### Community 39 - "ajukan-stok/page.tsx"
Cohesion: 0.25
Nodes (8): AjuanStokDetailPage(), AjuanStokPage(), MobileAjuanDetailPage(), AjukanStokPage(), ajuanStatusBadge(), AjuanStokDetail, INITIAL_AJUAN_STOK, useAjuanStok()

### Community 40 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, playwright, ssh2, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 41 - "useLemburList"
Cohesion: 0.24
Nodes (7): LemburDetailPage(), LemburPage(), MobileLemburDetailPage(), AppLemburPage(), handleSubmit(), calcJam(), useLemburList()

### Community 42 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 43 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, qa:agent, qa:browser, qa:harness, qa:interactive (+2 more)

### Community 44 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 45 - "preview-click-handler.tsx"
Cohesion: 0.29
Nodes (6): metadata, AppProviders(), getButtonLabel(), PreviewClickHandler(), shouldSkipButton(), ToastProvider()

### Community 46 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 47 - "POPage"
Cohesion: 0.47
Nodes (5): emptyLine(), POPage(), handleSave(), resetForm(), toLines()

### Community 48 - "app/transaksi/[id]/page.tsx"
Cohesion: 0.20
Nodes (15): KinerjaDetailPage(), TransaksiDetailPage(), LabelCatPreview(), LabelCatPreviewProps, formatDurasi(), formatRecipeId(), isInternalTransaksiId(), ReceiptIdSource (+7 more)

### Community 49 - "daftar-laporan/page.tsx"
Cohesion: 0.28
Nodes (4): REPORT_CATEGORIES, ReportCategory, ReportIcon, ReportItem

### Community 50 - "finance-mock-preview-page.tsx"
Cohesion: 0.25
Nodes (3): FINANCE_PLACEHOLDERS, FinancePlaceholderDef, getFinancePlaceholder()

### Community 51 - "useStockOpnameDraft"
Cohesion: 0.15
Nodes (13): DemoChecklistPage(), StokChainVisual(), initialAssignment(), readObj(), useAssignment(), useDemoChecklist(), useStockOpnameDraft(), writeObj() (+5 more)

### Community 52 - "generate-feedback-import.mjs"
Cohesion: 0.29
Nodes (7): csvCell(), dataLines, __dirname, gsRows, header, outCsv, rows

### Community 53 - "SyaratPembayaranPage"
Cohesion: 0.28
Nodes (5): SyaratPembayaranPage(), handleSave(), openAdd(), resetForm(), syaratBayarLabel()

### Community 54 - "toner-picker-modal.tsx"
Cohesion: 0.32
Nodes (4): TonerPickerModal(), TonerPickerModalProps, AXT_PRODUK, AxtProduk

### Community 55 - "mixing-ratio-master.ts"
Cohesion: 0.39
Nodes (6): findMixingRatio(), gramsFromMixingRatio(), MIXING_RATIO_MASTER, MixingRatioRow, defaultFormulaItemsForKode(), ProdukKategoriId

### Community 56 - "QA interaktif (browser-harness)"
Cohesion: 0.29
Nodes (6): Laporan ke user, Perintah wajib (urutan), Prasyarat, QA interaktif (browser-harness), Smoke saja (tanpa klik), User trigger phrases (Indonesia)

### Community 57 - "assess-feedback-sheet.mjs"
Cohesion: 0.29
Nodes (6): data, done, hdr, row, rows, text

### Community 58 - "qa-browser-use-deepseek.py"
Cohesion: 0.52
Nodes (6): fallback_harness(), load_env_local(), load_task(), main(), QA agent browser-use + DeepSeek API. Setup (sekali): 1. Buat `.env.local` di…, run_agent()

### Community 59 - "finance-mock-preview-data.ts"
Cohesion: 0.29
Nodes (6): FINANCE_MOCK_PREVIEWS, getFinanceMockPreview(), MockColumnDef, MockColumnFormat, MockPreviewTable, MockStatDef

### Community 60 - "QA Agent + DeepSeek"
Cohesion: 0.33
Nodes (5): Jalankan, Prasyarat, QA Agent + DeepSeek, User phrases, vs browser-harness

### Community 61 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, lucide-react, next, react, react-dom, recharts

### Community 62 - "AssignmentPage"
Cohesion: 0.50
Nodes (5): AssignmentPage(), getCabang(), handleSave(), CABANG_LABELS, cabangShort()

### Community 63 - "write"
Cohesion: 0.28
Nodes (13): read(), useCetakNotaLog(), useExtraKodeWarna(), useFinancePayments(), useKasBank(), useKlaimNota(), usePelanggan(), usePemasok() (+5 more)

### Community 64 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 65 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, devCommand, framework, installCommand, $schema

### Community 66 - "setup-server.sh"
Cohesion: 0.60
Nodes (4): build_app(), clone_or_pull(), DEBIAN_FRONTEND, setup-server.sh script

### Community 67 - "eslint.config.mjs"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 68 - "check-sheet-detail.mjs"
Cohesion: 0.40
Nodes (3): expected, missingHarapan, rows

### Community 69 - "check-sheet-rows.mjs"
Cohesion: 0.40
Nodes (4): expected, row, rows, text

### Community 70 - "gen-axt-products.py"
Cohesion: 0.70
Nodes (4): main(), map_kategori_tarif(), map_satuan(), parse_kode()

### Community 71 - "gen-finance-placeholders.mjs"
Cohesion: 0.40
Nodes (4): configPath, keys, root, src

### Community 72 - "QA Agent Task · Daya Oto Asia (feedback batch 21–60)"
Cohesion: 0.40
Nodes (4): Finance, Mobile app, Operasional, QA Agent Task · Daya Oto Asia (feedback batch 21–60)

### Community 74 - "distribusi-utils.ts"
Cohesion: 0.40
Nodes (4): DistLine, DistribusiDetail, INITIAL_DISTRIBUSI, MOCK_DISTRIBUSI

### Community 75 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 77 - "transaksi-draft-utils.ts"
Cohesion: 0.38
Nodes (6): LayerFormulaItem, DraftWizardHydration, fallbackLayerFormulas(), hydrateDraftWizard(), parseLayerFormulas(), TransaksiDraftWizard

### Community 78 - "next.config.ts"
Cohesion: 0.50
Nodes (3): financeRedirects, nextConfig, next

### Community 79 - "qa-interactive-harness.py"
Cohesion: 0.67
Nodes (3): load_interactive_script(), main(), QA interaktif · browser-harness (Chrome CDP). Prasyarat: - npm run dev (port…

### Community 81 - "kode-warna-formulas.ts"
Cohesion: 0.50
Nodes (3): findFormula(), FORMULA_WARNA, FormulaDef

### Community 101 - "kasbon/page.tsx"
Cohesion: 0.60
Nodes (3): KasbonPage(), kasbonStatusBadge(), useKasbon()

### Community 105 - "lembur-utils.ts"
Cohesion: 0.40
Nodes (4): GPS, INITIAL_LEMBUR, LemburDetail, MOCK_LEMBUR

## Knowledge Gaps
- **337 isolated node(s):** `__dirname`, `nginx`, `ssl`, `nginxB64`, `sslB64` (+332 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 521 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `lucide-react` to `react`, `mock-data.ts`, `module-guide-page.tsx`, `finance-payment-page.tsx`, `jurnal-utils.ts`, `useToast`, `absensi-utils.ts`, `useMobileHrPending`, `slip-gaji-utils.ts`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `operasional/transaksi/[id]/page.tsx`, `dashboard-shell.tsx`, `baru/page.tsx`, `opb/[id]/page.tsx`, `po/[id]/page.tsx`, `inventori-utils.ts`, `package.json`, `useIzinList`, `useTransaksiList`, `penyesuaian-persediaan/page.tsx`, `hr-analytics/page.tsx`, `ajukan-stok/page.tsx`, `useLemburList`, `app/transaksi/[id]/page.tsx`, `daftar-laporan/page.tsx`, `finance-mock-preview-page.tsx`, `useStockOpnameDraft`, `toner-picker-modal.tsx`, `login/page.tsx`, `guide-sections.tsx`, `kasbon/page.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `useToast()` connect `useToast` to `react`, `useHutangPiutang`, `PoDetailPage`, `mock-data.ts`, `finance-payment-page.tsx`, `jurnal-utils.ts`, `lucide-react`, `absensi-utils.ts`, `slip-gaji-utils.ts`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `operasional/transaksi/[id]/page.tsx`, `BuatTransaksiContent`, `FinanceContactMasterPage`, `baru/page.tsx`, `opb/[id]/page.tsx`, `useDistribusiList`, `po/[id]/page.tsx`, `inventori-utils.ts`, `useIzinList`, `stock-opname-utils.ts`, `FinancePaymentPage`, `useTransaksiList`, `penyesuaian-persediaan/page.tsx`, `ajukan-stok/page.tsx`, `useLemburList`, `preview-click-handler.tsx`, `POPage`, `app/transaksi/[id]/page.tsx`, `SyaratPembayaranPage`, `AssignmentPage`, `kasbon/page.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `useHutangPiutang`, `mock-data.ts`, `module-guide-page.tsx`, `preview-store.ts`, `finance-payment-page.tsx`, `jurnal-utils.ts`, `useToast`, `lucide-react`, `absensi-utils.ts`, `slip-gaji-utils.ts`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `operasional/transaksi/[id]/page.tsx`, `dashboard-shell.tsx`, `baru/page.tsx`, `opb/[id]/page.tsx`, `po/[id]/page.tsx`, `inventori-utils.ts`, `package.json`, `useIzinList`, `FinancePaymentPage`, `useTransaksiList`, `penyesuaian-persediaan/page.tsx`, `ajukan-stok/page.tsx`, `useLemburList`, `preview-click-handler.tsx`, `app/transaksi/[id]/page.tsx`, `daftar-laporan/page.tsx`, `toner-picker-modal.tsx`, `login/page.tsx`, `kasbon/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `__dirname`, `nginx`, `ssl` to the rest of the system?**
  _337 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.14615384615384616 - nodes in this community are weakly interconnected._
- **Should `mock-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06280193236714976 - nodes in this community are weakly interconnected._
- **Should `module-guide-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09230769230769231 - nodes in this community are weakly interconnected._
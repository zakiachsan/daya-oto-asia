# Graph Report - daya-oto-asia  (2026-09-26)

## Corpus Check
- 282 files · ~600,209 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1361 nodes · 3727 edges · 121 communities (78 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6b17978`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- page-header.tsx
- useTransaksiList
- ops-finance-bridge.ts
- mock-data.ts
- module-guide-page.tsx
- preview-store.ts
- setup-github-actions.mjs
- finance-payment-page.tsx
- formatIDR
- useToast
- data-table.tsx
- absensi-utils.ts
- penyesuaian-persediaan/page.tsx
- lucide-react
- slip-gaji-utils.ts
- useInventoriStok
- laporan-pemakaian-preview.tsx
- nota-penjualan-preview.tsx
- BuatTransaksiContent
- dashboard-shell.tsx
- finance-report-utils.ts
- write
- baru/page.tsx
- rekap-invoice-utils.ts
- compilerOptions
- formula-utils.ts
- useDistribusiList
- (mobile)/app/page.tsx
- inventori-utils.ts
- package.json
- useIzinList
- clear-coat-mixing-chart.ts
- nota-preview.tsx
- jurnal-builders.ts
- finance-contact-master-page.tsx
- sap-opb-preview.tsx
- transaksi-status-utils.ts
- qa-interactive-harness-body.py
- FinanceMockPreviewPage
- ajuan-stok/page.tsx
- devDependencies
- useLemburList
- operasional/transaksi/[id]/page.tsx
- scripts
- monitoring/page.tsx
- preview-click-handler.tsx
- app/transaksi/[id]/page.tsx
- transaksi-catatan-utils.ts
- transaksi-row-normalize.ts
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
- assignment/page.tsx
- TransaksiRow
- KlaimNotaPage
- vercel.json
- setup-server.sh
- eslint.config.mjs
- check-sheet-detail.mjs
- check-sheet-rows.mjs
- gen-axt-products.py
- gen-finance-placeholders.mjs
- QA Agent Task · Daya Oto Asia (feedback batch 21–60)
- update-finance-mock-pages.mjs
- HutangPiutangDetailPage
- operasional/transaksi/page.tsx
- printElementById
- transaksi-draft-utils.ts
- next.config.ts
- qa-interactive-harness.py
- update-finance-paths.mjs
- kode-warna-formulas.ts
- setup-ssl.sh
- playwright
- qa-feedback-check.mjs
- filter-bar.tsx
- guide-sections.tsx
- placeholder-page.tsx
- AGENTS.md
- deploy-app.sh
- List Produk AXT_8b30c956.md
- next-env.d.ts
- postcss.config.mjs
- qa-browser-harness.py

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 111 edges
2. `lucide-react` - 99 edges
3. `formatIDR()` - 96 edges
4. `PageHeader()` - 71 edges
5. `react` - 68 edges
6. `StatusBadge()` - 52 edges
7. `DataTable()` - 44 edges
8. `BuatTransaksiContent()` - 43 edges
9. `useTransaksiList()` - 40 edges
10. `FinanceMockPreviewPage()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `ArusKasPage()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/laporan/arus-kas/page.tsx → src/lib/mock-data.ts
- `GrafikPage()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/laporan/grafik/page.tsx → src/lib/mock-data.ts
- `LabaDitahanPage()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/laporan/laba-ditahan/page.tsx → src/lib/mock-data.ts
- `LabaRugiPage()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/laporan/laba-rugi/page.tsx → src/lib/mock-data.ts
- `LaporanPembelianPage()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/laporan/laporan-pembelian/page.tsx → src/lib/mock-data.ts

## Import Cycles
- None detected.

## Communities (121 total, 16 thin omitted)

### Community 0 - "page-header.tsx"
Cohesion: 0.12
Nodes (19): recharts, LabaDitahanPage(), LaporanPembelianPage(), LaporanPenjualanPage(), PerpajakanPage(), KEHADIRAN, LEMBUR_TREND, KinerjaDetailPage() (+11 more)

### Community 1 - "useTransaksiList"
Cohesion: 0.11
Nodes (32): FakturPenjualanDetailPage(), handlePrint(), FakturPenjualanPage(), ProsesInvoicePage(), prosesInvoice(), STEPS, OpbDetailPage(), CABANG_OPTIONS (+24 more)

### Community 2 - "ops-finance-bridge.ts"
Cohesion: 0.10
Nodes (33): FakturPembelianPage(), handleGenerate(), initReceiveDraft(), PoDetailPage(), handleProsesPenerimaan(), setLineQty(), toggleLine(), ReceiveDraft (+25 more)

### Community 3 - "mock-data.ts"
Cohesion: 0.06
Nodes (34): ArusKasPage(), GrafikPage(), LabaRugiPage(), NeracaPage(), PerubahanEquitasPage(), DistLine, DistribusiDetail, INITIAL_DISTRIBUSI (+26 more)

### Community 4 - "module-guide-page.tsx"
Cohesion: 0.09
Nodes (26): GUIDE_RAIL_ACCENT, MODULE_LABELS, MODULE_THEME, ModuleGuidePage(), ModuleGuidePageProps, F, financeGuideNav, H (+18 more)

### Community 5 - "preview-store.ts"
Cohesion: 0.07
Nodes (34): AdminNotification, SEED_ADMIN_NOTIFICATIONS, HUTANG_BY_VENDOR, INITIAL_PELANGGAN, INITIAL_PEMASOK, INITIAL_SYARAT_PEMBAYARAN, INITIAL_TRANSFER_BANK, KAS_BANK_ACCOUNTS (+26 more)

### Community 6 - "setup-github-actions.mjs"
Cohesion: 0.06
Nodes (26): conn, __dirname, nginx, nginxB64, ssl, sslB64, conn, conn (+18 more)

### Community 7 - "finance-payment-page.tsx"
Cohesion: 0.11
Nodes (27): handlePost(), handlePost(), FinancePaymentPage(), handleFakturChange(), handleSave(), resolveHutang(), resolvePiutang(), sisaForFakturBeli() (+19 more)

### Community 8 - "formatIDR"
Cohesion: 0.11
Nodes (21): HistoriAkunPage(), JurnalPage(), handlePost(), LineDraft, JurnalDetailPage(), RekapPemakaianCabangPage(), FinanceDashboard(), handleGenerate() (+13 more)

### Community 9 - "useToast"
Cohesion: 0.07
Nodes (19): COAPage(), KaryawanPage(), UsersPage(), CabangPage(), KategoriHargaPage(), KodeWarnaPage(), ProdukPage(), ProdukRow (+11 more)

### Community 10 - "data-table.tsx"
Cohesion: 0.17
Nodes (20): KaryawanRow, INITIAL_USERS, UserRow, CabangRow, PRODUK_AKTIF, LOKASI, PRODUK_AKTIF, KatRow (+12 more)

### Community 11 - "absensi-utils.ts"
Cohesion: 0.11
Nodes (25): AppAbsensiContent(), completeCheckIn(), handleCheckIn(), handleConfirmLuarRadius(), AbsensiRiwayatRow, AbsensiStatus, absensiStatusClass(), buildInitialAbsensiRiwayat() (+17 more)

### Community 12 - "penyesuaian-persediaan/page.tsx"
Cohesion: 0.12
Nodes (24): PenyesuaianPersediaanContent(), handleSave(), PenyesuaianStokDetailPage(), handlePost(), StockOpnameDetailPage(), StockOpnamePage(), approveAll(), flagLarge() (+16 more)

### Community 13 - "lucide-react"
Cohesion: 0.21
Nodes (10): lucide-react, react, COARow, LoginPage(), Toast, ToastContext, ToastType, MOBILE_CABANG (+2 more)

### Community 14 - "slip-gaji-utils.ts"
Cohesion: 0.11
Nodes (22): KinerjaPage(), SlipGajiPage(), handlePrint(), printSlipGajiPreview(), SlipGajiPreview(), SlipGajiPreviewProps, calcPotonganAbsensi(), calcPPh21() (+14 more)

### Community 15 - "useInventoriStok"
Cohesion: 0.15
Nodes (18): InventoriPage(), AjukanStokPage(), AppStockOpnamePage(), getInputValues(), handleSaveAllDraft(), handleSubmitBatch(), StokContent(), InventoriAlertTable() (+10 more)

### Community 16 - "laporan-pemakaian-preview.tsx"
Cohesion: 0.18
Nodes (20): LaporanPemakaianPage(), handlePrint(), DayBlock(), LaporanPemakaianPreview(), LaporanPemakaianPreviewProps, printLaporanPemakaianPreview(), buildLaporanGrid(), buildLaporanPemakaian() (+12 more)

### Community 17 - "nota-penjualan-preview.tsx"
Cohesion: 0.16
Nodes (19): NotaPenjualanPreview(), NotaPenjualanPreviewProps, formatNotaPenjualanHarga(), formatNotaPenjualanTanggal(), NOTA_PENJUALAN_GRUP, NotaPenjualanBaris, NotaPenjualanGrup, notaPenjualanNoFromTrxId() (+11 more)

### Community 18 - "BuatTransaksiContent"
Cohesion: 0.14
Nodes (21): BuatTransaksiContent(), addCustomKode(), applyAutoMixingFormula(), buildLayers(), buildRow(), finishMixing(), handleSaveDraft(), handleTambahBahan() (+13 more)

### Community 19 - "dashboard-shell.tsx"
Cohesion: 0.16
Nodes (11): HRISPage(), DashboardShell(), ModuleLanding(), ModuleLandingProps, MOCK_USER, getModuleByPath(), getModuleMenus(), MOBILE_MODULE (+3 more)

### Community 20 - "finance-report-utils.ts"
Cohesion: 0.18
Nodes (21): AccountMovement, ArusKasRow, balanceSheetSaldo(), buildArusKas(), buildLabaRugi(), buildNeraca(), CASH_CODES, coaByKode() (+13 more)

### Community 21 - "write"
Cohesion: 0.17
Nodes (19): KasbonPage(), kasbonStatusBadge(), freshAbsensiRiwayatSeed(), read(), resetAbsensiRiwayatData(), useAbsensiRiwayat(), useCetakNotaLog(), useExtraKodeWarna() (+11 more)

### Community 22 - "baru/page.tsx"
Cohesion: 0.13
Nodes (16): STEPS, VOLUME_PRESETS, BASECOAT, CLEAR_COAT, DEMPUL, ExtraKodeForOptions, extraKodeOptionsForProdukKategori(), hargaForProdukOption() (+8 more)

### Community 23 - "rekap-invoice-utils.ts"
Cohesion: 0.18
Nodes (17): RekapInvoicePreview(), RekapInvoicePreviewProps, astraPelangganRekap(), buildRekapInvoiceLines(), BULAN_SINGKAT, cabangMatches(), calcTotalWithPpn(), formatPlatRekap() (+9 more)

### Community 24 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "formula-utils.ts"
Cohesion: 0.18
Nodes (14): handleSaveFormula(), loadSavedFormula(), findAxtProduct(), FormulaLine, formulaStorageBaseVolume(), mixingGuideLinesForLayer(), resolveFormulaNames(), scaleFormulaGrams() (+6 more)

### Community 26 - "useDistribusiList"
Cohesion: 0.16
Nodes (9): FinanceSuratJalanPage(), DistribusiDetailPage(), DistribusiPage(), handleSave(), emptyLine(), SuratJalanDetailPage(), SuratJalanOpsPage(), TerimaBarangPage() (+1 more)

### Community 27 - "(mobile)/app/page.tsx"
Cohesion: 0.18
Nodes (10): NotifikasiPage(), AppHome(), salam(), ProfilPage(), MobileShell(), NAV, isPendingHrStatus(), useMobileHrPending() (+2 more)

### Community 28 - "inventori-utils.ts"
Cohesion: 0.21
Nodes (12): namaTanpaKode(), ProductSearchSelect(), ProductSearchSelectProps, buildInventoriRow(), deriveStatus(), formatProdukOptionLabel(), INITIAL_INVENTORI, InventoriStokAdjust (+4 more)

### Community 29 - "package.json"
Cohesion: 0.13
Nodes (14): allowScripts, ssh2@1.17.0, name, private, version, eslint, eslint-config-next, react-dom (+6 more)

### Community 30 - "useIzinList"
Cohesion: 0.16
Nodes (9): AbsensiPage(), MOCK_ABSENSI, REKAP, TABS, IzinDetailPage(), IzinPage(), MobileIzinDetailPage(), AppIzinPage() (+1 more)

### Community 31 - "clear-coat-mixing-chart.ts"
Cohesion: 0.24
Nodes (13): ClearCoatMixingRatioChart(), fmtGram(), Props, AXT_280_MS_WEIGHT_CHART, AXT_360_HS_WEIGHT_CHART, chartForClearCoat(), ClearCoatChartKode, clearCoatDisplayName() (+5 more)

### Community 32 - "nota-preview.tsx"
Cohesion: 0.21
Nodes (11): NotaPreview(), NotaPreviewProps, printNotaPreview(), formatHargaNota(), formatRpJumlah(), hargaBaseCoatPerLiter(), NOTA_TARIF_BOGOR, NotaTarifGrup (+3 more)

### Community 33 - "jurnal-builders.ts"
Cohesion: 0.33
Nodes (14): BuilderFn, buildFakturBeliJurnal(), buildFakturJualJurnal(), buildKasPembayaranJurnal(), buildKasPenerimaanJurnal(), buildPembayaranJurnal(), buildPenerimaanJurnal(), buildPenyesuaianJurnal() (+6 more)

### Community 34 - "finance-contact-master-page.tsx"
Cohesion: 0.21
Nodes (8): CONFIG, FinanceContactMasterPage(), handleSave(), openAdd(), resetForm(), MasterMode, findSyaratBayar(), syaratBayarLabel()

### Community 35 - "sap-opb-preview.tsx"
Cohesion: 0.27
Nodes (10): SapOpbPreview(), SapOpbPreviewProps, notaNoFromTrxId(), AstraIssuer, astraIssuerForCabang(), formatSapAmount(), formatSapQty(), SAP_OPB_MATERIAL (+2 more)

### Community 36 - "transaksi-status-utils.ts"
Cohesion: 0.18
Nodes (9): Props, LabelCatPreview(), LabelCatPreviewProps, ADMIN_NEXT, LEGACY_STATUS, TINTER_NEXT, TRANSAKSI_STATUSES, TransaksiActor (+1 more)

### Community 39 - "ajuan-stok/page.tsx"
Cohesion: 0.30
Nodes (7): AjuanStokDetailPage(), AjuanStokPage(), MobileAjuanDetailPage(), ajuanStatusBadge(), AjuanStokDetail, INITIAL_AJUAN_STOK, useAjuanStok()

### Community 40 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, playwright, ssh2, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 41 - "useLemburList"
Cohesion: 0.22
Nodes (7): LemburDetailPage(), LemburPage(), MobileLemburDetailPage(), AppLemburPage(), handleSubmit(), calcJam(), useLemburList()

### Community 42 - "operasional/transaksi/[id]/page.tsx"
Cohesion: 0.35
Nodes (9): TransaksiDetailPage(), advanceAdminStatus(), CetakNotaAudit(), printNotaPenjualanPreview(), formatWaktu(), CetakNotaLogRow, useNotaPrint(), canActorUpdateStatus() (+1 more)

### Community 43 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, qa:agent, qa:browser, qa:harness, qa:interactive (+2 more)

### Community 44 - "monitoring/page.tsx"
Cohesion: 0.31
Nodes (4): StokChainVisual(), DEMO_CHECKLIST, DEMO_STOK_CHAIN, StokChainStep

### Community 45 - "preview-click-handler.tsx"
Cohesion: 0.29
Nodes (6): metadata, AppProviders(), getButtonLabel(), PreviewClickHandler(), shouldSkipButton(), ToastProvider()

### Community 46 - "app/transaksi/[id]/page.tsx"
Cohesion: 0.36
Nodes (7): TransaksiDetailPage(), handleSaveDraftDetail(), TransaksiFotoNotaSection(), formatDurasi(), draftNeedsWizardSteps(), isDraftFotoNotaPhase(), normalizeTransaksiId()

### Community 47 - "transaksi-catatan-utils.ts"
Cohesion: 0.31
Nodes (8): Props, TransaksiCatatanPanel(), TransaksiProdukLine, buildTransaksiCatatan(), kategoriLabel(), lineToCatatan(), TransaksiCatatanItem, PRODUK_KATEGORI

### Community 48 - "transaksi-row-normalize.ts"
Cohesion: 0.40
Nodes (8): formatRecipeId(), isInternalTransaksiId(), ReceiptIdSource, receiptToken(), resolveReceiptIdDisplay(), normalizeStoredReceiptId(), normalizeTransaksiRow(), normalizeTransaksiStatus()

### Community 49 - "daftar-laporan/page.tsx"
Cohesion: 0.28
Nodes (4): REPORT_CATEGORIES, ReportCategory, ReportIcon, ReportItem

### Community 50 - "finance-mock-preview-page.tsx"
Cohesion: 0.25
Nodes (3): FINANCE_PLACEHOLDERS, FinancePlaceholderDef, getFinancePlaceholder()

### Community 51 - "useStockOpnameDraft"
Cohesion: 0.28
Nodes (9): DemoChecklistPage(), initialAssignment(), readObj(), useAssignment(), useDemoChecklist(), useStockOpnameDraft(), writeObj(), buildDraftFromInventori() (+1 more)

### Community 52 - "generate-feedback-import.mjs"
Cohesion: 0.29
Nodes (7): csvCell(), dataLines, __dirname, gsRows, header, outCsv, rows

### Community 53 - "SyaratPembayaranPage"
Cohesion: 0.32
Nodes (4): SyaratPembayaranPage(), handleSave(), openAdd(), resetForm()

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

### Community 62 - "assignment/page.tsx"
Cohesion: 0.53
Nodes (5): AssignmentPage(), getCabang(), handleSave(), CABANG_LABELS, cabangShort()

### Community 63 - "TransaksiRow"
Cohesion: 0.33
Nodes (4): RekonsiliasiPage(), TransaksiRow, buildRekonsiliasiFromData(), RekonsiliasiCabangRow

### Community 64 - "KlaimNotaPage"
Cohesion: 0.33
Nodes (4): KlaimNotaPage(), INITIAL_KLAIM_NOTA, KlaimNotaRow, klaimNotaStatusBadge()

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

### Community 74 - "HutangPiutangDetailPage"
Cohesion: 0.40
Nodes (3): HutangPiutangPage(), HutangPiutangDetailPage(), hutangSlug()

### Community 75 - "operasional/transaksi/page.tsx"
Cohesion: 0.40
Nodes (4): CABANG_OPTIONS, STATUS_OPTIONS, TransaksiPage(), TRANSAKSI_STATUS_FILTER

### Community 76 - "printElementById"
Cohesion: 0.50
Nodes (4): printSapOpbPreview(), PRINT_DOC_CSS, printElementById(), printHtmlDocument()

### Community 77 - "transaksi-draft-utils.ts"
Cohesion: 0.60
Nodes (4): DraftWizardHydration, fallbackLayerFormulas(), hydrateDraftWizard(), parseLayerFormulas()

### Community 78 - "next.config.ts"
Cohesion: 0.50
Nodes (3): financeRedirects, nextConfig, next

### Community 79 - "qa-interactive-harness.py"
Cohesion: 0.67
Nodes (3): load_interactive_script(), main(), QA interaktif · browser-harness (Chrome CDP). Prasyarat: - npm run dev (port…

### Community 81 - "kode-warna-formulas.ts"
Cohesion: 0.50
Nodes (3): findFormula(), FORMULA_WARNA, FormulaDef

## Knowledge Gaps
- **294 isolated node(s):** `__dirname`, `nginx`, `ssl`, `nginxB64`, `sslB64` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `lucide-react` to `page-header.tsx`, `useTransaksiList`, `ops-finance-bridge.ts`, `mock-data.ts`, `module-guide-page.tsx`, `finance-payment-page.tsx`, `formatIDR`, `useToast`, `data-table.tsx`, `absensi-utils.ts`, `penyesuaian-persediaan/page.tsx`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `dashboard-shell.tsx`, `baru/page.tsx`, `(mobile)/app/page.tsx`, `inventori-utils.ts`, `package.json`, `useIzinList`, `finance-contact-master-page.tsx`, `transaksi-status-utils.ts`, `ajuan-stok/page.tsx`, `useLemburList`, `operasional/transaksi/[id]/page.tsx`, `monitoring/page.tsx`, `app/transaksi/[id]/page.tsx`, `daftar-laporan/page.tsx`, `finance-mock-preview-page.tsx`, `toner-picker-modal.tsx`, `assignment/page.tsx`, `operasional/transaksi/page.tsx`, `filter-bar.tsx`, `guide-sections.tsx`, `placeholder-page.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `useToast()` connect `useToast` to `page-header.tsx`, `useTransaksiList`, `ops-finance-bridge.ts`, `finance-payment-page.tsx`, `formatIDR`, `data-table.tsx`, `absensi-utils.ts`, `penyesuaian-persediaan/page.tsx`, `lucide-react`, `slip-gaji-utils.ts`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `BuatTransaksiContent`, `write`, `baru/page.tsx`, `useDistribusiList`, `useIzinList`, `finance-contact-master-page.tsx`, `ajuan-stok/page.tsx`, `useLemburList`, `operasional/transaksi/[id]/page.tsx`, `preview-click-handler.tsx`, `app/transaksi/[id]/page.tsx`, `SyaratPembayaranPage`, `assignment/page.tsx`, `TransaksiRow`, `KlaimNotaPage`, `HutangPiutangDetailPage`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `react` connect `lucide-react` to `page-header.tsx`, `useTransaksiList`, `ops-finance-bridge.ts`, `module-guide-page.tsx`, `preview-store.ts`, `finance-payment-page.tsx`, `formatIDR`, `useToast`, `data-table.tsx`, `absensi-utils.ts`, `penyesuaian-persediaan/page.tsx`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `nota-penjualan-preview.tsx`, `dashboard-shell.tsx`, `baru/page.tsx`, `(mobile)/app/page.tsx`, `inventori-utils.ts`, `package.json`, `useIzinList`, `nota-preview.tsx`, `finance-contact-master-page.tsx`, `transaksi-status-utils.ts`, `ajuan-stok/page.tsx`, `useLemburList`, `operasional/transaksi/[id]/page.tsx`, `preview-click-handler.tsx`, `app/transaksi/[id]/page.tsx`, `daftar-laporan/page.tsx`, `toner-picker-modal.tsx`, `assignment/page.tsx`, `operasional/transaksi/page.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `__dirname`, `nginx`, `ssl` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11884057971014493 - nodes in this community are weakly interconnected._
- **Should `useTransaksiList` be split into smaller, more focused modules?**
  _Cohesion score 0.1101010101010101 - nodes in this community are weakly interconnected._
- **Should `ops-finance-bridge.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10220673635307782 - nodes in this community are weakly interconnected._
# Graph Report - daya-oto-asia  (2026-09-28)

## Corpus Check
- 299 files · ~624,721 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .csv 6, (none) 3, .mdc 2)

## Summary
- 1568 nodes · 4686 edges · 101 communities (83 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4db92ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useToast
- opb/page.tsx
- pembelian/po/[id]/page.tsx
- mock-data.ts
- module-guide-page.tsx
- preview-store.ts
- ssh2
- finance-payment-page.tsx
- formatIDR
- btn.tsx
- PageHeader
- absensi-utils.ts
- finance-report-utils.ts
- tukar-nota/page.tsx
- slip-gaji-utils.ts
- useInventoriStok
- laporan-pemakaian-preview.tsx
- nota-penjualan-preview.tsx
- BuatTransaksiContent
- dashboard-shell.tsx
- What You Must Do When Invoked
- FinanceContactMasterPage
- transaksi-produk-options.ts
- rekap-invoice-utils.ts
- compilerOptions
- formula-utils.ts
- useDistribusiList
- pembelian/po/page.tsx
- inventori-utils.ts
- package.json
- nota-preview.tsx
- clear-coat-mixing-chart.ts
- stock-opname/[id]/page.tsx
- jurnal-builders.ts
- useTransaksiList
- ops-finance-bridge.ts
- setup-github-actions.mjs
- qa-interactive-harness-body.py
- FinanceMockPreviewPage
- useAjuanStok
- devDependencies
- StatusBadge
- graphify reference: extra exports and benchmark
- scripts
- graphify reference: query, path, explain
- preview-click-handler.tsx
- graphify reference: add a URL and watch a folder
- CabangPage
- TransaksiRow
- daftar-laporan/page.tsx
- faktur-penjualan-preview.tsx
- monitoring/page.tsx
- generate-feedback-import.mjs
- printElementById
- toner-picker-modal.tsx
- mixing-ratio-master.ts
- QA interaktif (browser-harness)
- postWithJurnal
- qa-browser-use-deepseek.py
- faktur-penjualan/[id]/page.tsx
- QA Agent + DeepSeek
- dependencies
- AssignmentPage
- write
- graphify reference: commit hook and native CLAUDE.md integration
- vercel.json
- setup-server.sh
- remote-bootstrap.mjs
- sap-opb-preview.tsx
- faktur-utils.ts
- mock-transaksi-arsip.ts
- operasional/transaksi/[id]/page.tsx
- QA Agent Task · Daya Oto Asia (feedback batch 21–60)
- nota-search-select.tsx
- kategori-harga-utils.ts
- graphify reference: incremental update and cluster-only
- apply-nginx-ssl.mjs
- transaksi-status-utils.ts
- next.config.ts
- rekonsiliasi/page.tsx
- jurnal-utils.ts
- baru/page.tsx
- setup-ssl.sh
- rekonsiliasi-utils.ts
- qa-feedback-check.mjs
- LoginPage
- guide-sections.tsx
- graphify reference: GitHub clone and cross-repo merge
- This is NOT the Next.js you know
- deploy-app.sh
- List Produk AXT_8b30c956.md
- next-env.d.ts
- postcss.config.mjs
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `PageHeader()` - 141 edges
2. `useToast()` - 111 edges
3. `StatusBadge()` - 108 edges
4. `lucide-react` - 102 edges
5. `formatIDR()` - 102 edges
6. `DataTable()` - 91 edges
7. `next` - 88 edges
8. `react` - 72 edges
9. `FinanceMockPreviewPage()` - 65 edges
10. `BuatTransaksiContent()` - 48 edges

## Surprising Connections (you probably didn't know these)
- `simpanRekonsiliasi()` --calls--> `formatIDR()`  [EXTRACTED]
  src/app/(dashboard)/finance/penjualan/faktur-penjualan/[id]/page.tsx → src/lib/mock-data.ts
- `DemoChecklistPage()` --calls--> `useDemoChecklist()`  [EXTRACTED]
  src/app/demo/page.tsx → src/lib/preview-store.ts
- `FinancePlaceholderPage()` --calls--> `PageHeader()`  [EXTRACTED]
  src/components/finance/finance-placeholder-page.tsx → src/components/ui/page-header.tsx
- `Btn()` --calls--> `useToast()`  [EXTRACTED]
  src/components/ui/btn.tsx → src/components/ui/toast.tsx
- `Page()` --calls--> `FinanceMockPreviewPage()`  [EXTRACTED]
  src/app/(dashboard)/finance/aset-tetap/aset-per-lokasi/page.tsx → src/components/finance/finance-mock-preview-page.tsx

## Import Cycles
- None detected.

## Communities (101 total, 18 thin omitted)

### Community 0 - "useToast"
Cohesion: 0.12
Nodes (32): lucide-react, react, COARow, KaryawanPage(), KaryawanRow, INITIAL_USERS, UserRow, UsersPage() (+24 more)

### Community 1 - "opb/page.tsx"
Cohesion: 0.16
Nodes (28): FakturPenjualanPage(), handleBatch(), handleGenerate(), simpanFaktur(), CABANG_OPTIONS, ProsesInvoicePage(), prosesInvoice(), STEPS (+20 more)

### Community 2 - "pembelian/po/[id]/page.tsx"
Cohesion: 0.20
Nodes (19): FakturPembelianPage(), handleGenerate(), initReceiveDraft(), PoDetailPage(), handleProsesPenerimaan(), setLineQty(), toggleLine(), ReceiveDraft (+11 more)

### Community 3 - "mock-data.ts"
Cohesion: 0.09
Nodes (22): MOCK_ARUS_KAS, MOCK_FAKTUR_BELI, MOCK_FAKTUR_JUAL, MOCK_GRAFIK_BEBAN, MOCK_GRAFIK_PENJUALAN, MOCK_HUTANG_PIUTANG, MOCK_JURNAL, MOCK_KAS_BANK (+14 more)

### Community 4 - "module-guide-page.tsx"
Cohesion: 0.10
Nodes (31): FinancePanduanPage(), HrisPanduanPage(), OperasionalPanduanPage(), FlowConnector(), FlowNode(), GUIDE_RAIL_ACCENT, MODULE_LABELS, MODULE_THEME (+23 more)

### Community 5 - "preview-store.ts"
Cohesion: 0.07
Nodes (37): AdminNotification, SEED_ADMIN_NOTIFICATIONS, HUTANG_BY_VENDOR, INITIAL_PELANGGAN, INITIAL_PEMASOK, INITIAL_SYARAT_PEMBAYARAN, INITIAL_TRANSFER_BANK, KAS_BANK_ACCOUNTS (+29 more)

### Community 6 - "ssh2"
Cohesion: 0.13
Nodes (9): conn, conn, conn, conn, { publicKey, privateKey }, conn, conn, ref_crypto (+1 more)

### Community 7 - "finance-payment-page.tsx"
Cohesion: 0.15
Nodes (24): Page(), handlePost(), Page(), FinancePaymentPage(), handleFakturChange(), handleSave(), resolveHutang(), resolvePiutang() (+16 more)

### Community 8 - "formatIDR"
Cohesion: 0.11
Nodes (23): HistoriAkunPage(), JurnalPage(), LineDraft, JurnalDetailPage(), Page(), Page(), Page(), LabaRugiPage() (+15 more)

### Community 9 - "btn.tsx"
Cohesion: 0.40
Nodes (4): Btn(), BtnProps, BtnVariant, VARIANTS

### Community 10 - "PageHeader"
Cohesion: 0.12
Nodes (27): recharts, COAPage(), ArusKasPage(), GrafikPage(), HutangPiutangPage(), LabaDitahanPage(), LaporanPembelianPage(), LaporanPenjualanPage() (+19 more)

### Community 11 - "absensi-utils.ts"
Cohesion: 0.11
Nodes (29): AppAbsensiContent(), completeCheckIn(), handleCheckIn(), handleConfirmLuarRadius(), AppAbsensiPage(), AbsensiRiwayatRow, AbsensiStatus, absensiStatusClass() (+21 more)

### Community 12 - "finance-report-utils.ts"
Cohesion: 0.18
Nodes (21): AccountMovement, ArusKasRow, balanceSheetSaldo(), buildArusKas(), buildLabaRugi(), buildNeraca(), CASH_CODES, coaByKode() (+13 more)

### Community 13 - "tukar-nota/page.tsx"
Cohesion: 0.22
Nodes (12): HasilGabungModal(), HasilGabungProps, isiNota(), IsiNotaList(), IsiNotaListProps, TukarNotaPage(), TransaksiProdukLine, buildTransaksiCatatan() (+4 more)

### Community 14 - "slip-gaji-utils.ts"
Cohesion: 0.14
Nodes (19): handlePrint(), printSlipGajiPreview(), SlipGajiPreviewProps, calcPotonganAbsensi(), calcPPh21(), calcSlipTotals(), calcTarifLemburPerJam(), calcUpahLembur() (+11 more)

### Community 15 - "useInventoriStok"
Cohesion: 0.17
Nodes (19): AjukanStokPage(), AppStockOpnamePage(), getInputValues(), handleSaveAllDraft(), handleSubmitBatch(), AppStokPage(), StokContent(), formatStokBreakdown() (+11 more)

### Community 16 - "laporan-pemakaian-preview.tsx"
Cohesion: 0.19
Nodes (23): LaporanPemakaianPage(), handlePrint(), DayBlock(), DoaLogo(), LaporanPemakaianPreview(), LaporanPemakaianPreviewProps, printLaporanPemakaianPreview(), UnderlineField() (+15 more)

### Community 17 - "nota-penjualan-preview.tsx"
Cohesion: 0.16
Nodes (21): DoaLogo(), NotaPenjualanPreview(), NotaPenjualanPreviewProps, UnderlineField(), formatNotaPenjualanHarga(), formatNotaPenjualanTanggal(), NOTA_PENJUALAN_GRUP, NotaPenjualanBaris (+13 more)

### Community 18 - "BuatTransaksiContent"
Cohesion: 0.16
Nodes (18): BuatTransaksiContent(), applyAutoMixingFormula(), buildLayers(), buildRow(), finishMixing(), handleSaveDraft(), handleTambahBahan(), handleVolumeChange() (+10 more)

### Community 19 - "dashboard-shell.tsx"
Cohesion: 0.17
Nodes (14): HRISPage(), DashboardLayout(), DashboardShell(), MenuSectionHeader(), ModuleMenuLinks(), ModuleLanding(), ModuleLandingProps, MOCK_USER (+6 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "FinanceContactMasterPage"
Cohesion: 0.13
Nodes (15): Page(), Page(), Page(), FinanceContactMasterPage(), handleSave(), openAdd(), resetForm(), SyaratPembayaranPage() (+7 more)

### Community 22 - "transaksi-produk-options.ts"
Cohesion: 0.14
Nodes (14): BASECOAT, CLEAR_COAT, DEMPUL, ExtraKodeForOptions, extraKodeOptionsForProdukKategori(), hargaForProdukOption(), kodeOptionsForProdukKategori(), labelForKodeWarnaOption() (+6 more)

### Community 23 - "rekap-invoice-utils.ts"
Cohesion: 0.18
Nodes (19): RekapInvoicePreview(), RekapInvoicePreviewProps, RekapOrderPembelianBahan(), ASTRA_REKAP_NAMA, astraPelangganRekap(), buildRekapInvoiceLines(), BULAN_SINGKAT, cabangMatches() (+11 more)

### Community 24 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "formula-utils.ts"
Cohesion: 0.18
Nodes (13): handleSaveFormula(), loadSavedFormula(), findAxtProduct(), FormulaLine, formulaStorageBaseVolume(), resolveFormulaNames(), scaleFormulaGrams(), applySavedFormula() (+5 more)

### Community 26 - "useDistribusiList"
Cohesion: 0.12
Nodes (19): RekapPemakaianCabangPage(), FinanceSuratJalanPage(), AjuanStokDetailPage(), handleApprove(), DistribusiDetailPage(), localDatetimeValue(), DistribusiPage(), handleSave() (+11 more)

### Community 27 - "pembelian/po/page.tsx"
Cohesion: 0.13
Nodes (20): emptyLine(), LineItem, POPage(), handleSave(), resetForm(), toLines(), FinanceLinkBadge(), MOCK_PO (+12 more)

### Community 28 - "inventori-utils.ts"
Cohesion: 0.21
Nodes (12): namaTanpaKode(), ProductSearchSelect(), ProductSearchSelectProps, buildInventoriRow(), deriveStatus(), formatProdukOptionLabel(), INITIAL_INVENTORI, InventoriStokAdjust (+4 more)

### Community 29 - "package.json"
Cohesion: 0.11
Nodes (16): allowScripts, ssh2@1.17.0, name, private, version, eslint, eslint-config-next, playwright (+8 more)

### Community 30 - "nota-preview.tsx"
Cohesion: 0.26
Nodes (13): DoaLogo(), NotaPreview(), NotaPreviewProps, UnderlineField(), gramToLiter(), formatHargaNota(), formatRpJumlah(), hargaBaseCoatPerLiter() (+5 more)

### Community 31 - "clear-coat-mixing-chart.ts"
Cohesion: 0.24
Nodes (12): ClearCoatMixingRatioChart(), fmtGram(), Props, AXT_280_MS_WEIGHT_CHART, AXT_360_HS_WEIGHT_CHART, chartForClearCoat(), ClearCoatChartKode, clearCoatDisplayName() (+4 more)

### Community 32 - "stock-opname/[id]/page.tsx"
Cohesion: 0.14
Nodes (20): PenyesuaianPersediaanContent(), handleSave(), PenyesuaianPersediaanPage(), StockOpnameDetailPage(), StockOpnamePage(), approveAll(), flagLarge(), MOCK_STOCK_OPNAME (+12 more)

### Community 33 - "jurnal-builders.ts"
Cohesion: 0.33
Nodes (14): BuilderFn, buildFakturBeliJurnal(), buildFakturJualJurnal(), buildKasPembayaranJurnal(), buildKasPenerimaanJurnal(), buildPembayaranJurnal(), buildPenerimaanJurnal(), buildPenyesuaianJurnal() (+6 more)

### Community 34 - "useTransaksiList"
Cohesion: 0.05
Nodes (56): KasbonPage(), KlaimNotaPage(), NotifikasiPage(), AppHome(), salam(), PendingBadge(), ProfilPage(), catatanTerima() (+48 more)

### Community 35 - "ops-finance-bridge.ts"
Cohesion: 0.29
Nodes (7): FINANCE_STATUS_CLASS, FINANCE_STATUS_LABELS, FinanceLinkStatus, INITIAL_PENYESUAIAN, PenyesuaianDetail, penyesuaianFromSlug(), PenyesuaianLine

### Community 36 - "setup-github-actions.mjs"
Cohesion: 0.26
Nodes (11): connect(), deployProduction(), exec(), ghAvailable(), main(), setGitHubSecrets(), setSecretViaApi(), setSecretViaGh() (+3 more)

### Community 37 - "qa-interactive-harness-body.py"
Cohesion: 0.17
Nodes (3): assert_has(), body_lower(), time

### Community 38 - "FinanceMockPreviewPage"
Cohesion: 0.05
Nodes (41): Page(), Page(), Page(), Page(), Page(), Page(), Page(), Page() (+33 more)

### Community 39 - "useAjuanStok"
Cohesion: 0.43
Nodes (5): MobileAjuanDetailPage(), ajuanStatusBadge(), AjuanStokDetail, INITIAL_AJUAN_STOK, useAjuanStok()

### Community 40 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, playwright, ssh2, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 41 - "StatusBadge"
Cohesion: 0.10
Nodes (25): next, HutangPiutangDetailPage(), AbsensiPage(), MOCK_ABSENSI, REKAP, TABS, IzinDetailPage(), IzinPage() (+17 more)

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
Cohesion: 0.31
Nodes (8): src_app_globals, metadata, RootLayout(), AppProviders(), getButtonLabel(), PreviewClickHandler(), shouldSkipButton(), ToastProvider()

### Community 46 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 47 - "CabangPage"
Cohesion: 0.15
Nodes (10): CabangPage(), handleHapus(), CABANG_BARU, CabangRow, cabangShort(), INITIAL_CABANG, KODE_AREA, KOORDINAT_CONTOH (+2 more)

### Community 48 - "TransaksiRow"
Cohesion: 0.28
Nodes (10): Props, TransaksiCatatanPanel(), CheckIcon(), Props, TransaksiFotoNotaSection(), LabelCatPreview(), LabelCatPreviewProps, printNotaPenjualanPreview() (+2 more)

### Community 49 - "daftar-laporan/page.tsx"
Cohesion: 0.31
Nodes (6): DaftarLaporanPage(), ReportIconView(), REPORT_CATEGORIES, ReportCategory, ReportIcon, ReportItem

### Community 50 - "faktur-penjualan-preview.tsx"
Cohesion: 0.26
Nodes (12): boxCell, DoaMark(), FakturPenjualanPreview(), FakturPenjualanPreviewProps, ASTRA_DSO, formatTglInvoice(), INVOICE_KETERANGAN, INVOICE_KOP (+4 more)

### Community 51 - "monitoring/page.tsx"
Cohesion: 0.31
Nodes (7): MonitoringPage(), DemoChecklistPage(), StepIcon(), StokChainVisual(), DEMO_CHECKLIST, DEMO_STOK_CHAIN, StokChainStep

### Community 52 - "generate-feedback-import.mjs"
Cohesion: 0.07
Nodes (23): ref_node_fs, ref_node_path, ref_node_url, data, done, hdr, row, rows (+15 more)

### Community 53 - "printElementById"
Cohesion: 0.22
Nodes (12): printNotaPreview(), OpbPreview(), OpbPreviewProps, printOpbPreview(), REKAP_INVOICE_PRINT_CSS, printSapOpbPreview(), downloadElementById(), PRINT_DOC_CSS (+4 more)

### Community 54 - "toner-picker-modal.tsx"
Cohesion: 0.32
Nodes (4): TonerPickerModal(), TonerPickerModalProps, AXT_PRODUK, AxtProduk

### Community 55 - "mixing-ratio-master.ts"
Cohesion: 0.43
Nodes (6): clearCoatMixingLines(), findMixingRatio(), gramsFromMixingRatio(), MIXING_RATIO_MASTER, MixingRatioRow, defaultFormulaItemsForKode()

### Community 56 - "QA interaktif (browser-harness)"
Cohesion: 0.29
Nodes (6): Laporan ke user, Perintah wajib (urutan), Prasyarat, QA interaktif (browser-harness), Smoke saja (tanpa klik), User trigger phrases (Indonesia)

### Community 57 - "postWithJurnal"
Cohesion: 0.18
Nodes (12): handlePost(), handlePost(), handlePost(), handleSave(), handleSave(), buildJurnal(), JurnalPostContext, postWithJurnal() (+4 more)

### Community 58 - "qa-browser-use-deepseek.py"
Cohesion: 0.11
Nodes (22): asyncio, json, openpyxl, os, pathlib, re, main(), map_kategori_tarif() (+14 more)

### Community 59 - "faktur-penjualan/[id]/page.tsx"
Cohesion: 0.26
Nodes (11): FakturPenjualanDetailPage(), simpanRekonsiliasi(), METODE_KIRIM, downloadFakturPenjualanPreview(), printFakturPenjualanPreview(), downloadRekapInvoicePreview(), printRekapInvoicePreview(), fakturFromSlug() (+3 more)

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
Cohesion: 0.24
Nodes (12): BukaKalengPage(), read(), sameExtraKode(), useBukaKaleng(), useCetakNotaLog(), useExtraKodeWarna(), useKasBank(), useKlaimNota() (+4 more)

### Community 64 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 65 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, devCommand, framework, installCommand, $schema

### Community 66 - "setup-server.sh"
Cohesion: 0.60
Nodes (4): build_app(), clone_or_pull(), DEBIAN_FRONTEND, setup-server.sh script

### Community 67 - "remote-bootstrap.mjs"
Cohesion: 0.09
Nodes (22): conn, __dirname, exec(), setupScript, compat, __dirname, eslintConfig, __filename (+14 more)

### Community 68 - "sap-opb-preview.tsx"
Cohesion: 0.32
Nodes (11): AstraLogo(), SapOpbPreview(), SapOpbPreviewProps, UnderlineField(), AstraIssuer, astraIssuerForCabang(), formatSapAmount(), formatSapQty() (+3 more)

### Community 69 - "faktur-utils.ts"
Cohesion: 0.25
Nodes (9): FakturJualRow, fakturSiapKirim(), FakturStatus, fakturTerekonsiliasi(), KirimInvoiceInfo, nextFakturJualId(), RekonsiliasiInvoiceInfo, buildFakturPenjualan() (+1 more)

### Community 70 - "mock-transaksi-arsip.ts"
Cohesion: 0.22
Nodes (10): buildRow(), CabangSeed, geserMenit(), HURUF, Jenis, MOBIL, MOCK_TRANSAKSI_ARSIP, PALET (+2 more)

### Community 71 - "operasional/transaksi/[id]/page.tsx"
Cohesion: 0.40
Nodes (7): TransaksiDetailPage(), advanceAdminStatus(), CetakNotaAudit(), formatWaktu(), CetakNotaLogRow, canActorUpdateStatus(), nextTransaksiStatus()

### Community 72 - "QA Agent Task · Daya Oto Asia (feedback batch 21–60)"
Cohesion: 0.40
Nodes (4): Finance, Mobile app, Operasional, QA Agent Task · Daya Oto Asia (feedback batch 21–60)

### Community 73 - "nota-search-select.tsx"
Cohesion: 0.27
Nodes (6): DEFAULT_SEARCH_KEYS, labelFor(), NotaSearchSelect(), handleKeyDown(), pick(), NotaSearchSelectProps

### Community 74 - "kategori-harga-utils.ts"
Cohesion: 0.33
Nodes (9): HARGA_KATEGORI_DEFAULT, hargaKategori(), hargaPerLiterProduk(), hargaUnitProduk(), INITIAL_KATEGORI_HARGA, KategoriHargaRow, literPerUnit(), produkByKode() (+1 more)

### Community 75 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 76 - "apply-nginx-ssl.mjs"
Cohesion: 0.25
Nodes (7): conn, __dirname, exec(), nginx, nginxB64, ssl, sslB64

### Community 77 - "transaksi-status-utils.ts"
Cohesion: 0.16
Nodes (13): DraftWizardHydration, fallbackLayerFormulas(), hydrateDraftWizard(), parseLayerFormulas(), TransaksiDraftWizard, ADMIN_NEXT, LEGACY_STATUS, ProdukKategoriId (+5 more)

### Community 79 - "rekonsiliasi/page.tsx"
Cohesion: 0.36
Nodes (6): BULAN_ID, periodeDariTanggal(), RekonsiliasiPage(), handleAssignOpb(), FilterBar(), FilterBarProps

### Community 80 - "jurnal-utils.ts"
Cohesion: 0.33
Nodes (5): JurnalDetail, JurnalLine, MOCK_JURNAL_DETAILS, MOCK_COA, MOCK_HISTORI_AKUN

### Community 81 - "baru/page.tsx"
Cohesion: 0.15
Nodes (13): BuatTransaksiPage(), DraftSaveSection(), layerTabLabel(), STEPS, VOLUME_PRESETS, findFormula(), FORMULA_WARNA, FormulaDef (+5 more)

### Community 83 - "rekonsiliasi-utils.ts"
Cohesion: 0.40
Nodes (5): buildRekonsiliasiFromData(), buildSelisihDetail(), cabangCocok(), RekonsiliasiCabangRow, SelisihDetail

### Community 91 - "next-env.d.ts"
Cohesion: 0.50
Nodes (3): next_dev_types_root_params_d, next_dev_types_routes_d, NOTE: This file should not be edited

## Knowledge Gaps
- **365 isolated node(s):** `__dirname`, `nginx`, `ssl`, `nginxB64`, `sslB64` (+360 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 490 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `useToast` to `opb/page.tsx`, `pembelian/po/[id]/page.tsx`, `module-guide-page.tsx`, `finance-payment-page.tsx`, `formatIDR`, `PageHeader`, `absensi-utils.ts`, `tukar-nota/page.tsx`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `dashboard-shell.tsx`, `useDistribusiList`, `pembelian/po/page.tsx`, `inventori-utils.ts`, `package.json`, `stock-opname/[id]/page.tsx`, `useTransaksiList`, `FinanceMockPreviewPage`, `useAjuanStok`, `StatusBadge`, `TransaksiRow`, `daftar-laporan/page.tsx`, `monitoring/page.tsx`, `toner-picker-modal.tsx`, `faktur-penjualan/[id]/page.tsx`, `operasional/transaksi/[id]/page.tsx`, `nota-search-select.tsx`, `rekonsiliasi/page.tsx`, `baru/page.tsx`, `guide-sections.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `react` connect `useToast` to `opb/page.tsx`, `pembelian/po/[id]/page.tsx`, `module-guide-page.tsx`, `preview-store.ts`, `finance-payment-page.tsx`, `formatIDR`, `PageHeader`, `absensi-utils.ts`, `tukar-nota/page.tsx`, `useInventoriStok`, `laporan-pemakaian-preview.tsx`, `nota-penjualan-preview.tsx`, `dashboard-shell.tsx`, `useDistribusiList`, `pembelian/po/page.tsx`, `inventori-utils.ts`, `package.json`, `nota-preview.tsx`, `useTransaksiList`, `StatusBadge`, `preview-click-handler.tsx`, `TransaksiRow`, `daftar-laporan/page.tsx`, `toner-picker-modal.tsx`, `faktur-penjualan/[id]/page.tsx`, `operasional/transaksi/[id]/page.tsx`, `nota-search-select.tsx`, `rekonsiliasi/page.tsx`, `baru/page.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `next` connect `StatusBadge` to `useToast`, `opb/page.tsx`, `pembelian/po/[id]/page.tsx`, `module-guide-page.tsx`, `finance-payment-page.tsx`, `formatIDR`, `btn.tsx`, `PageHeader`, `absensi-utils.ts`, `tukar-nota/page.tsx`, `useInventoriStok`, `dashboard-shell.tsx`, `useDistribusiList`, `pembelian/po/page.tsx`, `package.json`, `stock-opname/[id]/page.tsx`, `useTransaksiList`, `ops-finance-bridge.ts`, `FinanceMockPreviewPage`, `useAjuanStok`, `preview-click-handler.tsx`, `monitoring/page.tsx`, `faktur-penjualan/[id]/page.tsx`, `operasional/transaksi/[id]/page.tsx`, `next.config.ts`, `rekonsiliasi/page.tsx`, `jurnal-utils.ts`, `baru/page.tsx`, `guide-sections.tsx`, `operasional/po/[id]/page.tsx`, `operasional/po/page.tsx`, `src/app/page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `__dirname`, `nginx`, `ssl` to the rest of the system?**
  _365 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useToast` be split into smaller, more focused modules?**
  _Cohesion score 0.12295081967213115 - nodes in this community are weakly interconnected._
- **Should `mock-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `module-guide-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09871794871794871 - nodes in this community are weakly interconnected._
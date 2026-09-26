import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3300";

const browserChecks = [
  { no: 21, path: "/app/transaksi/baru", text: "Clear Coat" },
  { no: 30, path: "/app/transaksi/baru", text: "Mixing" },
  { no: 32, path: "/app/transaksi/baru", text: "Foto & Nota" },
  { no: 36, path: "/app/transaksi", text: "Sudah TTD" },
  { no: 38, path: "/app/stok", text: "Buka Kaleng", mustNotPage: "Ajukan Stok" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
let pass = 0;
let fail = 0;

for (const c of browserChecks) {
  try {
    await page.goto(`${BASE}${c.path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500);
    const body = await page.locator("body").innerText();
    const okText = body.includes(c.text);
    const okNot = c.mustNotPage ? !body.includes(c.mustNotPage) : true;
    if (okText && okNot) {
      console.log(`✓ browser #${c.no} ${c.path}`);
      pass++;
    } else {
      console.log(`✗ browser #${c.no} ${c.path} text=${okText} not=${okNot}`);
      fail++;
    }
  } catch (e) {
    console.log(`✗ browser #${c.no} ${e.message}`);
    fail++;
  }
}

await browser.close();
console.log(`Browser QA: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);

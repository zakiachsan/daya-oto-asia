import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const financeRoot = path.join(root, "src/app/(dashboard)/finance");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name === "page.tsx") acc.push(full);
  }
  return acc;
}

const template = (pathKey) => `import { FinanceMockPreviewPage } from "@/components/finance/finance-mock-preview-page";

export default function Page() {
  return <FinanceMockPreviewPage pathKey="${pathKey}" />;
}
`;

let updated = 0;
for (const pagePath of walk(financeRoot)) {
  const src = fs.readFileSync(pagePath, "utf8");
  if (!src.includes("FinancePlaceholderPage")) continue;
  const rel = path.relative(financeRoot, path.dirname(pagePath)).replace(/\\/g, "/");
  fs.writeFileSync(pagePath, template(rel));
  updated++;
  console.log("Updated:", rel);
}

console.log(`Done — ${updated} pages updated`);

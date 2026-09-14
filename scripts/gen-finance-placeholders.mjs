import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "src/lib/finance-placeholder-config.ts");
const src = fs.readFileSync(configPath, "utf8");
const keys = [...src.matchAll(/"([a-z0-9-]+\/[a-z0-9-]+)":/g)].map((m) => m[1]);

for (const key of keys) {
  const dir = path.join(root, "src/app/(dashboard)/finance", key);
  fs.mkdirSync(dir, { recursive: true });
  const pagePath = path.join(dir, "page.tsx");
  if (fs.existsSync(pagePath)) continue;
  fs.writeFileSync(
    pagePath,
    `import { FinancePlaceholderPage } from "@/components/finance/finance-placeholder-page";
import { getFinancePlaceholder } from "@/lib/finance-placeholder-config";

export default function Page() {
  return <FinancePlaceholderPage {...getFinancePlaceholder("${key}")} />;
}
`,
  );
}

console.log(`Generated ${keys.length} placeholder pages`);

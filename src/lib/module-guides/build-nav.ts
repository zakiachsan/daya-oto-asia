import type { ModuleMenu } from "@/lib/modules";
import type { GuideNavSection } from "./types";

export function menuHrefToId(href: string): string {
  if (href === "/operasional" || href === "/finance" || href === "/hris") return "dashboard";
  const parts = href.split("/").filter(Boolean);
  if (parts.length <= 1) return "dashboard";
  // Path setelah prefix modul — unik untuk nested menu (mis. persediaan vs pembelian)
  return parts.slice(1).join("-");
}

export function buildSectionsFromMenus(menus: ModuleMenu[]): GuideNavSection[] {
  const sections: GuideNavSection[] = [];
  let current: GuideNavSection | null = null;

  for (const menu of menus) {
    if (menu.href.endsWith("/panduan")) continue;

    const id = menuHrefToId(menu.href);

    if (menu.label === "Dashboard") {
      sections.push({ key: "dashboard", label: "Dashboard", items: [{ id, label: menu.label }] });
      current = null;
      continue;
    }

    const sectionLabel = menu.section ?? "Menu";
    const sectionKey = sectionLabel
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9-]/g, "");

    if (!current || current.key !== sectionKey) {
      current = { key: sectionKey, label: sectionLabel, items: [] };
      sections.push(current);
    }
    current.items.push({ id, label: menu.label });
  }

  return sections;
}

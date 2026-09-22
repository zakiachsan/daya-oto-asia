import type { FlowAction, GuideModuleId, MenuFlowGuide } from "./types";

export const g = (
  id: string,
  title: string,
  menuLabel: string,
  href: string,
  summary: string,
  actions: FlowAction[],
): MenuFlowGuide => ({ id, title, menuLabel, href, summary, actions });

export const a = (
  module: GuideModuleId,
  label: string,
  href?: string,
  also?: FlowAction["also"],
): FlowAction => (also ? { module, label, href, also } : href ? { module, label, href } : { module, label });

/** Panduan singkat · buka halaman + langkah standar */
export function simpleGuide(
  id: string,
  menuLabel: string,
  href: string,
  summary: string,
  module: GuideModuleId,
  steps: string[],
): MenuFlowGuide {
  return g(
    id,
    menuLabel,
    menuLabel,
    href,
    summary,
    steps.map((label, idx) => (idx === 0 ? a(module, label, href) : a(module, label))),
  );
}

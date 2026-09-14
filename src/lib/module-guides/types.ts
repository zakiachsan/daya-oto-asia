export type GuideModuleId = "operasional" | "finance" | "hris" | "mobile";

export interface FlowAction {
  module: GuideModuleId;
  label: string;
  href?: string;
  also?: { module: GuideModuleId; href?: string };
}

export interface MenuFlowGuide {
  id: string;
  title: string;
  menuLabel: string;
  href: string;
  summary: string;
  actions: FlowAction[];
}

export interface GuideNavSection {
  key: string;
  label: string;
  items: { id: string; label: string }[];
}

export interface ModuleGuideNav {
  moduleId: string;
  title: string;
  subtitle: string;
  sections: GuideNavSection[];
  guides: Record<string, MenuFlowGuide>;
}

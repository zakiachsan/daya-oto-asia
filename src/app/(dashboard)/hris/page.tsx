import { ModuleLanding } from "@/components/ui/module-landing";
import { getModuleMenus } from "@/lib/modules";

export default function HRISPage() {
  return (
    <ModuleLanding
      title="HRIS"
      desc="Kelola karyawan, absensi, payroll, dan kinerja tinter"
      menus={getModuleMenus("hris")}
    />
  );
}

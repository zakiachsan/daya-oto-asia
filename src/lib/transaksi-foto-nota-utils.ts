import type { TransaksiRow } from "./mock-data";

/** Draft siap tampil fase 3 (Foto & Nota) di halaman detail */
export function isDraftFotoNotaPhase(trx: TransaksiRow): boolean {
  if (trx.status !== "Draft") return false;
  if (trx.draftWizard?.step != null && trx.draftWizard.step >= 2) return true;
  return !!trx.waktuSelesaiMixing;
}

export function draftNeedsWizardSteps(trx: TransaksiRow): boolean {
  return trx.status === "Draft" && !isDraftFotoNotaPhase(trx);
}

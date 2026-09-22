import { buildJurnal } from "./jurnal-builders";
import { allocateJurnalId, type JurnalDetail, type JurnalSourceType } from "./jurnal-utils";

export type JurnalPostContext = {
  jurnalList: JurnalDetail[];
  addJurnal: (j: JurnalDetail) => void;
};

/** Post a source document to jurnal · returns the new jurnal ID. */
export function postWithJurnal(
  type: JurnalSourceType,
  source: unknown,
  ctx: JurnalPostContext,
): string {
  const jurnalId = allocateJurnalId(ctx.jurnalList);
  ctx.addJurnal(buildJurnal(type, source, jurnalId));
  return jurnalId;
}

/** CSS bersama — meniru formulir cetak DOA Bogor (A4, serif, border hitam) */
export const PRINT_DOC_CSS = `
  * { box-sizing: border-box; }
  body { margin: 12mm; font-family: "Times New Roman", Times, Georgia, serif; color: #000; font-size: 10pt; line-height: 1.25; }
  .doc { max-width: 190mm; margin: 0 auto; }
  .doc-center { text-align: center; }
  .doc-bold { font-weight: bold; }
  .doc-upper { text-transform: uppercase; }
  .doc-border { border: 1px solid #000; }
  .doc-border-b { border-bottom: 1px solid #000; }
  .doc-border-b2 { border-bottom: 2px solid #000; }
  table.doc-table { width: 100%; border-collapse: collapse; }
  table.doc-table th, table.doc-table td { border: 1px solid #000; padding: 2px 4px; vertical-align: top; }
  table.doc-table th { font-weight: bold; background: #f5f5f5; }
  .sig-line { border-bottom: 1px solid #000; height: 48px; margin-bottom: 4px; }
  .field-row { display: flex; margin-bottom: 2px; font-size: 10pt; }
  .field-label { min-width: 110px; font-weight: 600; }
  .field-colon { width: 12px; }
  .field-value { flex: 1; border-bottom: 1px dotted #666; min-height: 14px; }
  .tarif-grup { margin-bottom: 4px; }
  .tarif-judul { font-weight: bold; text-decoration: underline; margin-bottom: 2px; }
  .tarif-baris { display: flex; justify-content: space-between; padding-left: 8px; font-size: 9pt; }
  .footer-alamat { font-size: 8pt; text-align: center; margin-top: 8px; line-height: 1.3; }
  @media print {
    body { margin: 8mm; }
    .page-break { page-break-before: always; }
  }
`;

export function printHtmlDocument(title: string, htmlBody: string, extraCss = "") {
  const el = typeof htmlBody === "string" && htmlBody.startsWith("<")
    ? htmlBody
    : null;
  const content = el ?? (() => {
    const node = document.getElementById(htmlBody);
    return node?.outerHTML ?? "";
  })();

  if (!content) return;

  const w = window.open("", "_blank", "width=920,height=1100");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>${PRINT_DOC_CSS}${extraCss}</style></head><body>${content}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

export function printElementById(elementId: string, title: string, extraCss = "") {
  const el = document.getElementById(elementId);
  if (!el) return;
  printHtmlDocument(title, el.outerHTML, extraCss);
}

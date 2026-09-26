import { redirect } from "next/navigation";

/** PO utama tetap di Operasional · Finance akses mirror (#53) */
export default function FinancePoRedirect() {
  redirect("/operasional/po");
}

import { redirect } from "next/navigation";

/** PO & Penerimaan sekarang di modul Finance · link lama dialihkan */
export default function OpsPoRedirect() {
  redirect("/finance/pembelian/po");
}

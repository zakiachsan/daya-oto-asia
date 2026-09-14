import { Suspense } from "react";
import { FinancePaymentPage } from "@/components/finance/finance-payment-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-[13px] text-slds-text-weak">Memuat...</div>}>
      <FinancePaymentPage mode="pembayaran" />
    </Suspense>
  );
}

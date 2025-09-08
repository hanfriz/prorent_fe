import PaymentFailedPage from "@/view/payment/xenditResponse/failurePayment";
import { Suspense } from "react";

export default function PaymentFailed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedPage />;
    </Suspense>
  );
}

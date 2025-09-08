import PaymentWaitingPage from "@/view/payment/xenditResponse/waitingPayment";
import { Suspense } from "react";

export default function PaymentSuccess() {
  return (
    <Suspense fallback="loading...">
      <PaymentWaitingPage />;
    </Suspense>
  );
}

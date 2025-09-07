import PaymentSuccessPage from "@/view/payment/xenditResponse/successPayment";
import { Suspense } from "react";

export default function PaymentSuccess() {
  return (
    <Suspense fallback="loading...">
      <PaymentSuccessPage />;
    </Suspense>
  );
}

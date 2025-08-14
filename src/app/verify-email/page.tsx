import { Suspense } from "react";
import VerifyEmailView from "@/view/verify-email";

export default function VerifyEmailPage() {

  return (
  <Suspense fallback="loading...">
  <VerifyEmailView />
  </Suspense>);
}

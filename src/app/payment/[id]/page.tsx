import { Suspense } from "react";
import PaymentForm from "@/view/payment";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoleBasedRoute allowedRoles={["USER"]}>
        <PaymentForm />
      </RoleBasedRoute>
    </Suspense>
  );
}

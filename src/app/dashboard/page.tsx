import DashboardView from "@/view/dashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}

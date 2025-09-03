import DashboardView from "@/view/dashboard";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

export default function DashboardPage() {
  return (
    <RoleBasedRoute allowedRoles={["OWNER"]}>
      <DashboardView />
    </RoleBasedRoute>
  );
}

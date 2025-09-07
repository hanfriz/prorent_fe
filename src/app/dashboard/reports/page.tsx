import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import MainReportPage from "@/view/report";

export default function Report() {
  return (
    <RoleBasedRoute allowedRoles={["OWNER"]}>
      <MainReportPage />;
    </RoleBasedRoute>
  );
}

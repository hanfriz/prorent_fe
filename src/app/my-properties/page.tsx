import MyPropertiesView from "@/view/property/MyPropertiesView";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

export default function MyPropertiesPage() {
  return (
    <RoleBasedRoute allowedRoles={["OWNER"]}>
      <MyPropertiesView />
    </RoleBasedRoute>
  );
}

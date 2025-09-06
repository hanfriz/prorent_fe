import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import OwnerReservationList from "@/view/ownerTransactionManagement/index";

export default function UserReservationList() {
  return (
    <RoleBasedRoute allowedRoles={["OWNER"]}>
      <OwnerReservationList />
    </RoleBasedRoute>
  );
}

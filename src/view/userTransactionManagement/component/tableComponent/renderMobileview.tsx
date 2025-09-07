import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ReservationWithPayment,
  RPResPagination,
} from "@/interface/paymentInterface";
import ReservationActions from "../reservationAction";

const renderMobileView = (
  reservations: any,
  renderMobileCard: any,
  renderMobilePagination: any
) => (
  <div className="md:hidden space-y-3">
    {reservations.length === 0 ? (
      <div className="p-4 rounded-lg bg-white border text-center text-pr-mid">
        No reservations found.
      </div>
    ) : (
      reservations.map((r: any) => (
        <div key={r.id} className="bg-white p-4 rounded-2xl border shadow-sm">
          {renderMobileCard(r)}
        </div>
      ))
    )}
    {renderMobilePagination()}
  </div>
);

export default renderMobileView;

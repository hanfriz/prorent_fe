// app/reservation/[id]/page.tsx
import { fetchReservationWithPayment } from "@/service/reservationService";
import { ReservationDetail } from "@/view/userTransactionManagement/component/reservationDetails";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-4">
      <ReservationDetail reservationId={id} />
    </div>
  );
}

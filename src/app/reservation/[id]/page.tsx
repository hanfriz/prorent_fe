// app/reservation/[id]/page.tsx
import { fetchReservationWithPayment } from "@/service/reservationService";
import { ReservationItem } from "@/view/userTransactionManagement/component/reservationItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const reservation = await fetchReservationWithPayment((await params).id);

  if (!reservation) {
    return <div>Reservation not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reservation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ReservationItem reservation={reservation} />
        </TableBody>
      </Table>
    </div>
  );
}
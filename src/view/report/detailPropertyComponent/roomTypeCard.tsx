// src/app/dashboard/report/[propertyId]/roomTypeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../mainComponent/chartComponent/utils";
import { RoomTypeWithAvailability } from "@/interface/report/reportInterface";

interface RoomTypeCardProps {
  roomType: RoomTypeWithAvailability;
}

export default function RoomTypeCard({ roomType }: RoomTypeCardProps) {
      if (!roomType) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            No room type data available
          </div>
        </CardContent>
      </Card>
    );
  }
  const counts = roomType.counts || {};
  const revenue = roomType.revenue || {};

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Revenue" 
            value={formatCurrency(revenue.actual || 0)} 
          />
          <MetricCard 
            title="Confirmed" 
            value={counts.CONFIRMED?.toString() || "0"} 
          />
          <MetricCard 
            title="Pending" 
            value={counts.PENDING_CONFIRMATION?.toString() || "0"} 
          />
          <MetricCard 
            title="Cancelled" 
            value={counts.CANCELLED?.toString() || "0"} 
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
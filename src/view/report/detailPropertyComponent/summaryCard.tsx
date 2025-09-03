// src/components/report/SummaryCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "../mainComponent/chartComponent/utils";

interface SummaryCardsProps {
  summary: {
    counts: {
      PENDING_PAYMENT?: number;
      PENDING_CONFIRMATION?: number;
      CONFIRMED?: number;
      CANCELLED?: number;
    };
    revenue: {
      actual?: number;
      projected?: number;
      average?: number;
    };
  };
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const counts = summary.counts || {};
  const revenue = summary.revenue || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard 
        title="Total Revenue" 
        value={formatCurrency(revenue.actual || 0)} 
        description="Actual revenue for period"
      />
      <SummaryCard 
        title="Confirmed Bookings" 
        value={counts.CONFIRMED?.toString() || "0"} 
        description="Confirmed reservations"
      />
      <SummaryCard 
        title="Pending Confirmations" 
        value={counts.PENDING_CONFIRMATION?.toString() || "0"} 
        description="Awaiting confirmation"
      />
      <SummaryCard 
        title="Cancelled Bookings" 
        value={counts.CANCELLED?.toString() || "0"} 
        description="Cancelled reservations"
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
}

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
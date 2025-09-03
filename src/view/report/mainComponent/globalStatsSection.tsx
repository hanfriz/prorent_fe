// src/app/dashboard/report/main/components/GlobalStatsSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./helper";

interface Props {
  summary: any;
}

export const GlobalStatsSection: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Properties" value={summary.totalProperties} />
        <StatCard label="Active Bookings" value={summary.totalActiveBookings} />
        <StatCard
          label="Actual Revenue"
          value={summary.totalActualRevenue}
          isCurrency
        />
        <StatCard
          label="Projected Revenue"
          value={summary.totalProjectedRevenue}
          isCurrency
        />
      </CardContent>
    </Card>
  );
};

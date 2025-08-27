// src/app/dashboard/report/[propertyId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { usePropertyReport } from "@/service/report/useReport";
import { useReportStore } from "@/lib/stores/reportStore";
import SummaryCards from "./summaryCard";
import RoomTypeCards from "./roomTypeCard";
import AvailabilityCalendar from "./availabilityCalender";
import { ArrowLeft } from "lucide-react";
import { PropertySummary } from "@/interface/report/reportInterface";
import RoomTypeAccordion from "./roomTypeAccordion";

export default function PropertyReportPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;
  
  const { filters: storeFilters } = useReportStore();
  const [dateRange, setDateRange] = useState({
    startDate: storeFilters.startDate || new Date(new Date().getFullYear(), 0, 1),
    endDate: storeFilters.endDate || new Date(new Date().getFullYear(), 11, 31)
  });

  const [reservationPageMap, setReservationPageMap] = useState<Record<string, number> >({});    
  useEffect(() => {
    setDateRange({
      startDate: storeFilters.startDate || new Date(new Date().getFullYear(), 0, 1),
      endDate: storeFilters.endDate || new Date(new Date().getFullYear(), 11, 31)
    });
  }, [storeFilters.startDate, storeFilters.endDate]);



const getReservationPage = (roomTypeId: string) => {
  return reservationPageMap[roomTypeId] || 1;
};

const handleReservationPageChange = (roomTypeId: string, page: number) => {  
  setReservationPageMap((prev) => {
    const next = { ...prev, [roomTypeId]: page };    
    return next;
  });
};  

const { data: reportData, isLoading, isError } = usePropertyReport(
   {
      propertyId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
   },
   {
      page: 1,
      pageSize: 20,
      reservationPage: reservationPageMap,
      reservationPageSize: 10,
      sortBy: 'startDate',
      sortDir: 'desc'
   }
);

  const propertySummary: PropertySummary | undefined = reportData?.properties?.[0];
  const property = propertySummary?.property;
  const summary = propertySummary?.summary;
  const roomTypes = propertySummary?.roomTypes || [];
  const period = propertySummary?.period;
  
  const roomTypesWithPagination = roomTypes.map((rt) => ({
    ...rt,
    pagination: {
      ...rt.pagination,
      page: getReservationPage(rt.roomType.id),
    },
  }));

  if (isLoading) {
    return <PropertyReportSkeleton />;
  }

  if (isError || !reportData || !property || !roomTypes ) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Report</CardTitle>
            <CardDescription>Failed to load property report data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Unable to fetch report data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Property Report</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                {property?.name}
                <Badge variant="secondary">{property?.city}</Badge>
              </CardTitle>
              <CardDescription>{property?.address}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Period: {period?.startDate ? format(new Date(period.startDate), 'MMM d, yyyy') : ''} - {period?.endDate ? format(new Date(period.endDate), 'MMM d, yyyy') : ''}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {summary && <SummaryCards summary={summary} />}

      <Card >
        <CardHeader>
          <CardTitle>Room Types Performance</CardTitle>
          <CardDescription>Performance metrics and availability for each room type</CardDescription>
        </CardHeader>
        <CardContent >
          <RoomTypeAccordion 
            roomTypes={roomTypesWithPagination} 
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onReservationPageChange={handleReservationPageChange}
          />            
        </CardContent>
      </Card>
    </div>
  );
}

function PropertyReportSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-40" />
      </div>
      
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
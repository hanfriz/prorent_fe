"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, TrendingUp, Info } from "lucide-react";
import { usePeakRates } from "@/service/usePeakRate";
import { PeakRate } from "@/interface/peakRateInterface";

interface PriceDisplayProps {
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
  showPeakRates?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  roomTypeId,
  roomTypeName,
  basePrice,
  showPeakRates = true,
}) => {
  const [showPeakRateDialog, setShowPeakRateDialog] = useState(false);

  const { data: peakRatesResponse, isLoading } = usePeakRates(roomTypeId);
  const peakRates = peakRatesResponse?.data || [];

  // Filter upcoming peak rates (within next 3 months)
  const now = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(now.getMonth() + 3);

  const upcomingPeakRates = peakRates.filter((peakRate) => {
    const startDate = new Date(peakRate.startDate);
    return startDate >= now && startDate <= threeMonthsFromNow;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateFinalPrice = (peakRate: PeakRate) => {
    if (peakRate.rateType === "FIXED") {
      return peakRate.value;
    } else {
      return basePrice + (basePrice * peakRate.value) / 100;
    }
  };

  const getRateDisplayText = (peakRate: PeakRate) => {
    if (peakRate.rateType === "FIXED") {
      return formatCurrency(peakRate.value);
    } else {
      return `+${peakRate.value}%`;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(basePrice)}
        </p>
        <span className="text-sm text-gray-600">per night</span>
        {showPeakRates && upcomingPeakRates.length > 0 && (
          <Dialog
            open={showPeakRateDialog}
            onOpenChange={setShowPeakRateDialog}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Peak rates</span>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Upcoming Peak Rates
                </DialogTitle>
                <DialogDescription>
                  Special pricing for {roomTypeName} in the upcoming months
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {upcomingPeakRates.map((peakRate) => (
                  <div
                    key={peakRate.id}
                    className="border rounded-lg p-3 bg-gradient-to-r from-orange-50 to-red-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          peakRate.rateType === "FIXED"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {peakRate.rateType === "FIXED"
                          ? "Fixed Price"
                          : "Percentage"}
                      </Badge>
                      <span className="font-semibold text-orange-600">
                        {getRateDisplayText(peakRate)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {formatDate(peakRate.startDate)} -{" "}
                        {formatDate(peakRate.endDate)}
                      </p>
                      <p className="text-orange-600 font-semibold">
                        Final Price:{" "}
                        {formatCurrency(calculateFinalPrice(peakRate))}
                      </p>
                      {peakRate.description && (
                        <p className="text-gray-600 text-xs mt-1">
                          {peakRate.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {showPeakRates && upcomingPeakRates.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-600">
          <Info className="w-3 h-3" />
          <span>{upcomingPeakRates.length} peak rate period(s) coming up</span>
        </div>
      )}

      {showPeakRates && !isLoading && upcomingPeakRates.length === 0 && (
        <p className="text-xs text-gray-500">Standard pricing applies</p>
      )}
    </div>
  );
};

export default PriceDisplay;

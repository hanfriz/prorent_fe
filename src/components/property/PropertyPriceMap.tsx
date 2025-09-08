import { formatDateToJakartaYYYYMMDD } from "@/view/reservation/component/calenderHelper";

// Helper: Generate priceMap from roomType and peak rates (USE AS IS)
export const generatePriceMap = (roomType: {
  basePrice: number;
  upcomingPeakRates?: Array<{
    startDate: string;
    endDate: string;
    rateType: "FIXED" | "PERCENTAGE";
    value: number; // ✅ This is the FINAL price — use as-is
  }>;
}): Record<string, number> => {
  const priceMap: Record<string, number> = {};

  if (!roomType.upcomingPeakRates || roomType.upcomingPeakRates.length === 0) {
    return priceMap;
  }

  for (const peak of roomType.upcomingPeakRates) {
    const start = new Date(peak.startDate);
    const end = new Date(peak.endDate);

    let current = new Date(start);
    while (current < end) {
      const dateKey = formatDateToJakartaYYYYMMDD(current);
      priceMap[dateKey] = peak.value; // ✅ Use peak.value AS IS — final price
      current.setDate(current.getDate() + 1);
    }
  }

  return priceMap;
};

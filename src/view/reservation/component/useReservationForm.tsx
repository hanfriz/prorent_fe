import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { createReservation } from "@/service/reservationService";
import moment from "moment-timezone";

export function useReservationForm({
  mockReservationData,
  startDate,
  endDate,
}: {
  mockReservationData: any;
  startDate?: Date;
  endDate?: Date;
}) {
  const router = useRouter();
  const { setReservationId } = useReservationStore();
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchedPriceMap: Record<string, number> = {
      "2025-08-23": 120000,
      "2025-08-24": 135000,
      "2025-08-25": 110000,
      "2025-08-26": 150000,
    };
    setPriceMap(fetchedPriceMap);
  }, []);

  const isFormValid = () => {
    return (
      startDate !== undefined && endDate !== undefined && startDate < endDate
    );
  };

  const form = useForm({
    defaultValues: {
      ...mockReservationData,
      startDate: "",
      endDate: "",
    },
    onSubmit: async ({ value }) => {
      if (!isFormValid() || !startDate || !endDate) return;

      try {
        const start = moment
          .tz(startDate, "Asia/Jakarta")
          .startOf("day")
          .toDate();
        const end = moment.tz(endDate, "Asia/Jakarta").startOf("day").toDate();

        const payload = {
          ...value,
          startDate: start,
          endDate: end,
          PaymentType: value.paymentType,
        };

        const res = await createReservation(payload);
        const data = res.reservation;

        setReservationId(data.id);
        router.push(`/payment/${data.id}`);
      } catch (err) {
        console.error(err);
      }
    },
  });

  return { form, priceMap, isFormValid };
}

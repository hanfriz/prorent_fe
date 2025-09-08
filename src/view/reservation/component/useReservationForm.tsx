// src/view/reservation/component/useReservationForm.tsx
"use client";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { useCreateReservation } from "@/service/useReservation";
import moment from "moment-timezone";
import { PaymentType } from "@/interface/enumInterface";
import { CreateReservationInput } from "@/validation/reservationValidation";
import { useAuth } from "@/lib/hooks/useAuth";

const createForm = () =>
  useForm({
    defaultValues: {
      userId: "",
      propertyId: "",
      roomTypeId: "",
      paymentType: undefined as PaymentType | undefined,
      payerEmail: "",
      startDate: new Date(),
      endDate: new Date(),
    } satisfies CreateReservationInput | Partial<CreateReservationInput>,
    onSubmit: async () => {},
  });

export type ReservationForm = ReturnType<typeof createForm>;

export type UseReservationFormReturn = {
  form: ReservationForm;
  priceMap: Record<string, number>;
  isFormValid: () => boolean;
};

export function useReservationForm({
  displayData,
  formData,
  startDate,
  endDate,
  setField,
}: {
  displayData: {
    propertyName?: string;
    propertyType?: string;
    roomTypeName?: string;
    basePrice?: number;
    mainImageUrl?: string;
    priceMap?: Record<string, number>;
  };
  formData: Partial<CreateReservationInput>;
  startDate?: Date;
  endDate?: Date;
  setField: (key: keyof CreateReservationInput, value: any) => void;
}): UseReservationFormReturn {
  const router = useRouter();
  const { setReservationId } = useReservationStore();
  const createMutation = useCreateReservation();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const priceMap = displayData.priceMap || {};

  console.log("priceMap", priceMap);

  const userId = user?.id;
  const email = user?.email;

  const isFormValid = () => {
    return !!startDate && !!endDate && startDate < endDate;
  };
  const form = useForm({
    defaultValues: {
      userId: userId || "",
      propertyId: formData.propertyId || "",
      roomTypeId: formData.roomTypeId || "",
      paymentType: formData.paymentType || PaymentType.MANUAL_TRANSFER,
      payerEmail: formData.payerEmail || "",
      startDate: moment.tz(startDate, "Asia/Jakarta").toDate(),
      endDate: moment.tz(endDate, "Asia/Jakarta").toDate(),
    } satisfies CreateReservationInput,
    onSubmit: async ({ value }) => {
      if (!isFormValid() || !startDate || !endDate) return;
      if (!isAuthenticated || !userId || userId.startsWith("undefined")) {
        router.push("/login");
        throw new Error("User belum login");
      }

      const start = moment
        .tz(startDate, "Asia/Jakarta")
        .startOf("day")
        .toDate();
      const end = moment.tz(endDate, "Asia/Jakarta").startOf("day").toDate();

      console.log("startDate", start);
      console.log("endDate", end);

      const payload = {
        ...value,
        userId: userId,
        startDate: start,
        endDate: end,
        paymentType: value.paymentType as PaymentType,
      };

      try {
        const res = await createMutation.mutateAsync(payload);
        const data = res.reservation;
        const paymentUrl = res.paymentUrl;
        const reservationId = res.reservationId;
        console.log("data", res);
        if (payload.paymentType === PaymentType.MANUAL_TRANSFER) {
          setReservationId(data.id);
          router.push(`/payment/${data.id}`);
        } else {
          if (paymentUrl) window.open(paymentUrl, "_blank");
          router.push(`/payment/waiting?reservationId=${reservationId}`);
        }
        router.push(`/payment/${data.id}`);
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
  }) as UseReservationFormReturn["form"];

  useEffect(() => {
    if (startDate) {
      const formatted = startDate.toISOString();
      setField("startDate", formatted);
      form.setFieldValue("startDate", new Date(formatted));
    }
    if (endDate) {
      const formatted = endDate.toISOString();
      setField("endDate", formatted);
      form.setFieldValue("endDate", new Date(formatted));
    }
  }, [startDate, endDate, setField, form]);

  return {
    form,
    priceMap,
    isFormValid,
  };
}

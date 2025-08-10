import moment from "moment-timezone";
import { z } from "zod";
import { PaymentType } from "../interface/enumInterface";

export const createReservationSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    propertyId: z.string().min(1, "Property ID is required"),
    roomTypeId: z.string().optional(),
    startDate: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return moment.tz(val, "Asia/Jakarta").toDate();
      }
      return val;
    }, z.date({ error: "Start date is required" })),
    endDate: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return moment.tz(val, "Asia/Jakarta").toDate();
      }
      return val;
    }, z.date({ error: "End date is required" })),
    paymentType: z.enum([PaymentType.MANUAL_TRANSFER, PaymentType.XENDIT], {
      error: (iss) => {
        if (iss.code === "invalid_value") {
          return `invalid type, expected ${iss.expected} but received ${iss.received}`;
        }
      },
    }),
    payerEmail: z.email("Invalid email format").optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

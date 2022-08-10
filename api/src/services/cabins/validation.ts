import { z } from "zod";

export const bookingSchema = z
  .object({
    startDate: z.date().min(new Date(), { message: "start date must be in the future" }),
    endDate: z.date().min(new Date(), { message: "end date must be in the future" }),
    email: z.string().email({ message: "invalid email" }),
    phoneNumber: z.string().regex(/^(0047|\+47|47)?\d{8} $/, {
      message: "invalid phone number",
    }),
    cabinId: z.string().uuid({ message: "invalid cabin id" }),
  })
  .refine((obj) => obj.endDate > obj.startDate, {
    message: "end date must be after start date",
  });

export type BookingSchema = typeof bookingSchema;

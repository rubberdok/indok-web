import dayjs from "dayjs";
import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email({ message: "invalid email" }),
  username: z.string(),
  feideId: z.string(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email({ message: "invalid email" }).optional(),
  graduationYear: z.number().min(dayjs().year()).optional(),
  allergies: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^(0047|\+47|47)?[49]\d{7}$/)
    .optional(),
});

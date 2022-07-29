import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email({ message: "invalid email" }),
  phoneNumber: z.string().regex(/^(0047|\+47|47)?\d{8} $/, {
    message: "invalid phone number",
  }),
});

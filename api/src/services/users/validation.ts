import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email({ message: "invalid email" }),
  username: z.string(),
  feideId: z.string(),
});

import { Prisma, User } from "@prisma/client";

export interface TestCase {
  name: string;
  input: Partial<Prisma.UserUpdateInput>;
  updateInput: Partial<Prisma.UserUpdateInput>;
  existing: User;
  expected: User;
}

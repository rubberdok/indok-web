import { Prisma, User } from "@prisma/client";

export interface CreateUserCase {
  input: Prisma.UserCreateInput;
  expected: Pick<
    User,
    "username" | "email" | "feideId" | "firstName" | "lastName"
  >;
}

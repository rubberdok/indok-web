import { PrismaClient } from ".prisma/client";

export const authRepository = (db: PrismaClient) => {
  return {};
};

export type AuthRepository = ReturnType<typeof authRepository>;

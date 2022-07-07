import { PrismaClient } from "@prisma/client";
import { permissions } from "./permissions";
import { users } from "./users";

export type Repository = ReturnType<typeof repository>;

const repository = (db: PrismaClient) =>
  ({
    users: users(db),
    permissions: permissions(db),
  } as const);

export default repository;

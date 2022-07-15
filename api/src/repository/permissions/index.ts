import { Permission, PrismaClient } from "@prisma/client";
import { Context } from "../../context";

export const permissions = (db: PrismaClient) => ({
  getAllByUser: (userId: string): Promise<Permission[]> => {
    return db.permission.findMany({
      where: {
        userId: userId,
      },
    });
  },
});

export type PermissionsRepository = ReturnType<typeof permissions>;

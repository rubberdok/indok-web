import { Permission, PrismaClient } from "@prisma/client";

export const permissions = (db: PrismaClient) => ({
  getAllByUser: (userId: string): Promise<Permission[]> => {
    return db.permission.findMany({
      where: {
        OR: [
          { userId: userId },
          {
            role: {
              userId: userId,
            },
          },
        ],
      },
    });
  },
});

export type PermissionsRepository = ReturnType<typeof permissions>;

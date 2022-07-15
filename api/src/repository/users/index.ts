import { PrismaClient, User } from "@prisma/client";

export const users = (db: PrismaClient) => ({
  getAll: async (): Promise<User[]> => {
    return db.user.findMany();
  },

  get: async (id: string): Promise<User> => {
    return db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  },

  getByFeideId: async (feideId: string): Promise<User> => {
    return db.user.findFirstOrThrow({
      where: {
        feideId,
      },
    });
  },

  create: async (data: {
    feideId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> => {
    return db.user.create({
      data,
    });
  },
});

export type UsersRepository = ReturnType<typeof users>;

import { Prisma, PrismaClient } from "@prisma/client";

export const userData: Prisma.UserCreateInput[] = [
  {
    username: "eva_student",
    feideId: "asdf",
    email: "example@example.org",
  },
];

export const load = async (client: PrismaClient) => {
  console.log("Seeding users");
  client.user.createMany({
    data: userData,
  });
};

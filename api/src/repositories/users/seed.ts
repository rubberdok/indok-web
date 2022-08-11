import { Prisma, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const userData: Prisma.UserCreateInput[] = [
  {
    username: "indok",
    feideId: "indok",
    email: "example@example.org",
    firstName: "Indok",
    lastName: "Student",
    graduationYear: dayjs().add(5, "year").year(),
  },
  {
    username: "rubberdok",
    feideId: "rubberdok",
    email: "rubberdok@example.org",
    firstName: "Rubb",
    lastName: "Er Dok",
    graduationYear: dayjs().add(5, "year").year(),
  },
];

export const load = async (db: PrismaClient) => {
  console.log("Seeding users");
  for (const user of userData) {
    await db.user.upsert({
      where: {
        feideId: user.feideId,
      },
      update: {},
      create: user,
    });
  }
};

import { Prisma, PrismaClient } from "@prisma/client";

export const userData: Prisma.UserCreateInput[] = [
  {
    username: "eva_student",
    feideId: "evastudent",
    email: "example@example.org",
    firstName: "Eva",
    lastName: "Student Aasen",
  },
  {
    username: "rubberdok",
    feideId: "rubberdok",
    email: "rubberdok@example.org",
    firstName: "Rubb",
    lastName: "Er Dok",
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

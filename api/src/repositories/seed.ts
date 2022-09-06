import { PrismaClient } from "@prisma/client";

import * as Users from "./users/seed";

const db = new PrismaClient();

const main = async () => {
  console.log("Seeding...");
  Users.load(db);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Finished");
    await db.$disconnect();
  });

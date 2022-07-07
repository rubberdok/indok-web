import { PrismaClient } from "@prisma/client";
import * as Users from "./users/seed";

const client = new PrismaClient();

const main = async () => {
  console.log("Seeding...");
  Users.load(client);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Finished");
    await client.$disconnect();
  });

import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

import { CoreTypes, IMailClient, Postmark, Prisma } from "@/core";
import { Context } from "@/graphql/context";
import * as Repositories from "@/repositories";
import * as Services from "@/services";

function initializeContainer() {
  // register Prisma
  container.register<PrismaClient>(CoreTypes.Prisma, { useValue: Prisma });

  // register Postmark
  container.register<IMailClient>(CoreTypes.MailClient, { useValue: Postmark });

  // register Context
  Context.register(container);
  // register Repositories
  Repositories.register(container);
  // register Services
  Services.register(container);
}

export { initializeContainer };

import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";

import { IMailClient, Prisma, Postmark, CoreTypes } from "@/core";
import { Context } from "@/graphql";
import * as Repositories from "@/repositories";
import * as Services from "@/services";

export const container = new Container();

// Bind Prisma
container.bind<PrismaClient>(CoreTypes.Prisma).toConstantValue(Prisma);

// Bind Postmark
container.bind<IMailClient>(CoreTypes.MailClient).toConstantValue(Postmark);

// Bind Context
Context.bind(container);
// Bind Repositories
Repositories.bind(container);
// Bind Services
Services.bind(container);

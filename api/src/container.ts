import "reflect-metadata";

import { Container } from "inversify";

import { PrismaClient } from "@prisma/client";

import { Context } from "./graphql";
import { Prisma, Types as CoreTypes } from "./core";

import * as Repositories from "./repositories";
import * as Services from "./services";

export const container = new Container();

container.bind<PrismaClient>(CoreTypes.Prisma).toConstantValue(Prisma);

Context.bind(container);
Repositories.bind(container);
Services.bind(container);

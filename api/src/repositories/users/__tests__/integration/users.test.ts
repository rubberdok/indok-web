import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";

import UserRepository from "@/repositories/users";
import { Types } from "@/repositories";
import { CoreTypes } from "@//core";
import prisma from "@/lib/prisma";
import { IUserRepository } from "@/repositories/interfaces";

import { CreateUserCase } from "./interfaces";

const container = new Container();

beforeAll(() => {
  container.unbindAll();
  container.bind<PrismaClient>(CoreTypes.Prisma).toConstantValue(prisma);
  container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
});

beforeEach(async () => {
  const db = container.get<PrismaClient>(CoreTypes.Prisma);
  const user = await db.user.findFirst({
    where: {
      feideId: "test-1"
    }
  })
  if (user !== null) {
    await db.user.delete({
      where: {
        id: user.id,
      },
    });
  }
});

const usersTable: CreateUserCase[] = [
  {
    input: {
      username: "test-1",
      email: "example@example.com",
      feideId: "test-1",
      firstName: "first",
      lastName: "last",
    },
    expected: {
      username: "test-1",
      email: "example@example.com",
      feideId: "test-1",
      firstName: "first",
      lastName: "last",
    },
  },
];

test.each(usersTable)("createUser($input)", async ({ input, expected }) => {
  const repo = container.get<IUserRepository>(Types.UserRepository);
  const got = await repo.create(input);
  const { username, email, feideId, firstName, lastName } = got;
  expect({ username, email, feideId, firstName, lastName }).toMatchObject(expected);
  expect(got.id).toBeTruthy();
  expect(got.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
});

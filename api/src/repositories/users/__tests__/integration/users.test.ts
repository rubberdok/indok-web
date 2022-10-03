import "reflect-metadata";

import { PrismaClient } from "@prisma/client";
import { container as _container } from "tsyringe";

import { CoreTypes } from "@//core";
import prisma from "@/lib/prisma";
import { Types } from "@/repositories";
import { IUserRepository } from "@/repositories/interfaces";
import UserRepository from "@/repositories/users";

import { CreateUserCase } from "./interfaces";

const container = _container.createChildContainer();

beforeAll(() => {
  container.register<PrismaClient>(CoreTypes.Prisma, { useValue: prisma });
  container.register<IUserRepository>(Types.UserRepository, { useClass: UserRepository });
});

beforeEach(async () => {
  const db = container.resolve<PrismaClient>(CoreTypes.Prisma);
  const user = await db.user.findFirst({
    where: {
      feideId: "test-1",
    },
  });
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
  const repo = container.resolve<IUserRepository>(Types.UserRepository);
  const got = await repo.create(input);
  const { username, email, feideId, firstName, lastName } = got;
  expect({ username, email, feideId, firstName, lastName }).toMatchObject(expected);
  expect(got.id).toBeTruthy();
  expect(got.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
});

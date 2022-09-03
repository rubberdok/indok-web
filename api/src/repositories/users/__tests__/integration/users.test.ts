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

beforeEach(() => {
  const db = container.get<PrismaClient>(CoreTypes.Prisma);
  db.user.delete({
    where: {
      id: "test-1",
    },
  });
});

const usersTable: CreateUserCase[] = [
  {
    input: {
      username: "test-1",
      email: "example@example.com",
      feideId: "asdf",
      firstName: "first",
      lastName: "last",
    },
    expected: {
      username: "test-1",
      email: "example@example.com",
      feideId: "asdf",
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

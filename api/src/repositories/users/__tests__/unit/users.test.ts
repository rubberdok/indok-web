import "reflect-metadata";

import { Prisma, PrismaClient, User } from "@prisma/client";
import { Container } from "inversify";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import UserRepository from "../..";
import { Types } from "../../..";
import { CoreTypes } from "../../../../core";
import prisma from "../../../../lib/prisma";
import { IUserRepository } from "../../../interfaces";

describe("UsersRepository", () => {
  const container = new Container();

  beforeAll(() => {
    container.unbindAll();
    container
      .bind<DeepMockProxy<PrismaClient>>(CoreTypes.Prisma)
      .toConstantValue(mockDeep<PrismaClient>(prisma));
    container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
  });

  const usersTable: {
    input: Prisma.UserCreateInput;
    expected: User;
  }[] = [
    {
      input: {
        username: "test-1",
        email: "example@example.com",
        feideId: "asdf",
        firstName: "first",
        lastName: "last",
      },
      expected: {
        id: "some-cuid",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        username: "test-1",
        email: "example@example.com",
        feideId: "asdf",
        firstName: "first",
        lastName: "last",
      },
    },
  ];

  test.each(usersTable)("createUser($input)", async ({ input, expected }) => {
    const db = container.get<DeepMockProxy<PrismaClient>>(CoreTypes.Prisma);
    const repo = container.get<IUserRepository>(Types.UserRepository);

    db.user.create.mockResolvedValue(expected);
    const got = await repo.create(input);
    expect(got).toMatchObject(expected);
  });
});

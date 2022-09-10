import "reflect-metadata";

import { Prisma, PrismaClient, User } from "@prisma/client";
import { Container } from "inversify";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { CoreTypes } from "@/core";
import { Types } from "@/repositories";
import { IUserRepository } from "@/repositories/interfaces";
import UserRepository from "@/repositories/users";

const container = new Container();

const dummyUser = mockDeep<User>();

describe("UsersRepository", () => {
  beforeAll(() => {
    container.unbindAll();
    container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
    const mockDb = mockDeep<PrismaClient>();
    container.bind<DeepMockProxy<PrismaClient>>(CoreTypes.Prisma).toConstantValue(mockDeep<PrismaClient>(mockDb));
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
        ...dummyUser,
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
    db.user.create.mockResolvedValueOnce(expected);

    const repo = container.get<IUserRepository>(Types.UserRepository);
    const got = await repo.create(input);
    expect(got).toMatchObject(expected);
  });
});

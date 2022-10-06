import "reflect-metadata";

import { Prisma, PrismaClient, User } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { container as _container } from "tsyringe";

import { CoreTypes } from "@/core";
import { Types } from "@/repositories";
import { IUserRepository } from "@/repositories/interfaces";
import { UserRepository } from "@/repositories/users";

const container = _container.createChildContainer();

const dummyUser = mockDeep<User>();

describe("UsersRepository", () => {
  beforeAll(() => {
    container.register<IUserRepository>(Types.UserRepository, { useClass: UserRepository });
    const mockDb = mockDeep<PrismaClient>();
    container.register<DeepMockProxy<PrismaClient>>(CoreTypes.Prisma, { useValue: mockDeep<PrismaClient>(mockDb) });
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
    const db = container.resolve<DeepMockProxy<PrismaClient>>(CoreTypes.Prisma);
    db.user.create.mockResolvedValueOnce(expected);

    const repo = container.resolve<IUserRepository>(Types.UserRepository);
    const got = await repo.create(input);
    expect(got).toMatchObject(expected);
  });
});

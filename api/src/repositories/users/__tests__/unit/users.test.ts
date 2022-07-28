import { Prisma, PrismaClient, User } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import UserRepository from "../..";
import { IUserRepository } from "../../../interfaces";

describe("UsersRepository", () => {
  let repo: IUserRepository;
  let mockDB: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    mockDB = mockDeep<PrismaClient>();
    repo = new UserRepository(mockDB);
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
    mockDB.user.create.mockResolvedValue(expected);
    const got = await repo.create(input);
    expect(got).toMatchObject(expected);
  });
});

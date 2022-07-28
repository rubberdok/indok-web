import { Prisma, PrismaClient, User } from "@prisma/client";
import UserRepository from "../..";
import { IUserRepository } from "../../../interfaces";

let repo: IUserRepository;

beforeAll(() => {
  repo = new UserRepository(new PrismaClient());
});

type UsersTable = {
  input: Prisma.UserCreateInput;
  expected: Pick<
    User,
    "username" | "email" | "feideId" | "firstName" | "lastName"
  >;
}[];

const usersTable: UsersTable = [
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
  const got = await repo.create(input);
  const { username, email, feideId, firstName, lastName } = got;
  expect({ username, email, feideId, firstName, lastName }).toMatchObject(
    expected
  );
  expect(got.id).toBeTruthy();
  expect(got.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
});

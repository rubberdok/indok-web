import { Prisma, User } from "@prisma/client";
import context, { Context, initializeDB } from "../../../../context";

let ctx: Context;

beforeAll(() => {
  ctx = context(initializeDB());
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
  const got = await ctx.repository.users.create(input);
  const { username, email, feideId, firstName, lastName } = got;
  expect({ username, email, feideId, firstName, lastName }).toMatchObject(
    expected
  );
  expect(got.id).toBeTruthy();
  expect(got.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
});

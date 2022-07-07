import { Prisma, User } from "@prisma/client";
import context, { Context, initializeDB } from "../../../../context";

let ctx: Context;

beforeAll(() => {
  ctx = context(initializeDB());
});

type UsersTable = {
  input: Prisma.UserCreateInput;
  expected: Pick<User, "username" | "email" | "feideId">;
}[];

const usersTable: UsersTable = [
  {
    input: {
      username: "test-1",
      email: "example@example.com",
      feideId: "asdf",
    },
    expected: {
      username: "test-1",
      email: "example@example.com",
      feideId: "asdf",
    },
  },
];

test.each(usersTable)("createUser($input)", async ({ input, expected }) => {
  const got = await ctx.repository.users.create(input);
  const { username, email, feideId } = got;
  expect({ username, email, feideId }).toMatchObject(expected);
  expect(got.id).toBeTruthy();
  expect(got.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
});

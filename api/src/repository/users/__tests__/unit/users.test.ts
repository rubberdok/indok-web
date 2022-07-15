import { Prisma, User } from "@prisma/client";
import { Context, createMockContext, MockContext } from "../../../../context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx;
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
  mockCtx.db.user.create.mockResolvedValue(expected);
  const got = await ctx.repository.users.create(input);
  expect(got).toMatchObject(expected);
});

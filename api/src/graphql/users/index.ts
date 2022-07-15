import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Permission } from "../permissions";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("feideId");
    t.nonNull.dateTime("createdAt");
    t.list.field("permissions", {
      type: Permission,
      resolve: async (root, _args, ctx) => {
        const permissions = await ctx.repository.permissions.getAllByUser(
          root.id
        );
        return permissions;
      },
    });
  },
});

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      async resolve(_root, _args, ctx) {
        const users = await ctx.repository.users.getAll();
        return users;
      },
    });
  },
});

export const CreateUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: "User",
      args: {
        username: nonNull(stringArg()),
        feideId: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const user = await ctx.repository.users.create(args);
        return user;
      },
    });
  },
});

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("user", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_root, { id }, ctx) => {
        const user = await ctx.repository.users.get(id);
        return user;
      },
    });
  },
});

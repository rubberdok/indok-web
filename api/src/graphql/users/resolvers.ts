import { Resolvers } from "../generated/types";

export const resolvers: Resolvers = {
  Query: {
    async user(_root, _args, ctx) {
      const { userId } = ctx.req.session;
      if (userId) {
        const user = await ctx.userService.get(userId);
        return {
          user: user,
        };
      }
      return {
        user: null,
      };
    },

    async users(_root, _args, ctx) {
      const users = await ctx.userService.getAll();
      return {
        users,
        total: users.length,
      };
    },
  },

  Mutation: {
    updateUser(_root, { id, data }, ctx) {
      return ctx.userService.update(id, data);
    },
  },

  User: {
    canUpdateYear(user, _args, ctx) {
      return ctx.userService.canUpdateYear(user);
    },
  },
};

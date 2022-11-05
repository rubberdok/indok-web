import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Query: {
    user: (_root, _args, ctx) => {
      const { userId } = ctx.req.session;
      if (userId) {
        return ctx.userService.get(userId);
      }
      return null;
    },
    users: (_root, _args, ctx) => {
      return ctx.userService.getAll();
    },
  },
  Mutation: {
    updateUser: (_root, { id, data }, ctx) => {
      return ctx.userService.update(id, data);
    },
  },
  User: {
    canUpdateYear: (user, _args, ctx) => ctx.userService.canUpdateYear(user),
  },
};

export default resolvers;

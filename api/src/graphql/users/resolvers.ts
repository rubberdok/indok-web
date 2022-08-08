import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Query: {
    user: (_root, _args, ctx) => {
      if (ctx.req.session.user) {
        return ctx.userService.get(ctx.req.session.user.id);
      }
      return null;
    },
    users: (_root, _args, ctx) => {
      return ctx.userService.getAll();
    },
  },
  User: {
    username: (user) => user.username,
    firstName: (user) => user.firstName,
    lastName: (user) => user.lastName,
    permissions: (user, _args, ctx) =>
      ctx.permissionService.getAllByUser(user.id),
  },
};

export default resolvers;

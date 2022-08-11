import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Query: {
    user: (_root, _args, ctx) => {
      console.log(ctx.req.session);
      if (ctx.req.session.user) {
        return ctx.userService.get(ctx.req.session.user.id);
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
    permissions: (user, _args, ctx) => ctx.permissionService.getAllByUser(user.id),
    canUpdateYear: (user, _args, ctx) => ctx.userService.canUpdateYear(user),
  },
};

export default resolvers;

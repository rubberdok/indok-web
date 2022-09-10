import { Resolvers } from "@/graphql/generated/types";

const resolvers: Resolvers = {
  Query: {
    hasPermission: async (_root, { permission }, ctx) => {
      if (ctx.req.session.user) {
        return await ctx.permissionService.hasPermission(ctx.req.session.user, permission);
      }
      return Promise.resolve(false);
    },
  },
};

export default resolvers;

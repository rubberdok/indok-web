import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Query: {
    user: (_root, { id }, ctx) => {
      try {
        return ctx.userService.get(id);
      } catch (err) {
        if (err instanceof Error && err.name === "NotFoundError") {
          return null;
        }
        throw new GraphQLError("Internal server error", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      }
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

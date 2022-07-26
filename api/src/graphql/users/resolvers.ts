import { ApolloError } from "apollo-server-core";
import { Resolvers } from "../generated/types";

export const resolvers: Resolvers = {
  Query: {
    user: (_root, { id }, ctx) => {
      try {
        return ctx.service.users.get(id);
      } catch (err) {
        if (err instanceof Error && err.name === "NotFoundError") {
          return null;
        }
        throw new ApolloError("Internal server error");
      }
    },
    users: (_root, _args, ctx) => ctx.service.users.getAll(),
  },
  User: {
    username: (user) => user.username,
    firstName: (user) => user.firstName,
    lastName: (user) => user.lastName,
    permissions: (user, _, ctx) =>
      ctx.service.permissions.getAllByUser(user.id),
  },
};

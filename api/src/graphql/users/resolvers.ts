import { ApolloError } from "apollo-server-core";
import { Resolvers } from "../resolvers-types";

export const resolvers: Resolvers = {
  Query: {
    user: (_, { id }, ctx) => {
      try {
        return ctx.service.users.get(id);
      } catch (err) {
        if (err instanceof Error && err.name === "NotFoundError") {
          return null;
        }
        console.log("throwing new err");
        throw new ApolloError("Internal server error");
      }
    },
    users: (_, __, ctx) => ctx.service.users.getAll(),
  },
  User: {
    username: (user) => user.username,
    firstName: (user) => user.firstName,
    lastName: (user) => user.lastName,
    permissions: (user, _, ctx) =>
      ctx.service.permissions.getAllByUser(user.id),
  },
};

import { permissions } from "./permissions/schema";
import { Resolvers } from "./generated/types";
import { mutations, queries } from "./schema";
import { typeDefs as userTypes, resolvers as userResolvers } from "./users";
import merge from "lodash/merge";

export const resolvers: Resolvers = merge(userResolvers);

export const typeDefs = [queries, mutations, permissions, userTypes];

import { mergeResolvers } from "@graphql-tools/merge";

import { Resolvers } from "./generated/types";

import { resolvers as userResolvers } from "./users";
import { resolvers as scalarResolvers } from "./scalars";
import { resolvers as cabinResolvers } from "./cabins";

const resolvers: Resolvers = mergeResolvers([
  userResolvers,
  cabinResolvers,
  scalarResolvers,
]);

export default resolvers;

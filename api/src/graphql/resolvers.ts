import { mergeResolvers } from "@graphql-tools/merge";

import { Resolvers } from "./generated/types";

import { resolvers as userResolvers } from "./users";
import { resolvers as scalarResolvers } from "./scalars";
import { resolvers as cabinResolvers } from "./cabins";
import { resolvers as authResolvers } from "./auth";
import { resolvers as permissionResolvers } from "./permissions";

const resolvers: Resolvers = mergeResolvers([
  userResolvers,
  cabinResolvers,
  scalarResolvers,
  authResolvers,
  permissionResolvers,
]);

export default resolvers;

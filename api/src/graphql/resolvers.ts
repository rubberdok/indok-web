import { mergeResolvers } from "@graphql-tools/merge";

import { resolvers as authResolvers } from "@/graphql/auth";
import { resolvers as cabinResolvers } from "@/graphql/cabins";
import { Resolvers } from "@/graphql/generated/types";
import { resolvers as permissionResolvers } from "@/graphql/permissions";
import { resolvers as scalarResolvers } from "@/graphql/scalars";
import { resolvers as userResolvers } from "@/graphql/users";

const resolvers: Resolvers = mergeResolvers([
  userResolvers,
  cabinResolvers,
  scalarResolvers,
  authResolvers,
  permissionResolvers,
]);

export default resolvers;

import { mergeResolvers } from "@graphql-tools/merge";

import { resolvers as authResolvers } from "./auth";
import { resolvers as cabinResolvers } from "./cabins";
import { Resolvers } from "./generated/types";
import { resolvers as scalarResolvers } from "./scalars";
import { resolvers as userResolvers } from "./users";

export const resolvers: Resolvers = mergeResolvers([userResolvers, cabinResolvers, scalarResolvers, authResolvers]);

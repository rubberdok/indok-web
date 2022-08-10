import { mergeResolvers } from "@graphql-tools/merge";

import { Resolvers } from "./generated/types";

import { resolvers as userResolvers } from "./users";
import { resolvers as scalarResolvers } from "./scalars";
import { resolvers as cabinResolvers } from "./cabins";
import { resolvers as authResolvers } from "./auth";

const resolvers: Resolvers = mergeResolvers([userResolvers, cabinResolvers, scalarResolvers, authResolvers]);

export default resolvers;

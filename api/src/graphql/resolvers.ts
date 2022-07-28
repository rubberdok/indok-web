import { mergeResolvers } from "@graphql-tools/merge";

import { Resolvers } from "./generated/types";

import { resolvers as userResolvers } from "./users";

const resolvers: Resolvers = mergeResolvers(userResolvers);

export default resolvers;

import { DateTimeResolver } from "graphql-scalars";

import { Resolvers } from "../generated/types";

export { typeDefs } from "./type-defs";

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
};

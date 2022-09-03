import { DateTimeResolver } from "graphql-scalars";
import { Resolvers } from "@/graphql/generated/types";

export { default as typeDefs } from "./type-defs";

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
};

import { GraphQLScalarType } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { asNexusMethod } from "nexus";

export const DateTimeScalar = asNexusMethod(
  GraphQLDateTime as unknown as GraphQLScalarType,
  "dateTime"
);

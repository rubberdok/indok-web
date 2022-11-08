import { DateTimeTypeDefinition } from "graphql-scalars";
import gql from "graphql-tag";

export const typeDefs = gql`
  ${DateTimeTypeDefinition}
`;

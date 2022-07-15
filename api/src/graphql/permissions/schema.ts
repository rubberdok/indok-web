import { gql } from "apollo-server-core";

export const permissions = gql`
  type Permission {
    id: ID!
    name: String!
  }
`;

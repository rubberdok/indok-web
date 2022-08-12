import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    hasPermission(permission: String!): Boolean!
  }

  type Permission {
    id: ID!
    name: String!
  }
`;

export default typeDefs;

import { gql } from "apollo-server-core";

export const typeDefs = gql`
  extend type Query {
    user(id: String!): User
    users: [User!]!
  }

  type User {
    id: ID!
    lastName: String!
    firstName: String!
    username: String!
    permissions: [Permission!]!
    createdAt: String!
  }
`;

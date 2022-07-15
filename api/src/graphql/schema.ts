import { gql } from "apollo-server-core";

export const queries = gql`
  type Query {
    user(id: String!): User
  }
`;

export const mutations = gql`
  type Mutation {
    createUser(id: String!): User
  }
`;

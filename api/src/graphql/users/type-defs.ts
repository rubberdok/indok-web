import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    user(id: String!): User
    users: [User!]!
  }

  type Mutation {
    createUser(firstName: String!): User
  }

  type User {
    id: ID!
    lastName: String!
    firstName: String!
    username: String!
    createdAt: String!
    permissions: [Permission!]!
  }
`;

export default typeDefs;

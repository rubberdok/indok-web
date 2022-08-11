import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    user: User
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
    firstLogin: Boolean!
  }
`;

export default typeDefs;

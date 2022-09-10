import gql from "graphql-tag";

const typeDefs = gql`
  input UpdateUserInput {
    firstName: String!
    lastName: String!
    phoneNumber: String
    allergies: String
    graduationYear: Int
  }

  type Query {
    user: User
    users: [User!]!
  }

  type Mutation {
    createUser(firstName: String!): User
    updateUser(id: ID!, data: UpdateUserInput!): User!
  }

  type User {
    id: ID!
    lastName: String!
    firstName: String!
    username: String!
    createdAt: String!
    permissions: [Permission!]!
    firstLogin: Boolean!
    canUpdateYear: Boolean!
    graduationYear: Int
    phoneNumber: String
    allergies: String
    graduationYearUpdatedAt: DateTime
  }
`;

export default typeDefs;

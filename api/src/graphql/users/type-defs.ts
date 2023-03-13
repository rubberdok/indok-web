import gql from "graphql-tag";

export const typeDefs = gql`
  input UpdateUserInput {
    firstName: String!
    lastName: String!
    phoneNumber: String
    allergies: String
    graduationYear: Int
  }

  type UsersResponse {
    users: [User!]!
    total: Int!
  }

  type UserResponse {
    user: User
  }

  type Query {
    user: UserResponse!
    users: UsersResponse!
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
    firstLogin: Boolean!
    canUpdateYear: Boolean!
    graduationYear: Int
    phoneNumber: String
    allergies: String
    graduationYearUpdatedAt: DateTime
  }
`;

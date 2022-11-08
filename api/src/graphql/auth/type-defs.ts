import gql from "graphql-tag";

export const typeDefs = gql`
  type RedirectUrlResponse {
    url: String!
  }

  enum LogoutStatus {
    SUCCESS
    ERROR
  }

  type LogoutResponse {
    status: LogoutStatus!
  }

  type Mutation {
    redirectUrl(state: String): RedirectUrlResponse!
    authenticate(code: String!): UserResponse!
    logout: LogoutResponse!
  }
`;

import gql from "graphql-tag";

const typeDefs = gql`
  type Mutation {
    redirectUrl(state: String): String!
    authenticate(code: String!): User!
    logout: Boolean!
  }
`;

export default typeDefs;

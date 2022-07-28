import gql from "graphql-tag";

const typeDefs = gql`
  type Permission {
    id: ID!
    name: String!
  }
`;

export default typeDefs;

import { DateTimeTypeDefinition } from "graphql-scalars";

import gql from "graphql-tag";

const typeDefs = gql`
  ${DateTimeTypeDefinition}
`;

export default typeDefs;

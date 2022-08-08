import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as userTypes } from "./users";
import { typeDefs as permissionTypes } from "./permissions";
import { typeDefs as cabinTypes } from "./cabins";
import { typeDefs as scalarTypes } from "./scalars";
import { typeDefs as authTypes } from "./auth";

export const typeDefs = mergeTypeDefs([
  userTypes,
  permissionTypes,
  cabinTypes,
  scalarTypes,
  authTypes,
]);

export default typeDefs;

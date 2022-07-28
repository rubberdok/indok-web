import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as userTypes } from "./users";
import { typeDefs as permissionTypes } from "./permissions";

export const typeDefs = mergeTypeDefs([userTypes, permissionTypes]);

export default typeDefs;

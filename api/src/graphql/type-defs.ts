import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as authTypes } from "./auth";
import { typeDefs as cabinTypes } from "./cabins";
import { typeDefs as scalarTypes } from "./scalars";
import { typeDefs as userTypes } from "./users";

export const typeDefs = mergeTypeDefs([userTypes, cabinTypes, scalarTypes, authTypes]);

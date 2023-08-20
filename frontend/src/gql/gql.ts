/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query LoggedInUser {\n    user {\n      id\n      firstName\n    }\n  }\n": types.LoggedInUserDocument,
    "\n  query UserWithId {\n    user {\n      id\n    }\n  }\n": types.UserWithIdDocument,
    "\n  query HasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n": types.HasPermissionDocument,
    "\n  mutation Logout {\n    logout {\n      idToken\n    }\n  }\n": types.LogoutDocument,
    "\n  query Profile {\n    user {\n      id\n      feideEmail\n      email\n      username\n      firstName\n      lastName\n      dateJoined\n      graduationYear\n      gradeYear\n      allergies\n      phoneNumber\n      firstLogin\n    }\n  }\n": types.ProfileDocument,
    "\n  query CabinPermission {\n    hasPermission(permission: \"cabins.manage_booking\")\n  }\n": types.CabinPermissionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LoggedInUser {\n    user {\n      id\n      firstName\n    }\n  }\n"): (typeof documents)["\n  query LoggedInUser {\n    user {\n      id\n      firstName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserWithId {\n    user {\n      id\n    }\n  }\n"): (typeof documents)["\n  query UserWithId {\n    user {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n"): (typeof documents)["\n  query HasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout {\n      idToken\n    }\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout {\n      idToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Profile {\n    user {\n      id\n      feideEmail\n      email\n      username\n      firstName\n      lastName\n      dateJoined\n      graduationYear\n      gradeYear\n      allergies\n      phoneNumber\n      firstLogin\n    }\n  }\n"): (typeof documents)["\n  query Profile {\n    user {\n      id\n      feideEmail\n      email\n      username\n      firstName\n      lastName\n      dateJoined\n      graduationYear\n      gradeYear\n      allergies\n      phoneNumber\n      firstLogin\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CabinPermission {\n    hasPermission(permission: \"cabins.manage_booking\")\n  }\n"): (typeof documents)["\n  query CabinPermission {\n    hasPermission(permission: \"cabins.manage_booking\")\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
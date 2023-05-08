/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

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
  "\n  query LoginRequired {\n    user {\n      id\n    }\n  }\n": types.LoginRequiredDocument,
  "\n  query hasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n":
    types.HasPermissionDocument,
  "\n  mutation SignUp($eventId: ID!, $extraInformation: String) {\n    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n":
    types.SignUpDocument,
  "\n  mutation SignOff($eventId: ID!) {\n    eventSignOff(eventId: $eventId) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n":
    types.SignOffDocument,
  "\n  query ServerTime {\n    serverTime\n  }\n": types.ServerTimeDocument,
  "\n  fragment EventDetailFields on EventType {\n    id\n    title\n    description\n    shortDescription\n    startTime\n    endTime\n    location\n    contactEmail\n    allowedGradeYears\n    hasExtraInformation\n    isFull\n    signupOpenDate\n    deadline\n    isAttendable\n    bindingSignup\n    price\n    product {\n      id\n    }\n    userAttendance {\n      isSignedUp\n      isOnWaitingList\n      positionOnWaitingList\n      hasBoughtTicket\n    }\n    category {\n      id\n      name\n    }\n    organization {\n      id\n      name\n      logoUrl\n    }\n  }\n":
    types.EventDetailFieldsFragmentDoc,
  "\n  query eventUserOrganizations {\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n":
    types.EventUserOrganizationsDocument,
  "\n  query event($id: ID!) {\n    event(id: $id) {\n      ...EventDetailFields\n    }\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n":
    types.EventDocument,
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
export function graphql(
  source: "\n  query LoginRequired {\n    user {\n      id\n    }\n  }\n"
): (typeof documents)["\n  query LoginRequired {\n    user {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query hasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n"
): (typeof documents)["\n  query hasPermission($permission: String!) {\n    hasPermission(permission: $permission)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SignUp($eventId: ID!, $extraInformation: String) {\n    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation SignUp($eventId: ID!, $extraInformation: String) {\n    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SignOff($eventId: ID!) {\n    eventSignOff(eventId: $eventId) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation SignOff($eventId: ID!) {\n    eventSignOff(eventId: $eventId) {\n      event {\n        ...EventDetailFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query ServerTime {\n    serverTime\n  }\n"
): (typeof documents)["\n  query ServerTime {\n    serverTime\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment EventDetailFields on EventType {\n    id\n    title\n    description\n    shortDescription\n    startTime\n    endTime\n    location\n    contactEmail\n    allowedGradeYears\n    hasExtraInformation\n    isFull\n    signupOpenDate\n    deadline\n    isAttendable\n    bindingSignup\n    price\n    product {\n      id\n    }\n    userAttendance {\n      isSignedUp\n      isOnWaitingList\n      positionOnWaitingList\n      hasBoughtTicket\n    }\n    category {\n      id\n      name\n    }\n    organization {\n      id\n      name\n      logoUrl\n    }\n  }\n"
): (typeof documents)["\n  fragment EventDetailFields on EventType {\n    id\n    title\n    description\n    shortDescription\n    startTime\n    endTime\n    location\n    contactEmail\n    allowedGradeYears\n    hasExtraInformation\n    isFull\n    signupOpenDate\n    deadline\n    isAttendable\n    bindingSignup\n    price\n    product {\n      id\n    }\n    userAttendance {\n      isSignedUp\n      isOnWaitingList\n      positionOnWaitingList\n      hasBoughtTicket\n    }\n    category {\n      id\n      name\n    }\n    organization {\n      id\n      name\n      logoUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query eventUserOrganizations {\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  query eventUserOrganizations {\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query event($id: ID!) {\n    event(id: $id) {\n      ...EventDetailFields\n    }\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  query event($id: ID!) {\n    event(id: $id) {\n      ...EventDetailFields\n    }\n    user {\n      id\n      organizations {\n        id\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;

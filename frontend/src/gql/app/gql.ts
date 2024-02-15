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
    "\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    ": types.OrderDocument,
    "\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    ": types.InitiatePaymentAttemptDocument,
    "\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginButtonUserDocument,
    "\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginRequiredUserDocument,
    "\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.HasFeaturePermissionDocument,
    "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    ": types.ProfileOrdersPageDocument,
    "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n          }\n        }\n      }\n    ": types.AppProfileUserDocument,
    "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.AppProfileCabinPermissionDocument,
    "\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    ": types.ReceiptPage_OrderDocument,
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
export function graphql(source: "\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    "): (typeof documents)["\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
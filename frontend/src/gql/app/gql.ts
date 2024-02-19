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
    "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.EventAdminLayout_EventDocument,
    "\n      query OrganizationsAdminPage_EventDetail($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n            }\n          }\n        }\n      }\n\n      fragment OrganizationsAdminPage_SignUpFields on SignUp {\n        id\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    ": types.OrganizationsAdminPage_EventDetailDocument,
    "\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsEventsPageDocument,
    "\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n      }\n    ": types.OrganizationPageLayoutDocument,
    "\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsPageListingsDocument,
    "\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    ": types.AdminOrganizationsPageMembersDocument,
    "\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n          }\n        }\n      }\n    ": types.OrganizationsAdminMembersPage_RemoveMemberDocument,
    "\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    ": types.OrganizationAdminLayout_HasRoleDocument,
    "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    ": types.ProfileOrdersPageDocument,
    "\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.UserOrganizationsPageDocument,
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
export function graphql(source: "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationsAdminPage_EventDetail($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n            }\n          }\n        }\n      }\n\n      fragment OrganizationsAdminPage_SignUpFields on SignUp {\n        id\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationsAdminPage_EventDetail($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminPage_SignUpFields\n                }\n              }\n            }\n          }\n        }\n      }\n\n      fragment OrganizationsAdminPage_SignUpFields on SignUp {\n        id\n        user {\n          id\n          firstName\n          lastName\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
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
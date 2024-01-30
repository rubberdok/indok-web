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
    "\n      query CabinsBookNow {\n        cabins {\n          cabins {\n            id\n            name\n            internalPrice\n            externalPrice\n          }\n        }\n      }\n    ": types.CabinsBookNowDocument,
    "\n      query BookingContact {\n        bookingContact {\n          bookingContact {\n            id\n            name\n            email\n          }\n        }\n      }\n    ": types.BookingContactDocument,
    "\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            ...EventFragment\n          }\n          thisWeek {\n            ...EventFragment\n          }\n          twoWeeksOrLater {\n            ...EventFragment\n          }\n        }\n        user {\n          user {\n            id\n            gradeYear\n          }\n        }\n      }\n\n      fragment EventFragment on Event {\n        id\n        name\n        description\n        categories {\n          id\n          name\n        }\n        startAt\n        endAt\n        signUpsEnabled\n        signUpAvailability\n      }\n    ": types.EventsPageDocument,
    "\n      query CategoryFilterCategories {\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    ": types.CategoryFilterCategoriesDocument,
    "\n      query EventOrganizationFilter {\n        events(data: { futureEventsOnly: true }) {\n          events {\n            id\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.EventOrganizationFilterDocument,
    "\n      query Listings {\n        listings {\n          listings {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.ListingsDocument,
    "\n      query UserFormUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    ": types.UserFormUserDocument,
    "\n      mutation UserFormUpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    ": types.UserFormUpdateUserDocument,
    "\n      query LoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.LoginButtonUserDocument,
    "\n  query ListingsPage($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        name\n        description\n        applicationUrl\n        closesAt\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.ListingsPageDocument,
    "\n      query OrganizationPageUser {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.OrganizationPageUserDocument,
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
export function graphql(source: "\n      query CabinsBookNow {\n        cabins {\n          cabins {\n            id\n            name\n            internalPrice\n            externalPrice\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CabinsBookNow {\n        cabins {\n          cabins {\n            id\n            name\n            internalPrice\n            externalPrice\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query BookingContact {\n        bookingContact {\n          bookingContact {\n            id\n            name\n            email\n          }\n        }\n      }\n    "): (typeof documents)["\n      query BookingContact {\n        bookingContact {\n          bookingContact {\n            id\n            name\n            email\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            ...EventFragment\n          }\n          thisWeek {\n            ...EventFragment\n          }\n          twoWeeksOrLater {\n            ...EventFragment\n          }\n        }\n        user {\n          user {\n            id\n            gradeYear\n          }\n        }\n      }\n\n      fragment EventFragment on Event {\n        id\n        name\n        description\n        categories {\n          id\n          name\n        }\n        startAt\n        endAt\n        signUpsEnabled\n        signUpAvailability\n      }\n    "): (typeof documents)["\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            ...EventFragment\n          }\n          thisWeek {\n            ...EventFragment\n          }\n          twoWeeksOrLater {\n            ...EventFragment\n          }\n        }\n        user {\n          user {\n            id\n            gradeYear\n          }\n        }\n      }\n\n      fragment EventFragment on Event {\n        id\n        name\n        description\n        categories {\n          id\n          name\n        }\n        startAt\n        endAt\n        signUpsEnabled\n        signUpAvailability\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CategoryFilterCategories {\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CategoryFilterCategories {\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventOrganizationFilter {\n        events(data: { futureEventsOnly: true }) {\n          events {\n            id\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EventOrganizationFilter {\n        events(data: { futureEventsOnly: true }) {\n          events {\n            id\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Listings {\n        listings {\n          listings {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Listings {\n        listings {\n          listings {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query UserFormUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    "): (typeof documents)["\n      query UserFormUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation UserFormUpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation UserFormUpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            firstName\n            lastName\n            graduationYearUpdatedAt\n            canUpdateYear\n            gradeYear\n            graduationYear\n            allergies\n            phoneNumber\n            email\n            isSuperUser\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query LoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "): (typeof documents)["\n      query LoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingsPage($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        name\n        description\n        applicationUrl\n        closesAt\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingsPage($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        name\n        description\n        applicationUrl\n        closesAt\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationPageUser {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationPageUser {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
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
    "\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n": types.BookNow_QueryFragmentDoc,
    "\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n": types.CabinsInfoSection_QueryFragmentDoc,
    "\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n": types.ContactCabinBoard_QueryFragmentDoc,
    "\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    ": types.BookingDetails_TotalCostDocument,
    "\n  fragment Contract_Query on Query {\n    bookingContact {\n      bookingContact {\n        name\n        email\n        phoneNumber\n        id\n      }\n    }\n  }\n": types.Contract_QueryFragmentDoc,
    "\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n": types.PickDates_CabinFragmentDoc,
    "\n      query CabinsBookPage {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...Contract_Query\n      }\n    ": types.CabinsBookPageDocument,
    "\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    ": types.CabinsBookPageTotalCostDocument,
    "\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    ": types.CabinsBookPageCreateBookingDocument,
    "\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    ": types.CabinsPageDocument,
    "\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    ": types.OrderDocument,
    "\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    ": types.InitiatePaymentAttemptDocument,
    "\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginButtonUserDocument,
    "\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginRequiredUserDocument,
    "\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.HasFeaturePermissionDocument,
    "\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n  }\n": types.ListingItem_ListingFragmentDoc,
    "\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.Listings_QueryFragmentDoc,
    "\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    ": types.ListingsPage_QueryDocument,
    "\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n": types.ListingPage_QueryDocument,
    "\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n": types.TitleCard_ListingFragmentDoc,
    "\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.ListingLayout_QueryDocument,
    "\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    ": types.ListingMetadataDocument,
    "\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.NewListing_QueryDocument,
    "\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    ": types.NewListing_CreateListingMutationDocument,
    "\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminEventsAboutPage_EventQueryDocument,
    "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.EventAdminLayout_EventDocument,
    "\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n": types.OrganizationsAdminEventsSignUpsPage_SignUpFragmentDoc,
    "\n      query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            type\n            signUpsRequireUserProvidedInformation\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminEventsSignUpsPage_EventQueryDocument,
    "\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsEventsPageDocument,
    "\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n      }\n    ": types.OrganizationPageLayoutDocument,
    "\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsPageListingsDocument,
    "\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    ": types.AdminOrganizationsPageMembersDocument,
    "\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n          }\n        }\n      }\n    ": types.OrganizationsAdminMembersPage_RemoveMemberDocument,
    "\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    ": types.OrganizationAdminLayout_HasRoleDocument,
    "\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n": types.UserForm_UserFragmentDoc,
    "\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n": types.ProfileEditPage_UserDocument,
    "\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    ": types.ProfileEditPage_UpdateUserDocument,
    "\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n": types.OrderStatus_SignUpFragmentDoc,
    "\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n": types.ParticipationStatus_SignUpFragmentDoc,
    "\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    ": types.ProfileEventsPageDocument,
    "\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    ": types.ProfileLayout_UserQueryDocument,
    "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    ": types.ProfileOrdersPageDocument,
    "\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.UserOrganizationsPageDocument,
    "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.AppProfileUserDocument,
    "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.AppProfileCabinPermissionDocument,
    "\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            capturedPaymentAttempt {\n              id\n              state\n              reference\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    ": types.ReceiptPage_OrderDocument,
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
export function graphql(source: "\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n"): (typeof documents)["\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "): (typeof documents)["\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Contract_Query on Query {\n    bookingContact {\n      bookingContact {\n        name\n        email\n        phoneNumber\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment Contract_Query on Query {\n    bookingContact {\n      bookingContact {\n        name\n        email\n        phoneNumber\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsBookPage {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...Contract_Query\n      }\n    "): (typeof documents)["\n      query CabinsBookPage {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...Contract_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "): (typeof documents)["\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    "): (typeof documents)["\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    "];
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
export function graphql(source: "\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n  }\n"): (typeof documents)["\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    "): (typeof documents)["\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            type\n            signUpsRequireUserProvidedInformation\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            type\n            signUpsRequireUserProvidedInformation\n            signUps {\n              confirmed {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              waitList {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n              retracted {\n                total\n                signUps {\n                  ...OrganizationsAdminEventsSignUpsPage_SignUp\n                }\n              }\n            }\n          }\n        }\n      }\n    "];
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
export function graphql(source: "\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n"): (typeof documents)["\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "];
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
export function graphql(source: "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            capturedPaymentAttempt {\n              id\n              state\n              reference\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n        order(data: $data) {\n          order {\n            id\n            isFinalState\n            purchasedAt\n            product {\n              id\n              name\n            }\n            paymentAttempt(reference: $reference) {\n              id\n              state\n              reference\n              isFinalState\n            }\n            capturedPaymentAttempt {\n              id\n              state\n              reference\n            }\n            paymentStatus\n            totalPrice {\n              value\n              unit\n              valueInNok\n            }\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
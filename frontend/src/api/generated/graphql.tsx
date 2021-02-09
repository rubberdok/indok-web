import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
};

export type Query = {
  __typename?: "Query";
  allOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  organization?: Maybe<OrganizationType>;
  eventFilteredOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  allUsers?: Maybe<Array<Maybe<UserType>>>;
  user?: Maybe<UserType>;
  allEvents?: Maybe<Array<Maybe<EventType>>>;
  event?: Maybe<EventType>;
  allCategories?: Maybe<Array<Maybe<CategoryType>>>;
  category?: Maybe<CategoryType>;
};

export type QueryAllOrganizationsArgs = {
  search?: Maybe<Scalars["String"]>;
};

export type QueryOrganizationArgs = {
  id: Scalars["ID"];
};

export type QueryAllEventsArgs = {
  category?: Maybe<Scalars["String"]>;
  organization?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
};

export type QueryEventArgs = {
  id: Scalars["ID"];
};

export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

export type OrganizationType = {
  __typename?: "OrganizationType";
  id: Scalars["ID"];
  name: Scalars["String"];
  slug: Scalars["String"];
  description: Scalars["String"];
  parent?: Maybe<OrganizationType>;
  children: Array<OrganizationType>;
};

export type UserType = {
  __typename?: "UserType";
  id: Scalars["ID"];
  password: Scalars["String"];
  lastLogin?: Maybe<Scalars["DateTime"]>;
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars["Boolean"];
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars["Boolean"];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars["Boolean"];
  dateJoined: Scalars["DateTime"];
  year?: Maybe<Scalars["Int"]>;
  feideUserid: Scalars["String"];
};

export type EventType = {
  __typename?: "EventType";
  id: Scalars["ID"];
  title: Scalars["String"];
  description: Scalars["String"];
  startTime: Scalars["DateTime"];
  isAttendable: Scalars["Boolean"];
  publisher: Scalars["String"];
  endTime?: Maybe<Scalars["DateTime"]>;
  location?: Maybe<Scalars["String"]>;
  organization?: Maybe<OrganizationType>;
  category?: Maybe<CategoryType>;
  image?: Maybe<Scalars["String"]>;
  deadline?: Maybe<Scalars["DateTime"]>;
};

export type CategoryType = {
  __typename?: "CategoryType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Mutations = {
  __typename?: "Mutations";
  createOrganization?: Maybe<CreateOrganization>;
  updateOrganization?: Maybe<UpdateOrganization>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  authUser?: Maybe<AuthUser>;
  updateUser?: Maybe<UpdateUser>;
  verifyToken?: Maybe<Verify>;
  refreshToken?: Maybe<Refresh>;
  deleteTokenCookie?: Maybe<DeleteJsonWebTokenCookie>;
  createEvent?: Maybe<CreateEvent>;
  updateEvent?: Maybe<UpdateEvent>;
  deleteEvent?: Maybe<DeleteEvent>;
  createCategory?: Maybe<CreateCategory>;
  updateCategory?: Maybe<UpdateCategory>;
  deleteCategory?: Maybe<DeleteCategory>;
};

export type MutationsCreateOrganizationArgs = {
  organizationData: OrganizationInput;
};

export type MutationsUpdateOrganizationArgs = {
  id: Scalars["ID"];
  organizationData?: Maybe<OrganizationInput>;
};

export type MutationsDeleteOrganizationArgs = {
  id: Scalars["ID"];
};

export type MutationsAuthUserArgs = {
  code?: Maybe<Scalars["String"]>;
};

export type MutationsUpdateUserArgs = {
  email?: Maybe<Scalars["String"]>;
  feideUserid?: Maybe<Scalars["ID"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  year?: Maybe<Scalars["String"]>;
};

export type MutationsVerifyTokenArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationsRefreshTokenArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationsCreateEventArgs = {
  eventData: EventInput;
};

export type MutationsUpdateEventArgs = {
  eventData?: Maybe<EventInput>;
  id: Scalars["ID"];
};

export type MutationsDeleteEventArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type MutationsCreateCategoryArgs = {
  categoryData: CategoryInput;
};

export type MutationsUpdateCategoryArgs = {
  categoryData?: Maybe<CategoryInput>;
  id: Scalars["ID"];
};

export type MutationsDeleteCategoryArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type CreateOrganization = {
  __typename?: "CreateOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type OrganizationInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  parentId?: Maybe<Scalars["ID"]>;
};

export type UpdateOrganization = {
  __typename?: "UpdateOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteOrganization = {
  __typename?: "DeleteOrganization";
  organization?: Maybe<OrganizationType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AuthUser = {
  __typename?: "AuthUser";
  token: Scalars["String"];
  user?: Maybe<UserType>;
};

export type UpdateUser = {
  __typename?: "UpdateUser";
  ok?: Maybe<Scalars["Boolean"]>;
  user?: Maybe<UserType>;
};

export type Verify = {
  __typename?: "Verify";
  payload: Scalars["GenericScalar"];
};

export type Refresh = {
  __typename?: "Refresh";
  payload: Scalars["GenericScalar"];
  refreshExpiresIn: Scalars["Int"];
  token: Scalars["String"];
};

export type DeleteJsonWebTokenCookie = {
  __typename?: "DeleteJSONWebTokenCookie";
  deleted: Scalars["Boolean"];
};

export type CreateEvent = {
  __typename?: "CreateEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type EventInput = {
  title?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  location?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  categoryId?: Maybe<Scalars["ID"]>;
  image?: Maybe<Scalars["String"]>;
  isAttendable?: Maybe<Scalars["Boolean"]>;
  deadline?: Maybe<Scalars["DateTime"]>;
  publisher?: Maybe<Scalars["String"]>;
};

export type UpdateEvent = {
  __typename?: "UpdateEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type DeleteEvent = {
  __typename?: "DeleteEvent";
  ok?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<EventType>;
};

export type CreateCategory = {
  __typename?: "CreateCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type CategoryInput = {
  name?: Maybe<Scalars["String"]>;
};

export type UpdateCategory = {
  __typename?: "UpdateCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type DeleteCategory = {
  __typename?: "DeleteCategory";
  ok?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<CategoryType>;
};

export type AllEventCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type AllEventCategoriesQuery = { __typename?: "Query" } & {
  allCategories?: Maybe<Array<Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>>>;
};

export type EventCategoryFragment = { __typename?: "CategoryType" } & Pick<CategoryType, "id" | "name">;

export type EventCategoryQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventCategoryQuery = { __typename?: "Query" } & {
  category?: Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>;
};

export type AllEventsQueryVariables = Exact<{
  organization?: Maybe<Scalars["String"]>;
  category?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
}>;

export type AllEventsQuery = { __typename?: "Query" } & {
  allEvents?: Maybe<Array<Maybe<{ __typename?: "EventType" } & EventFragment>>>;
};

export type EventFragment = { __typename?: "EventType" } & Pick<
  EventType,
  | "id"
  | "title"
  | "startTime"
  | "endTime"
  | "location"
  | "description"
  | "image"
  | "isAttendable"
  | "deadline"
  | "publisher"
> & {
    organization?: Maybe<{ __typename?: "OrganizationType" } & OrganizationFragment>;
    category?: Maybe<{ __typename?: "CategoryType" } & EventCategoryFragment>;
  };

export type EventQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventQuery = { __typename?: "Query" } & { event?: Maybe<{ __typename?: "EventType" } & EventFragment> };

export type EventFilteredOrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type EventFilteredOrganizationsQuery = { __typename?: "Query" } & {
  eventFilteredOrganizations?: Maybe<
    Array<
      Maybe<
        { __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name"> & {
            children: Array<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
          }
      >
    >
  >;
};

export type OrganizationFragment = { __typename?: "OrganizationType" } & Pick<
  OrganizationType,
  "id" | "name" | "slug" | "description"
> & {
    parent?: Maybe<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
    children: Array<{ __typename?: "OrganizationType" } & Pick<OrganizationType, "id" | "name">>;
  };

export type AuthUserMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AuthUserMutation = { __typename?: "Mutations" } & {
  authUser?: Maybe<
    { __typename?: "AuthUser" } & Pick<AuthUser, "token"> & { user?: Maybe<{ __typename?: "UserType" } & UserFragment> }
  >;
};

export type DeleteTokenCookieMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteTokenCookieMutation = { __typename?: "Mutations" } & {
  deleteTokenCookie?: Maybe<{ __typename?: "DeleteJSONWebTokenCookie" } & Pick<DeleteJsonWebTokenCookie, "deleted">>;
};

export type UserFragment = { __typename?: "UserType" } & Pick<
  UserType,
  | "id"
  | "username"
  | "isStaff"
  | "isActive"
  | "isSuperuser"
  | "email"
  | "firstName"
  | "lastName"
  | "feideUserid"
  | "lastLogin"
  | "dateJoined"
  | "year"
>;

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = { __typename?: "Query" } & { user?: Maybe<{ __typename?: "UserType" } & UserFragment> };

export const OrganizationFragmentDoc = gql`
  fragment organization on OrganizationType {
    id
    name
    slug
    description
    parent {
      id
      name
    }
    children {
      id
      name
    }
  }
`;
export const EventCategoryFragmentDoc = gql`
  fragment eventCategory on CategoryType {
    id
    name
  }
`;
export const EventFragmentDoc = gql`
  fragment event on EventType {
    id
    title
    startTime
    endTime
    location
    description
    organization {
      ...organization
    }
    category {
      ...eventCategory
    }
    image
    isAttendable
    deadline
    publisher
  }
  ${OrganizationFragmentDoc}
  ${EventCategoryFragmentDoc}
`;
export const UserFragmentDoc = gql`
  fragment user on UserType {
    id
    username
    isStaff
    isActive
    isSuperuser
    email
    firstName
    lastName
    feideUserid
    lastLogin
    dateJoined
    year
  }
`;
export const AllEventCategoriesDocument = gql`
  query allEventCategories {
    allCategories {
      ...eventCategory
    }
  }
  ${EventCategoryFragmentDoc}
`;

/**
 * __useAllEventCategoriesQuery__
 *
 * To run a query within a React component, call `useAllEventCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEventCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEventCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllEventCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>
) {
  return Apollo.useQuery<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>(
    AllEventCategoriesDocument,
    baseOptions
  );
}
export function useAllEventCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>
) {
  return Apollo.useLazyQuery<AllEventCategoriesQuery, AllEventCategoriesQueryVariables>(
    AllEventCategoriesDocument,
    baseOptions
  );
}
export type AllEventCategoriesQueryHookResult = ReturnType<typeof useAllEventCategoriesQuery>;
export type AllEventCategoriesLazyQueryHookResult = ReturnType<typeof useAllEventCategoriesLazyQuery>;
export type AllEventCategoriesQueryResult = Apollo.QueryResult<
  AllEventCategoriesQuery,
  AllEventCategoriesQueryVariables
>;
export const EventCategoryDocument = gql`
  query EventCategory($id: ID!) {
    category(id: $id) {
      ...eventCategory
    }
  }
  ${EventCategoryFragmentDoc}
`;

/**
 * __useEventCategoryQuery__
 *
 * To run a query within a React component, call `useEventCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventCategoryQuery(
  baseOptions: Apollo.QueryHookOptions<EventCategoryQuery, EventCategoryQueryVariables>
) {
  return Apollo.useQuery<EventCategoryQuery, EventCategoryQueryVariables>(EventCategoryDocument, baseOptions);
}
export function useEventCategoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventCategoryQuery, EventCategoryQueryVariables>
) {
  return Apollo.useLazyQuery<EventCategoryQuery, EventCategoryQueryVariables>(EventCategoryDocument, baseOptions);
}
export type EventCategoryQueryHookResult = ReturnType<typeof useEventCategoryQuery>;
export type EventCategoryLazyQueryHookResult = ReturnType<typeof useEventCategoryLazyQuery>;
export type EventCategoryQueryResult = Apollo.QueryResult<EventCategoryQuery, EventCategoryQueryVariables>;
export const AllEventsDocument = gql`
  query AllEvents($organization: String, $category: String, $startTime: DateTime, $endTime: DateTime) {
    allEvents(organization: $organization, category: $category, startTime: $startTime, endTime: $endTime) {
      ...event
    }
  }
  ${EventFragmentDoc}
`;

/**
 * __useAllEventsQuery__
 *
 * To run a query within a React component, call `useAllEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEventsQuery({
 *   variables: {
 *      organization: // value for 'organization'
 *      category: // value for 'category'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *   },
 * });
 */
export function useAllEventsQuery(baseOptions?: Apollo.QueryHookOptions<AllEventsQuery, AllEventsQueryVariables>) {
  return Apollo.useQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, baseOptions);
}
export function useAllEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllEventsQuery, AllEventsQueryVariables>
) {
  return Apollo.useLazyQuery<AllEventsQuery, AllEventsQueryVariables>(AllEventsDocument, baseOptions);
}
export type AllEventsQueryHookResult = ReturnType<typeof useAllEventsQuery>;
export type AllEventsLazyQueryHookResult = ReturnType<typeof useAllEventsLazyQuery>;
export type AllEventsQueryResult = Apollo.QueryResult<AllEventsQuery, AllEventsQueryVariables>;
export const EventDocument = gql`
  query Event($id: ID!) {
    event(id: $id) {
      ...event
    }
  }
  ${EventFragmentDoc}
`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
  return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, baseOptions);
}
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
  return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, baseOptions);
}
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const EventFilteredOrganizationsDocument = gql`
  query eventFilteredOrganizations {
    eventFilteredOrganizations {
      id
      name
      children {
        id
        name
      }
    }
  }
`;

/**
 * __useEventFilteredOrganizationsQuery__
 *
 * To run a query within a React component, call `useEventFilteredOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventFilteredOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventFilteredOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventFilteredOrganizationsQuery(
  baseOptions?: Apollo.QueryHookOptions<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>
) {
  return Apollo.useQuery<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>(
    EventFilteredOrganizationsDocument,
    baseOptions
  );
}
export function useEventFilteredOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>
) {
  return Apollo.useLazyQuery<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>(
    EventFilteredOrganizationsDocument,
    baseOptions
  );
}
export type EventFilteredOrganizationsQueryHookResult = ReturnType<typeof useEventFilteredOrganizationsQuery>;
export type EventFilteredOrganizationsLazyQueryHookResult = ReturnType<typeof useEventFilteredOrganizationsLazyQuery>;
export type EventFilteredOrganizationsQueryResult = Apollo.QueryResult<
  EventFilteredOrganizationsQuery,
  EventFilteredOrganizationsQueryVariables
>;
export const AuthUserDocument = gql`
  mutation AuthUser($code: String!) {
    authUser(code: $code) {
      token
      user {
        ...user
      }
    }
  }
  ${UserFragmentDoc}
`;
export type AuthUserMutationFn = Apollo.MutationFunction<AuthUserMutation, AuthUserMutationVariables>;

/**
 * __useAuthUserMutation__
 *
 * To run a mutation, you first call `useAuthUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authUserMutation, { data, loading, error }] = useAuthUserMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useAuthUserMutation(
  baseOptions?: Apollo.MutationHookOptions<AuthUserMutation, AuthUserMutationVariables>
) {
  return Apollo.useMutation<AuthUserMutation, AuthUserMutationVariables>(AuthUserDocument, baseOptions);
}
export type AuthUserMutationHookResult = ReturnType<typeof useAuthUserMutation>;
export type AuthUserMutationResult = Apollo.MutationResult<AuthUserMutation>;
export type AuthUserMutationOptions = Apollo.BaseMutationOptions<AuthUserMutation, AuthUserMutationVariables>;
export const DeleteTokenCookieDocument = gql`
  mutation DeleteTokenCookie {
    deleteTokenCookie {
      deleted
    }
  }
`;
export type DeleteTokenCookieMutationFn = Apollo.MutationFunction<
  DeleteTokenCookieMutation,
  DeleteTokenCookieMutationVariables
>;

/**
 * __useDeleteTokenCookieMutation__
 *
 * To run a mutation, you first call `useDeleteTokenCookieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTokenCookieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTokenCookieMutation, { data, loading, error }] = useDeleteTokenCookieMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteTokenCookieMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTokenCookieMutation, DeleteTokenCookieMutationVariables>
) {
  return Apollo.useMutation<DeleteTokenCookieMutation, DeleteTokenCookieMutationVariables>(
    DeleteTokenCookieDocument,
    baseOptions
  );
}
export type DeleteTokenCookieMutationHookResult = ReturnType<typeof useDeleteTokenCookieMutation>;
export type DeleteTokenCookieMutationResult = Apollo.MutationResult<DeleteTokenCookieMutation>;
export type DeleteTokenCookieMutationOptions = Apollo.BaseMutationOptions<
  DeleteTokenCookieMutation,
  DeleteTokenCookieMutationVariables
>;
export const GetUserDocument = gql`
  query GetUser {
    user {
      ...user
    }
  }
  ${UserFragmentDoc}
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
}
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: string;
};

export type Booking = {
  __typename?: "Booking";
  cabin: Cabin;
  email: Scalars["String"];
  endDate: Scalars["DateTime"];
  firstName: Scalars["String"];
  id: Scalars["ID"];
  lastName: Scalars["String"];
  phoneNumber: Scalars["String"];
  startDate: Scalars["DateTime"];
  status: Status;
};

export type Cabin = {
  __typename?: "Cabin";
  externalPrice: Scalars["String"];
  id: Scalars["ID"];
  internalPrice: Scalars["String"];
  name: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  authenticate: User;
  createUser?: Maybe<User>;
  logout: Scalars["Boolean"];
  newBooking: Booking;
  redirectUrl: Scalars["String"];
  updateBookingStatus: Booking;
  updateUser: User;
};

export type MutationAuthenticateArgs = {
  code: Scalars["String"];
};

export type MutationCreateUserArgs = {
  firstName: Scalars["String"];
};

export type MutationNewBookingArgs = {
  data: NewBookingInput;
};

export type MutationRedirectUrlArgs = {
  state?: InputMaybe<Scalars["String"]>;
};

export type MutationUpdateBookingStatusArgs = {
  id: Scalars["ID"];
  status: Status;
};

export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars["ID"];
};

export type NewBookingInput = {
  cabinId: Scalars["ID"];
  email: Scalars["String"];
  endDate: Scalars["DateTime"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  phoneNumber: Scalars["String"];
  startDate: Scalars["DateTime"];
};

export type Permission = {
  __typename?: "Permission";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  hasPermission: Scalars["Boolean"];
  user?: Maybe<User>;
  users: Array<User>;
};

export type QueryHasPermissionArgs = {
  permission: Scalars["String"];
};

export enum Status {
  Cancelled = "CANCELLED",
  Confirmed = "CONFIRMED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export type UpdateUserInput = {
  allergies?: InputMaybe<Scalars["String"]>;
  firstName: Scalars["String"];
  graduationYear?: InputMaybe<Scalars["Int"]>;
  lastName: Scalars["String"];
  phoneNumber?: InputMaybe<Scalars["String"]>;
};

export type User = {
  __typename?: "User";
  allergies?: Maybe<Scalars["String"]>;
  canUpdateYear: Scalars["Boolean"];
  createdAt: Scalars["String"];
  firstLogin: Scalars["Boolean"];
  firstName: Scalars["String"];
  graduationYear?: Maybe<Scalars["Int"]>;
  graduationYearUpdatedAt?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  lastName: Scalars["String"];
  permissions: Array<Permission>;
  phoneNumber?: Maybe<Scalars["String"]>;
  username: Scalars["String"];
};

export type RedirectUrlMutationVariables = Exact<{
  state?: InputMaybe<Scalars["String"]>;
}>;

export type RedirectUrlMutation = { __typename?: "Mutation"; redirectUrl: string };

export type AuthenticateMutationVariables = Exact<{
  code: Scalars["String"];
}>;

export type AuthenticateMutation = {
  __typename?: "Mutation";
  authenticate: {
    __typename?: "User";
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    firstLogin: boolean;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type HasPermissionQueryVariables = Exact<{
  permission: Scalars["String"];
}>;

export type HasPermissionQuery = { __typename?: "Query"; hasPermission: boolean };

export type BaseUserFieldsFragment = {
  __typename?: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  firstLogin: boolean;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["ID"];
  data: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser: {
    __typename?: "User";
    canUpdateYear: boolean;
    graduationYear?: number | null;
    graduationYearUpdatedAt?: string | null;
    allergies?: string | null;
    phoneNumber?: string | null;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    firstLogin: boolean;
  };
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    firstLogin: boolean;
  } | null;
};

export type EditUserQueryVariables = Exact<{ [key: string]: never }>;

export type EditUserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    canUpdateYear: boolean;
    graduationYear?: number | null;
    graduationYearUpdatedAt?: string | null;
    allergies?: string | null;
    phoneNumber?: string | null;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    firstLogin: boolean;
  } | null;
};

export const BaseUserFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "BaseUserFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "User" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "username" } },
          { kind: "Field", name: { kind: "Name", value: "firstName" } },
          { kind: "Field", name: { kind: "Name", value: "lastName" } },
          { kind: "Field", name: { kind: "Name", value: "firstLogin" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BaseUserFieldsFragment, unknown>;
export const RedirectUrlDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RedirectUrl" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "state" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "redirectUrl" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "state" },
                value: { kind: "Variable", name: { kind: "Name", value: "state" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RedirectUrlMutation, RedirectUrlMutationVariables>;
export const AuthenticateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Authenticate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "code" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "authenticate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "code" },
                value: { kind: "Variable", name: { kind: "Name", value: "code" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseUserFields" } }],
            },
          },
        ],
      },
    },
    ...BaseUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const LogoutDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Logout" },
      selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "logout" } }] },
    },
  ],
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const HasPermissionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HasPermission" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "permission" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hasPermission" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "permission" },
                value: { kind: "Variable", name: { kind: "Name", value: "permission" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const UpdateUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateUser" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "data" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "UpdateUserInput" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateUser" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "data" },
                value: { kind: "Variable", name: { kind: "Name", value: "data" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "FragmentSpread", name: { kind: "Name", value: "BaseUserFields" } },
                { kind: "Field", name: { kind: "Name", value: "canUpdateYear" } },
                { kind: "Field", name: { kind: "Name", value: "graduationYear" } },
                { kind: "Field", name: { kind: "Name", value: "graduationYearUpdatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "allergies" } },
                { kind: "Field", name: { kind: "Name", value: "phoneNumber" } },
              ],
            },
          },
        ],
      },
    },
    ...BaseUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "User" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseUserFields" } }],
            },
          },
        ],
      },
    },
    ...BaseUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const EditUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "FragmentSpread", name: { kind: "Name", value: "BaseUserFields" } },
                { kind: "Field", name: { kind: "Name", value: "canUpdateYear" } },
                { kind: "Field", name: { kind: "Name", value: "graduationYear" } },
                { kind: "Field", name: { kind: "Name", value: "graduationYearUpdatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "allergies" } },
                { kind: "Field", name: { kind: "Name", value: "phoneNumber" } },
              ],
            },
          },
        ],
      },
    },
    ...BaseUserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<EditUserQuery, EditUserQueryVariables>;

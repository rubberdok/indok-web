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
  DateTime: any;
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
  user?: Maybe<User>;
  users: Array<User>;
};

export enum Status {
  Cancelled = "CANCELLED",
  Confirmed = "CONFIRMED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export type User = {
  __typename?: "User";
  createdAt: Scalars["String"];
  firstLogin: Scalars["Boolean"];
  firstName: Scalars["String"];
  id: Scalars["ID"];
  lastName: Scalars["String"];
  permissions: Array<Permission>;
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

export type UserFieldsFragment = {
  __typename?: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  firstLogin: boolean;
};

export const UserFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "UserFields" },
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
} as unknown as DocumentNode<UserFieldsFragment, unknown>;
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
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
            },
          },
        ],
      },
    },
    ...UserFieldsFragmentDoc.definitions,
  ],
} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;

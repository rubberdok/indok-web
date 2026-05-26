/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type LoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserQuery = { user: { id: string, firstName: string } | null };

export type UserWithIdQueryVariables = Exact<{ [key: string]: never; }>;


export type UserWithIdQuery = { user: { id: string } | null };

export type HasPermissionQueryVariables = Exact<{
  permission: string;
}>;


export type HasPermissionQuery = { hasPermission: boolean | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { idToken: string | null } | null };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { user: { id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear: number | null, gradeYear: number | null, allergies: string | null, phoneNumber: string, firstLogin: boolean } | null };

export type CabinPermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinPermissionQuery = { hasPermission: boolean | null };

export type JanHusPermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusPermissionQuery = { hasPermission: boolean | null };

export type ProfileAdminEditCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileAdminEditCapabilitiesQuery = { canManageUserProfiles: boolean, canManageUserNfc: boolean };


export const LoggedInUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoggedInUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]} as unknown as DocumentNode<LoggedInUserQuery, LoggedInUserQueryVariables>;
export const UserWithIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserWithId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserWithIdQuery, UserWithIdQueryVariables>;
export const HasPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}]}}]} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idToken"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const ProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]}}]} as unknown as DocumentNode<ProfileQuery, ProfileQueryVariables>;
export const CabinPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"cabins.manage_booking","block":false}}]}]}}]} as unknown as DocumentNode<CabinPermissionQuery, CabinPermissionQueryVariables>;
export const JanHusPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"janhus.manage_booking","block":false}}]}]}}]} as unknown as DocumentNode<JanHusPermissionQuery, JanHusPermissionQueryVariables>;
export const ProfileAdminEditCapabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileAdminEditCapabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canManageUserProfiles"}},{"kind":"Field","name":{"kind":"Name","value":"canManageUserNfc"}}]}}]} as unknown as DocumentNode<ProfileAdminEditCapabilitiesQuery, ProfileAdminEditCapabilitiesQueryVariables>;
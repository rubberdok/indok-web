/** Utility type for getting the type of a generated GraphQL type without the `__typename` property. */
export type GraphqlType<T extends { __typename?: any }> = Omit<T, "__typename">;

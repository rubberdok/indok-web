export type GraphqlType<T extends { __typename?: any }> = Omit<T, "__typename">;

import { GraphQLFormattedError } from "graphql";
import { codes, PermissionDeniedError } from "../services/permissions/errors";

export const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  if (error instanceof PermissionDeniedError) {
    return {
      ...formattedError,
      message: "You do not have permissions to perform this action",
      extensions: {
        code: codes.PERMISSION_DENIED,
      },
    };
  }

  return formattedError;
};

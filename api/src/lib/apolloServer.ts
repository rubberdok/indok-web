import { GraphQLFormattedError } from "graphql";
import { ZodError } from "zod";
import { codes, ValidationError } from "../core/errors";
import { PermissionDeniedError } from "../services/permissions/errors";

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

  if (error instanceof ValidationError || error instanceof ZodError) {
    return {
      ...formattedError,
      message: error.message,
      extensions: {
        code: codes.BAD_USER_INPUT,
      },
    };
  }

  console.error(error);
  return formattedError;
};

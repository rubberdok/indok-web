const codes = {
  PERMISSION_DENIED: "PERMISSION_DENIED",
} as const;

class PermissionDeniedError implements Error {
  name: string = "PermissionError";
  message: string = codes.PERMISSION_DENIED;
  stack?: string;
  cause?: Error;
}

export { codes, PermissionDeniedError };

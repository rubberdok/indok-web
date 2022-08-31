export class ValidationError implements Error {
  constructor(public message: string) {}

  extensions: { code: string } = { code: codes.BAD_USER_INPUT };
  name = "ValidationError"
  
  stack?: string;
  cause?: Error;
}

export const codes = {
  BAD_USER_INPUT: "BAD_USER_INPUT",
  PERMISSION_DENIED: "PERMISSION_DENIED",
}
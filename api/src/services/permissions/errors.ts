import { codes } from "@/core/errors";

class PermissionDeniedError implements Error {
  constructor(public message: string = "You do not have permission to perform that action.") {}
  
  name: string = "PermissionError";
  extensions: { code: string } = { code: codes.PERMISSION_DENIED };
  
  stack?: string;
  cause?: Error;
}

export { PermissionDeniedError };

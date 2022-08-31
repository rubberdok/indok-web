import { codes } from "../../core/errors";

class PermissionDeniedError implements Error {
  constructor(public message: string) {}
  
  name: string = "PermissionError";
  extensions: { code: string } = { code: codes.PERMISSION_DENIED };
  
  stack?: string;
  cause?: Error;
}

export { PermissionDeniedError };

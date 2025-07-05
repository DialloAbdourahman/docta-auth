import { CustomError } from "./CustomError";
import { EnumStatusCode } from "../enums/status-codes";
import { ErrorResult } from "../utils/orchestration-result";

export class UnAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(
    code: EnumStatusCode = EnumStatusCode.UNAUTHORIZED,
    message: string = "Unauthorized"
  ) {
    super(message, code, 401);
  }

  serializeErrors(): ErrorResult {
    return { code: this.code, message: this.message };
  }
}

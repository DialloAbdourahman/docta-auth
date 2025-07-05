import { CustomError } from "./CustomError";
import { EnumStatusCode } from "../enums/status-codes";
import { ErrorResult } from "../utils/orchestration-result";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(
    code: EnumStatusCode = EnumStatusCode.NOT_FOUND,
    message: string = "Not Found"
  ) {
    super(message, code, 404);
  }

  serializeErrors(): ErrorResult {
    return { code: this.code, message: this.message };
  }
}

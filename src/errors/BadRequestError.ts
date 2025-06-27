import { CustomError } from "./CustomError";
import { EnumStatusCode } from "../enums/status-codes";
import { ErrorResult } from "../utils/orchestration-result";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(
    code: EnumStatusCode = EnumStatusCode.BAD_REQUEST,
    message: string = "Bad Request"
  ) {
    super(message, code, 400);
  }

  serializeErrors(): ErrorResult {
    return { message: this.message, code: this.code };
  }
}

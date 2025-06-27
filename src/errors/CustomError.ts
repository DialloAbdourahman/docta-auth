import { EnumStatusCode } from "../enums/status-codes";
import { ErrorResult } from "../utils/orchestration-result";

export abstract class CustomError extends Error {
  public readonly code: EnumStatusCode;
  public readonly statusCode: number;

  constructor(message: string, code: EnumStatusCode, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;

    // Maintains proper prototype chain for built-in Error
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeErrors(): ErrorResult;
}

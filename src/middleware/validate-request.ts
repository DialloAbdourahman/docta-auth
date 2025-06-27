import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { EnumStatusCode } from "../enums/status-codes";

export const validateRequest: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError(
      EnumStatusCode.VALIDATION_ERROR,
      `${errors
        .array()
        .map((error) => error.msg)
        .join("\n")}`
    );
  }
  next();
};

import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { EnumStatusCode } from "../enums/status-codes";

export const validationMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const object = plainToInstance(type, req.body);
      const errors = await validate(object, {
        skipMissingProperties,
        whitelist,
        forbidNonWhitelisted,
      });

      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(error.constraints ?? {})
          )
          .flat()
          .join(", ");
        return next(
          new BadRequestError(EnumStatusCode.VALIDATION_ERROR, message)
        );
      }

      req.body = object;
      next();
    } catch (err) {
      next(err);
    }
  };
};

import { RequestHandler } from "express";
import { body, ValidationChain } from "express-validator";
import { validateRequest } from "../middleware/validate-request";

// Type alias for Validator Middleware
type ValidatorMiddleware = ValidationChain | RequestHandler;

export class UserValidator {
  static validateSignup: ValidatorMiddleware[] = [
    body("email").isEmail().withMessage("Email must be valid"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    validateRequest,
  ];
}

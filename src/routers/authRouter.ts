import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { UserValidator } from "../utils/validate-input-data";

const router = Router();

// Route to create a new user
router.post("/", UserValidator.validateSignup, AuthController.createUser);

export default router;

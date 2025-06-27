import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

// Route to create a new user
router.post("/", AuthController.createUser);

export default router;

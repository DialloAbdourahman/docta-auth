import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// Route to create a new user
router.post("/", UserController.createUser);

export default router;

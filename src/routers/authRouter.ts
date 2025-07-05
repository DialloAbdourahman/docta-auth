import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreatePatientDto } from "../dto/input/user";

class AuthRouter {
  public readonly router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Route to create a new user (patient)
    this.router.post(
      "/",
      validationMiddleware(CreatePatientDto),
      this.authController.createUser
    );
  }
}

export default new AuthRouter().router;

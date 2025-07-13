import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreatePatientDto } from "../dto/input/patient";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
import { LoginDto } from "../dto/input/login";

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

    // Route to activate patient account given activation token
    this.router.get(
      "/activate/patient",
      this.authController.activatePatientUser
    );

    // Route to activate doctor account with token and password
    this.router.post(
      "/activate/doctor",
      validationMiddleware(ActivateDoctorAccountDto),
      this.authController.activateDoctorUser
    );

    // Login route
    this.router.post(
      "/login",
      validationMiddleware(LoginDto),
      this.authController.login
    );

    // Forgot password route
    // Reset password route
    // Logout route
    // Refresh token route
    // Update password route
    // Update account route (Just the name maybe which will automatically update the user's name in the doctor and patient collections)
  }
}

export default new AuthRouter().router;

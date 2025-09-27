import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreatePatientDto } from "../dto/input/patient";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto/input/user";

class AuthRouter {
  public readonly router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create patient route
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

    // Refresh token route
    this.router.post(
      "/refresh-token",
      validationMiddleware(RefreshTokenDto),
      this.authController.refreshToken
    );

    // Forgot password route
    this.router.post(
      "/forgot-password",
      validationMiddleware(ForgotPasswordDto),
      this.authController.forgotPassword
    );
    // Reset password route
    this.router.post(
      "/reset-password",
      validationMiddleware(ResetPasswordDto),
      this.authController.resetPassword
    );

    // Add a require auth and vefify roles middleware and make it in such a way that it should not call the db as it will be used in other services. Make sure to test well the case when a user's token has expired (require auth.)
    // Logout route
    // Update password route
    // Update account route (Just the name)
  }
}

export default new AuthRouter().router;

import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "docta-package";
import {
  ActivateAccountDto,
  CreateUserDto,
  UpdateUserDto,
} from "docta-package";
import { ActivateDoctorAccountDto } from "docta-package";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "docta-package";
import { UpdatePasswordDto } from "docta-package";
import { requireAuth } from "docta-package";

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
      validationMiddleware(CreateUserDto),
      this.authController.createUser
    );

    // Route to activate patient account given activation token
    this.router.post(
      "/activate/patient",
      validationMiddleware(ActivateAccountDto),
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

    // Update current user's info
    this.router.patch(
      "/me",
      requireAuth,
      validationMiddleware(UpdateUserDto),
      this.authController.updateUser
    );

    // Update current user's password
    this.router.patch(
      "/password",
      requireAuth,
      validationMiddleware(UpdatePasswordDto),
      this.authController.updatePassword
    );

    // Logout current user
    this.router.post("/logout", requireAuth, this.authController.logout);
  }
}

export default new AuthRouter().router;

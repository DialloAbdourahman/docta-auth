import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validate-request";
import {
  ActivateAccountDto,
  CreateUserDto,
  UpdateUserDto,
} from "../dto/input/user";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto/input/user";
import { UpdatePasswordDto } from "../dto/input/user";
import { requireAuth } from "../middleware/require-auth";

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

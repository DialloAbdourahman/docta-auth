import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "docta-package";
import { EnumStatusCode } from "docta-package";
import { ActivateAccountDto, CreateUserDto } from "docta-package";
import { ActivateDoctorAccountDto } from "docta-package";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "docta-package";
import { LoggedInUserOutputDto, UserOutputDto } from "docta-package";
import { BadRequestError } from "docta-package";
import { UpdateUserDto } from "docta-package";
import { UpdatePasswordDto } from "docta-package";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public createUser = async (req: Request, res: Response): Promise<void> => {
    const userData: CreateUserDto = req.body;

    await this.authService.createUserAndPatient(userData);

    res.status(201).json(
      OrchestrationResult.item({
        code: EnumStatusCode.CREATED_SUCCESSFULLY,
        message: "User created successfully.",
      })
    );
  };

  public activatePatientUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { token } = req.body as ActivateAccountDto;

    if (!token) {
      throw new BadRequestError(
        EnumStatusCode.VALIDATION_ERROR,
        "Enter a valid activation token"
      );
    }

    await this.authService.activatePatientUser(token);

    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Account activated successfully.",
      })
    );
  };

  public activateDoctorUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { token, password } = req.body as ActivateDoctorAccountDto;

    await this.authService.activateDoctorUser(token, password);

    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Doctor account activated successfully.",
      })
    );
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginDto;

    const result: LoggedInUserOutputDto = await this.authService.login(
      email,
      password
    );

    res.status(200).json(
      OrchestrationResult.item<LoggedInUserOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Login successful",
        data: result,
      })
    );
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body as RefreshTokenDto;

    const result: LoggedInUserOutputDto =
      await this.authService.refreshToken(refreshToken);

    res.status(200).json(
      OrchestrationResult.item<LoggedInUserOutputDto>({
        code: EnumStatusCode.TOKEN_REFRESHED,
        message: "Token refreshed successfully",
        data: result,
      })
    );
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email } = req.body as ForgotPasswordDto;

    await this.authService.forgotPassword(email);

    res.status(201).json(
      OrchestrationResult.item({
        code: EnumStatusCode.CREATED_SUCCESSFULLY,
        message: "Forgot password token created successfully.",
      })
    );
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, password } = req.body as ResetPasswordDto;

    await this.authService.resetPassword(token, password);

    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Password reset successfully.",
      })
    );
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateUserDto;

    const result = await this.authService.updateUserInfo(
      req.currentUser!.id,
      dto
    );

    res.status(200).json(
      OrchestrationResult.item<UserOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "User updated successfully.",
        data: result,
      })
    );
  };

  public updatePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { oldPassword, newPassword } = req.body as UpdatePasswordDto;

    await this.authService.updatePassword(
      req.currentUser!.id,
      oldPassword,
      newPassword
    );

    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Password updated successfully.",
      })
    );
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    await this.authService.logout(req.currentUser!.id);

    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Logged out successfully.",
      })
    );
  };
}

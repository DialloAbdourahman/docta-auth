import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreatePatientDto } from "../dto/input/patient";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto/input/user";
import { LoggedInUserOutputDto } from "../dto/output/user";
import { BadRequestError } from "../errors/BadRequestError";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public createUser = async (req: Request, res: Response): Promise<void> => {
    const userData: CreatePatientDto = req.body;

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
    const token: string = String(req.query.token || req.params.token || "");

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
}

import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreatePatientDto } from "../dto/input/patient";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
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
}

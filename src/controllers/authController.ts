import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreatePatientDto } from "../dto/input/user";

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
        code: EnumStatusCode.SUCCESS,
        message:
          "User created successfully. Activation token logged on server.",
      })
    );
  };
}

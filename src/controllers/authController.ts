import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreatePatientDto } from "../dto/user";

export class AuthController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    const userData: CreatePatientDto = req.body;
    await AuthService.createUserAndPatient(userData);
    res.status(201).json(
      OrchestrationResult.item({
        code: EnumStatusCode.SUCCESS,
        message:
          "User created successfully. Activation token logged on server.",
      })
    );
  }
}

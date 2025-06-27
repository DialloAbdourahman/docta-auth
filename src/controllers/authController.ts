import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";

export class AuthController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.body;
    const newUser = await AuthService.createUser(userData);
    res.status(201).json(
      OrchestrationResult.item<string>({
        code: EnumStatusCode.BAD_REQUEST,
        data: "some data from orchestration result",
        message: "User created successfully",
      })
    );
  }
}

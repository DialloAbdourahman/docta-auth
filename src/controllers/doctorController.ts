import { Request, Response } from "express";
import { DoctorService } from "../services/doctorService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreateUserDto } from "../dto/input/user";
import { ActivateDoctorAccountDto } from "../dto/input/doctor";
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto/input/user";
import { LoggedInUserOutputDto } from "../dto/output/user";
import { BadRequestError } from "../errors/BadRequestError";
import { UpdateUserDto } from "../dto/input/user";
import { UpdatePasswordDto } from "../dto/input/user";

export class DoctorController {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  //   public createUser = async (req: Request, res: Response): Promise<void> => {
  //     const userData: CreateUserDto = req.body;

  //     await this.doctorService.createUserAndPatient(userData);

  //     res.status(201).json(
  //       OrchestrationResult.item({
  //         code: EnumStatusCode.CREATED_SUCCESSFULLY,
  //         message: "User created successfully.",
  //       })
  //     );
  //   };
}

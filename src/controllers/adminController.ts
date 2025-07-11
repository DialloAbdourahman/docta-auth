import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreateDoctorDto } from "../dto/input/doctor";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public createDoctor = async (req: Request, res: Response): Promise<void> => {
    const dto: CreateDoctorDto = req.body;

    await this.adminService.createDoctorProfile(dto);

    res.status(201).json(
      OrchestrationResult.item({
        code: EnumStatusCode.CREATED_SUCCESSFULLY,
        message: "Doctor profile created successfully.",
      })
    );
  };
}

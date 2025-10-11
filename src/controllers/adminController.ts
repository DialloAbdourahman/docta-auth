import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { OrchestrationResult } from "../utils/orchestration-result";
import { EnumStatusCode } from "../enums/status-codes";
import { CreateDoctorDto } from "../dto/input/doctor";
import { CreateSpecialtyDto, UpdateSpecialtyDto } from "../dto/input/specialty";
import {
  SpecialtyAdminOutputDto,
  SpecialtyOutputDto,
} from "../dto/output/specialty";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public createDoctor = async (req: Request, res: Response): Promise<void> => {
    const dto: CreateDoctorDto = req.body;

    await this.adminService.createDoctorProfile(dto, req.currentUser!);

    res.status(201).json(
      OrchestrationResult.item({
        code: EnumStatusCode.CREATED_SUCCESSFULLY,
        message: "Doctor profile created successfully.",
      })
    );
  };

  public createSpecialty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const dto: CreateSpecialtyDto = req.body;
    const result = await this.adminService.createSpecialty(
      dto,
      req.currentUser!
    );
    res.status(201).json(
      OrchestrationResult.item<SpecialtyOutputDto>({
        code: EnumStatusCode.CREATED_SUCCESSFULLY,
        message: "Specialty created successfully.",
        data: result,
      })
    );
  };

  public updateSpecialty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = req.params.id;
    const dto: UpdateSpecialtyDto = req.body;
    const result = await this.adminService.updateSpecialty(
      id,
      dto,
      req.currentUser!
    );
    res.status(200).json(
      OrchestrationResult.item<SpecialtyOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Specialty updated successfully.",
        data: result,
      })
    );
  };

  public deleteSpecialty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = req.params.id;
    await this.adminService.deleteSpecialty(id, req.currentUser!);
    res.status(200).json(
      OrchestrationResult.item({
        code: EnumStatusCode.DELETED_SUCCESSFULLY,
        message: "Specialty deleted successfully.",
      })
    );
  };

  public listSpecialties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const itemsPerPage = Math.max(
      1,
      parseInt(String(req.query.itemsPerPage || "10"), 10)
    );

    const { items, totalItems } = await this.adminService.listSpecialties(
      page,
      itemsPerPage
    );

    res.status(200).json(
      OrchestrationResult.paginated<SpecialtyAdminOutputDto>({
        code: EnumStatusCode.RECOVERED_SUCCESSFULLY,
        message: "Specialties fetched successfully.",
        data: items,
        totalItems,
        itemsPerPage,
        page,
      })
    );
  };
}

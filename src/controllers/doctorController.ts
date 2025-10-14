import { Request, Response } from "express";
import { DoctorService } from "../services/doctorService";
import { OrchestrationResult } from "docta-package";
import { EnumStatusCode } from "docta-package";
import { UpdateDoctorDto } from "docta-package";
import { BadRequestError } from "docta-package";
import { DoctorOutputDto } from "docta-package";

export class DoctorController {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  //   public createUser = async (req: Request, res: Response): Promise<void> => {
  //     const userData: CreateUserDto = req.body;

  //     res.status(201).json(
  //       OrchestrationResult.item({
  //         code: EnumStatusCode.CREATED_SUCCESSFULLY,
  //         message: "User created successfully.",
  //       })
  //     );
  //   };

  public updateMyDoctor = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const dto = req.body as UpdateDoctorDto;

    const result = await this.doctorService.updateMyDoctorInfo(
      req.currentUser!.id,
      dto
    );

    res.status(200).json(
      OrchestrationResult.item<DoctorOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Doctor profile updated successfully.",
        data: result,
      })
    );
  };

  public getMyDoctor = async (req: Request, res: Response): Promise<void> => {
    const result = await this.doctorService.getMyDoctor(req.currentUser!.id);

    res.status(200).json(
      OrchestrationResult.item<DoctorOutputDto>({
        code: EnumStatusCode.RECOVERED_SUCCESSFULLY,
        message: "Doctor profile fetched successfully.",
        data: result,
      })
    );
  };

  public uploadMyPhoto = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;

    if (!file) {
      throw new BadRequestError(
        EnumStatusCode.NO_FILE_UPLOADED,
        "No file uploaded."
      );
    }
    const output = await this.doctorService.uploadMyPhoto(
      req.currentUser!.id,
      file
    );
    res.status(200).json(
      OrchestrationResult.item<DoctorOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Profile photo updated successfully.",
        data: output,
      })
    );
  };
}

import { Request, Response } from "express";
import { OrchestrationResult } from "docta-package";
import { EnumStatusCode } from "docta-package";
import { UpdatePatientDto } from "docta-package";
import { PatientAdminOutputDto, PatientOutputDto } from "docta-package";
import { PatientService } from "../services/patientService";

export class PatientController {
  private patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
  }

  public updateMyPatient = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const dto = req.body as UpdatePatientDto;

    const result = await this.patientService.updateMyPatientInfo(
      req.currentUser!.id,
      dto
    );

    res.status(200).json(
      OrchestrationResult.item<PatientOutputDto>({
        code: EnumStatusCode.UPDATED_SUCCESSFULLY,
        message: "Patient profile updated successfully.",
        data: result,
      })
    );
  };

  public getMyPatient = async (req: Request, res: Response): Promise<void> => {
    const result = await this.patientService.getMyPatient(req.currentUser!.id);

    res.status(200).json(
      OrchestrationResult.item<PatientAdminOutputDto>({
        code: EnumStatusCode.RECOVERED_SUCCESSFULLY,
        message: "Patient profile fetched successfully.",
        data: result,
      })
    );
  };
}

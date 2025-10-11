import { Router } from "express";
import { PatientController } from "../controllers/patientController";
import { validationMiddleware } from "../middleware/validate-request";
import { UpdatePatientDto } from "../dto/input/patient";
import { requireAuth } from "../middleware/require-auth";
import { EnumUserRole } from "../enums/user-role";
import { verifyRoles } from "../middleware/verify-roles";

class PatientRouter {
  public router: Router;
  private controller: PatientController;

  constructor() {
    this.router = Router();
    this.controller = new PatientController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Update my patient profile information.
    this.router.patch(
      "/me",
      requireAuth,
      verifyRoles([EnumUserRole.PATIENT]),
      validationMiddleware(UpdatePatientDto),
      this.controller.updateMyPatient
    );
  }
}

export default new PatientRouter().router;


import { Router } from "express";
import { PatientController } from "../controllers/patientController";
import { validationMiddleware } from "docta-package";
import { UpdatePatientDto } from "docta-package";
import { requireAuth } from "docta-package";
import { EnumUserRole } from "docta-package";
import { verifyRoles } from "docta-package";

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

    // Get my patient profile
    this.router.get(
      "/me",
      requireAuth,
      verifyRoles([EnumUserRole.PATIENT]),
      this.controller.getMyPatient
    );
  }
}

export default new PatientRouter().router;

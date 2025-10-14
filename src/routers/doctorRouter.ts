import { Router } from "express";
import { DoctorController } from "../controllers/doctorController";
import { validationMiddleware } from "docta-package";
import { UpdateDoctorDto } from "docta-package";
import { requireAuth } from "docta-package";
import { EnumUserRole } from "docta-package";
import { verifyRoles } from "docta-package";
import { uploadSingleImage } from "docta-package";

class DoctorRouter {
  public router: Router;
  private controller: DoctorController;

  constructor() {
    this.router = Router();
    this.controller = new DoctorController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.patch(
      "/me",
      requireAuth,
      verifyRoles([EnumUserRole.DOCTOR]),
      validationMiddleware(UpdateDoctorDto),
      this.controller.updateMyDoctor
    );
    // Get my doctor's profile
    this.router.get(
      "/me",
      requireAuth,
      verifyRoles([EnumUserRole.DOCTOR]),
      this.controller.getMyDoctor
    );

    // Upload my profile photo
    this.router.post(
      "/me/photo",
      requireAuth,
      verifyRoles([EnumUserRole.DOCTOR]),
      ...uploadSingleImage("photo"),
      this.controller.uploadMyPhoto
    );
  }
}

export default new DoctorRouter().router;

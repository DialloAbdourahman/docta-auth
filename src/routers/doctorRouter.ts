import { Router } from "express";
import { DoctorController } from "../controllers/doctorController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreateDoctorDto, UpdateDoctorDto } from "../dto/input/doctor";
import { requireAuth } from "../middleware/require-auth";
import { EnumUserRole } from "../enums/user-role";
import { verifyRoles } from "../middleware/verify-roles";
import { uploadSingleImage } from "../middleware/multer";

class DoctorRouter {
  public router: Router;
  private controller: DoctorController;

  constructor() {
    this.router = Router();
    this.controller = new DoctorController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(
    //   "/doctors",
    //   requireAuth,
    //   verifyRoles([EnumUserRole.ADMIN]),
    //   validationMiddleware(CreateDoctorDto),
    //   this.controller.createDoctor
    // );
    // Update my doctor profile information.
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

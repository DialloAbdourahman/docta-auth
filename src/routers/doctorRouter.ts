import { Router } from "express";
import { DoctorController } from "../controllers/doctorController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreateDoctorDto } from "../dto/input/doctor";
import { requireAuth } from "../middleware/require-auth";
import { EnumUserRole } from "../enums/user-role";
import { verifyRoles } from "../middleware/verify-roles";

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
    // Get my doctor's profile
  }
}

export default new DoctorRouter().router;

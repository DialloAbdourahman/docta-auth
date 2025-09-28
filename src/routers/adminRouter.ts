import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreateDoctorDto } from "../dto/input/doctor";
import { requireAuth } from "../middleware/require-auth";
import { EnumUserRole } from "../enums/user-role";
import { verifyRoles } from "../middleware/verify-roles";

class AdminRouter {
  public router: Router;
  private controller: AdminController;

  constructor() {
    this.router = Router();
    this.controller = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/doctors",
      requireAuth,
      verifyRoles([EnumUserRole.ADMIN]),
      validationMiddleware(CreateDoctorDto),
      this.controller.createDoctor
    );
  }

  // Deactive doctors.
  // Delete doctors.
  // Delete patients.
  // CRUD Specialties.
}

export default new AdminRouter().router;

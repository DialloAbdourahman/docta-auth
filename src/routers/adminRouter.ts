import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreateDoctorDto } from "../dto/input/doctor";
import { CreateSpecialtyDto, UpdateSpecialtyDto } from "../dto/input/specialty";
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

    // Specialties
    this.router.post(
      "/specialties",
      requireAuth,
      verifyRoles([EnumUserRole.ADMIN]),
      validationMiddleware(CreateSpecialtyDto),
      this.controller.createSpecialty
    );

    this.router.patch(
      "/specialties/:id",
      requireAuth,
      verifyRoles([EnumUserRole.ADMIN]),
      validationMiddleware(UpdateSpecialtyDto),
      this.controller.updateSpecialty
    );

    this.router.delete(
      "/specialties/:id",
      requireAuth,
      verifyRoles([EnumUserRole.ADMIN]),
      this.controller.deleteSpecialty
    );

    this.router.get(
      "/specialties",
      requireAuth,
      verifyRoles([EnumUserRole.ADMIN]),
      this.controller.listSpecialties
    );
  }
}

export default new AdminRouter().router;

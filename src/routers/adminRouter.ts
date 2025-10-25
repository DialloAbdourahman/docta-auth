import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validationMiddleware } from "docta-package";
import { CreateDoctorDto } from "docta-package";
import { requireAuth } from "docta-package";
import { EnumUserRole } from "docta-package";
import { verifyRoles } from "docta-package";

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
}

export default new AdminRouter().router;

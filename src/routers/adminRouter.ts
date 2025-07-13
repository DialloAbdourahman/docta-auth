import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { validationMiddleware } from "../middleware/validate-request";
import { CreateDoctorDto } from "../dto/input/doctor";

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
      validationMiddleware(CreateDoctorDto),
      this.controller.createDoctor
    );
  }

  // Deactive doctors.
  // Deactivate patients.
  // Delete doctors.
  // Delete patients.
}

export default new AdminRouter().router;

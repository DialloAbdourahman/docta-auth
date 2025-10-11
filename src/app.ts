import express from "express";
import expressAsyncHandler from "express-async-handler";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routers/authRouter";
import adminRouter from "./routers/adminRouter";
import { swaggerSpec } from "./swagger";
import doctorRouter from "./routers/doctorRouter";
import patientRouter from "./routers/patientRouter";

const app = express();

app.use(express.json());

// Swagger documentation route
app.use("/api/auth/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth/v1", expressAsyncHandler(authRouter));
app.use("/api/auth/v1/admin", expressAsyncHandler(adminRouter));
app.use("/api/auth/v1/doctor", expressAsyncHandler(doctorRouter));
app.use("/api/auth/v1/patient", expressAsyncHandler(patientRouter));

app.use(errorHandler);

// app.all("*", () => {
//   throw new NotFoundError();
// });

export default app;

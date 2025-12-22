import express from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandler, logger } from "docta-package";
import authRouter from "./routers/authRouter";
import adminRouter from "./routers/adminRouter";
import { swaggerSpec } from "./swagger";
import doctorRouter from "./routers/doctorRouter";
import patientRouter from "./routers/patientRouter";

const app = express();

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`, {
    method: req.method,
    route: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
    ip: req.ip,
  });
  next();
});

// Swagger documentation route
app.use("/api/auth/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth/v1", authRouter);
app.use("/api/auth/v1/admin", adminRouter);
app.use("/api/auth/v1/doctor", doctorRouter);
app.use("/api/auth/v1/patient", patientRouter);

app.use(errorHandler);

// app.all("*", () => {
//   throw new NotFoundError();
// });

export default app;

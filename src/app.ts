import express from "express";
import expressAsyncHandler from "express-async-handler";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routers/authRouter";
import adminRouter from "./routers/adminRouter";
import { swaggerSpec } from "./swagger";

const app = express();

app.use(express.json());

// Swagger documentation route
app.use("/api/auth/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth/v1", expressAsyncHandler(authRouter));
app.use("/api/admin/v1", expressAsyncHandler(adminRouter));

// app.all("*", () => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export default app;

import express from "express";
import expressAsyncHandler from "express-async-handler"; //TODO: Not sure it is needed anymore
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routers/authRouter";

const app = express();

app.use(express.json());

app.use("/api/auth/v1", expressAsyncHandler(authRouter));

// app.all("*", () => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export default app;

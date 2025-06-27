import express from "express";
import expressAsyncHandler from "express-async-handler"; //TODO: Not sure it is needed anymore
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/auth";
import { UserValidator } from "./middleware/validate-signup";

const app = express();

app.use(express.json());

app.use(
  "/api/auth/v1",
  UserValidator.validateSignup,
  expressAsyncHandler(authRouter)
);

// app.all("*", () => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export default app;

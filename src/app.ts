import express from "express";
import expressAsyncHandler from "express-async-handler"; //TODO: Not sure it is needed anymore
import { errorHandler } from "./middleware/errorHandler";
import userRouter from "./routes/user";
import { UserValidator } from "./middleware/validate-signup";

const app = express();

app.use(express.json());

app.use(
  "/api/user/v1",
  UserValidator.validateSignup,
  expressAsyncHandler(userRouter)
);

// app.all("*", () => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export default app;
